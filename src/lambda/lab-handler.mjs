// Allowlist inyectada por stage (ver serverless.yml custom.corsOrigins /
// corsOriginRegex) — production solo acepta el dominio real, preview además
// acepta su propia Lambda Function URL.
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const ALLOWED_ORIGIN_REGEX = process.env.ALLOWED_ORIGIN_REGEX
  ? new RegExp(process.env.ALLOWED_ORIGIN_REGEX)
  : null;

function isAllowedOrigin(origin) {
  return ALLOWED_ORIGINS.includes(origin) || (ALLOWED_ORIGIN_REGEX?.test(origin) ?? false);
}

function corsHeaders(origin) {
  const allowed = isAllowedOrigin(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-lab-token',
    'Access-Control-Max-Age': '86400',
  };
}

function json(statusCode, body, origin) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
    body: JSON.stringify(body),
  };
}

/**
 * Valida que `entry` tenga la forma de un `LabEntry`:
 * { id: string, fecha: string, tags: string[], texto: { es: string, en: string } }
 * Devuelve el nombre del primer campo inválido, o null si es válido.
 */
function validateEntry(entry, index) {
  const prefix = `entries[${index}]`;
  if (typeof entry !== 'object' || entry === null) return `${prefix}: no es un objeto`;
  if (typeof entry.id !== 'string' || entry.id.length === 0) return `${prefix}.id`;
  if (typeof entry.fecha !== 'string' || entry.fecha.length === 0) return `${prefix}.fecha`;
  if (!Array.isArray(entry.tags) || !entry.tags.every((tag) => typeof tag === 'string')) {
    return `${prefix}.tags`;
  }
  if (typeof entry.texto !== 'object' || entry.texto === null) return `${prefix}.texto`;
  if (typeof entry.texto.es !== 'string') return `${prefix}.texto.es`;
  if (typeof entry.texto.en !== 'string') return `${prefix}.texto.en`;
  return null;
}

export const handler = async (event) => {
  const origin = event.headers?.origin ?? event.headers?.Origin ?? '';

  if (event.requestContext?.http?.method === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders(origin), body: '' };
  }

  const token = event.headers?.['x-lab-token'] ?? event.headers?.['X-Lab-Token'] ?? '';
  if (token !== process.env.LAB_PUBLISH_TOKEN || !process.env.LAB_PUBLISH_TOKEN) {
    return json(401, { error: 'Unauthorized' }, origin);
  }

  let body;
  try {
    body = JSON.parse(event.body || '[]');
  } catch {
    return json(400, { error: 'Invalid JSON' }, origin);
  }

  if (!Array.isArray(body)) {
    return json(400, { error: 'Validation failed', detail: 'El body debe ser un array de LabEntry' }, origin);
  }

  for (let i = 0; i < body.length; i++) {
    const invalidField = validateEntry(body[i], i);
    if (invalidField) {
      return json(400, { error: 'Validation failed', detail: invalidField }, origin);
    }
  }

  // TODO: escribir a S3 con @aws-sdk/client-s3 cuando el bucket de contenido exista
  // (ver Tarea 2 del TODO.md). Por ahora solo se valida el payload y se responde el stub.

  return json(200, { ok: true, received: body.length }, origin);
};
