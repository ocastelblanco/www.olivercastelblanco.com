/**
 * Caso "sin RECAPTCHA_SECRET configurado" (dev/preview, ADR-016) — en archivo
 * aparte porque el handler lee `process.env.RECAPTCHA_SECRET` una sola vez al
 * importar el módulo (mismo patrón que `ALLOWED_ORIGINS`); `node --test` corre
 * cada archivo `.test.mjs` en su propio proceso, así que este test no compite
 * por el valor de la variable con `contact-recaptcha.test.mjs`.
 */

import { test, afterEach, mock } from 'node:test';
import assert from 'node:assert/strict';

delete process.env.RECAPTCHA_SECRET;
process.env.ALLOWED_ORIGINS = 'https://ocastelblanco.com';

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

function makeEvent(body) {
  return {
    headers: { origin: 'https://ocastelblanco.com' },
    requestContext: { http: { method: 'POST', sourceIp: '203.0.113.1' } },
    body: JSON.stringify(body),
  };
}

afterEach(() => {
  mock.reset();
});

test('sin RECAPTCHA_SECRET: omite la verificación y envía el correo igual', async () => {
  globalThis.fetch = mock.fn(async () => {
    throw new Error('no debería llamarse a Google sin secreto configurado');
  });

  const res = await handler(makeEvent({ ...VALID_FIELDS, recaptchaToken: null }));

  assert.equal(res.statusCode, 200);
  assert.equal(globalThis.fetch.mock.callCount(), 0);
});
