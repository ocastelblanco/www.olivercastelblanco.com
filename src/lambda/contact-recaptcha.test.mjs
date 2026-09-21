/**
 * Pruebas de la verificación de reCAPTCHA v3 en el endpoint de contacto (ADR-016).
 *
 *   node --test src/lambda/
 *
 * Mockea `globalThis.fetch` con `mock.fn()` (API estable de `node:test`, sin
 * flags). Para el SDK de SES se evita a propósito `mock.module()` — es
 * experimental y su comportamiento difiere entre versiones de Node (falló en
 * CI con Node 22.23.2 pese a funcionar en local con Node 24: "does not
 * provide an export named 'SESv2Client'"). En su lugar se parchea
 * `SESv2Client.prototype.send` directamente, una técnica estándar de
 * monkey-patching que no depende de ninguna característica experimental y
 * funciona igual en cualquier versión de Node.
 * `RECAPTCHA_SECRET` se fija por `process.env` **antes** de importar el módulo,
 * porque el handler lo lee una sola vez al cargar (mismo patrón que
 * `ALLOWED_ORIGINS` ya usa en este archivo).
 */

import { test, beforeEach, afterEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import { SESv2Client } from '@aws-sdk/client-sesv2';

process.env.RECAPTCHA_SECRET = 'test-secret';
process.env.ALLOWED_ORIGINS = 'https://ocastelblanco.com';

// `send` vive en el prototipo (heredado de la clase base `Client` del SDK) —
// sobreescribirlo en `SESv2Client.prototype` crea una propiedad propia que
// intercepta la llamada para cualquier instancia, sin tocar credenciales de
// AWS ni hacer red real.
SESv2Client.prototype.send = async () => ({});

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
