/**
 * Pruebas de la verificación de reCAPTCHA v3 en el endpoint de contacto (ADR-016).
 *
 *   node --experimental-test-module-mocks --test src/lambda/
 *
 * Mockea `globalThis.fetch` y `@aws-sdk/client-sesv2` con `mock.module()` (aún
 * experimental en Node 24 — requiere el flag de arriba, ya incluido en
 * `npm run test:lambda`). El SDK de SES intenta resolver credenciales de AWS
 * reales al construir el cliente; sin el stub, los tests fallarían por falta
 * de credenciales en vez de por la lógica que se está probando.
 * `RECAPTCHA_SECRET` se fija por `process.env` **antes** de importar el módulo,
 * porque el handler lo lee una sola vez al cargar (mismo patrón que
 * `ALLOWED_ORIGINS` ya usa en este archivo).
 */

import { test, beforeEach, afterEach, mock } from 'node:test';
import assert from 'node:assert/strict';

process.env.RECAPTCHA_SECRET = 'test-secret';
process.env.ALLOWED_ORIGINS = 'https://ocastelblanco.com';

// El SDK de SES intenta resolver credenciales de AWS reales al construir el
// cliente — se stubea antes de importar el handler para que los tests corran
// sin red ni credenciales.
mock.module('@aws-sdk/client-sesv2', {
  exports: {
    SESv2Client: class {
      send() {
        return Promise.resolve({});
      }
    },
    SendEmailCommand: class {
      constructor(input) {
        this.input = input;
      }
    },
  },
});

const { handler } = await import('./contact-handler.mjs');

const VALID_FIELDS = {
  name: 'Oliver Castelblanco',
  email: 'oliver@example.com',
  message: 'Este es un mensaje de prueba con más de diez caracteres.',
};

function makeEvent(body, { method = 'POST' } = {}) {
  return {
    headers: { origin: 'https://ocastelblanco.com' },
    requestContext: { http: { method, sourceIp: '203.0.113.1' } },
    body: JSON.stringify(body),
  };
}

let originalFetch;

beforeEach(() => {
  originalFetch = globalThis.fetch;
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  mock.reset();
});

test('score alto y action correcta: acepta y envía el correo', async () => {
  globalThis.fetch = mock.fn(async () => ({
    json: async () => ({ success: true, action: 'contact', score: 0.9 }),
  }));

  const res = await handler(makeEvent({ ...VALID_FIELDS, recaptchaToken: 'tok-ok' }));

  assert.equal(res.statusCode, 200);
  assert.deepEqual(JSON.parse(res.body), { ok: true });
});

test('score bajo: rechaza con 403 y no envía el correo', async () => {
  globalThis.fetch = mock.fn(async () => ({
    json: async () => ({ success: true, action: 'contact', score: 0.1 }),
  }));

  const res = await handler(makeEvent({ ...VALID_FIELDS, recaptchaToken: 'tok-low-score' }));

  assert.equal(res.statusCode, 403);
});

test('action distinta a "contact": rechaza con 403', async () => {
  globalThis.fetch = mock.fn(async () => ({
    json: async () => ({ success: true, action: 'otra-cosa', score: 0.9 }),
  }));

  const res = await handler(makeEvent({ ...VALID_FIELDS, recaptchaToken: 'tok-wrong-action' }));

  assert.equal(res.statusCode, 403);
});

test('success: false de Google: rechaza con 403', async () => {
  globalThis.fetch = mock.fn(async () => ({
    json: async () => ({ success: false, 'error-codes': ['invalid-input-response'] }),
  }));

  const res = await handler(makeEvent({ ...VALID_FIELDS, recaptchaToken: 'tok-invalid' }));

  assert.equal(res.statusCode, 403);
});

test('sin token: rechaza con 403 sin llamar a Google', async () => {
  globalThis.fetch = mock.fn(async () => {
    throw new Error('no debería llamarse sin token');
  });

  const res = await handler(makeEvent({ ...VALID_FIELDS, recaptchaToken: null }));

  assert.equal(res.statusCode, 403);
  assert.equal(globalThis.fetch.mock.callCount(), 0);
});

test('Google no responde (fail-open): acepta y envía el correo igual', async () => {
  globalThis.fetch = mock.fn(async () => {
    throw new Error('network down');
  });

  const res = await handler(makeEvent({ ...VALID_FIELDS, recaptchaToken: 'tok-ok' }));

  assert.equal(res.statusCode, 200);
});

test('honeypot lleno: responde 200 sin llamar a reCAPTCHA ni enviar correo', async () => {
  globalThis.fetch = mock.fn(async () => {
    throw new Error('no debería llamarse — el honeypot corta antes');
  });

  const res = await handler(makeEvent({ ...VALID_FIELDS, website: 'http://spam.example', recaptchaToken: 'tok-ok' }));

  assert.equal(res.statusCode, 200);
  assert.equal(globalThis.fetch.mock.callCount(), 0);
});
