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
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isAllowedOrigin(origin) {
  return ALLOWED_ORIGINS.includes(origin) || (ALLOWED_ORIGIN_REGEX?.test(origin) ?? false);
}

function corsHeaders(origin) {
  const allowed = isAllowedOrigin(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
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

export const handler = async (event) => {
  const origin = event.headers?.origin ?? event.headers?.Origin ?? '';

  if (event.requestContext?.http?.method === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders(origin), body: '' };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'Invalid JSON' }, origin);
  }

  // Honeypot — bots fill this field; legitimate users never see it
  if (body.website) {
    return json(200, { ok: true }, origin);
  }

  const name = (body.name || '').trim();
  const email = (body.email || '').trim();
  const message = (body.message || '').trim();

  const errors = [];
  if (name.length < 2) errors.push('name');
  if (!EMAIL_RE.test(email)) errors.push('email');
  if (message.length < 10) errors.push('message');

  if (errors.length > 0) {
    return json(400, { error: 'Validation failed', fields: errors }, origin);
  }

  console.log(
    JSON.stringify({
      event: 'contact_message',
      name,
      email,
      messageLength: message.length,
      ip: event.requestContext?.http?.sourceIp,
      timestamp: new Date().toISOString(),
    }),
  );

  return json(200, { ok: true }, origin);
};
