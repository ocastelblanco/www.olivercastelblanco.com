/**
 * Validación de `fecha` en `POST /lab` — solo se ejercitan los caminos que
 * responden antes de tocar S3 (401/400), así que no hace falta mockear el SDK.
 * Las variables de entorno se fijan antes del import porque el handler las lee
 * una sola vez al cargar el módulo.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

process.env.LAB_PUBLISH_TOKEN = 'token-de-prueba';
process.env.ALLOWED_ORIGINS = 'https://ocastelblanco.com';

const { handler } = await import('./lab-handler.mjs');

function makeEvent(entries) {
  return {
    headers: { origin: 'https://ocastelblanco.com', 'x-lab-token': 'token-de-prueba' },
    requestContext: { http: { method: 'POST' } },
    body: JSON.stringify(entries),
  };
}

const entrada = (fecha) => ({ id: '1', fecha, tags: ['a'], texto: { es: 'hola', en: 'hi' } });

test('rechaza una fecha serializada desde un objeto Date de Apps Script', async () => {
  const res = await handler(
    makeEvent([entrada('Fri Nov 27 2026 00:00:00 GMT-0500 (hora estándar de Colombia)')]),
  );
  assert.equal(res.statusCode, 400);
  assert.equal(JSON.parse(res.body).detail, 'entries[0].fecha');
});

test('rechaza fechas con formato distinto de AAAA-MM-DD', async () => {
  for (const fecha of ['27/11/2026', '2026-11-27T00:00:00Z', '2026-1-5', '']) {
    const res = await handler(makeEvent([entrada(fecha)]));
    assert.equal(res.statusCode, 400, `debería rechazar "${fecha}"`);
  }
});

test('el detalle del 400 apunta a la entrada con la fecha inválida', async () => {
  const res = await handler(makeEvent([entrada('2026-11-27'), entrada('basura')]));
  assert.equal(res.statusCode, 400);
  assert.equal(JSON.parse(res.body).detail, 'entries[1].fecha');
});
