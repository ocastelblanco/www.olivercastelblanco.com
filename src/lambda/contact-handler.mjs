const ALLOWED_ORIGINS = ['https://ocastelblanco.com'];
// Lambda Function URLs del stage preview también son orígenes válidos
const LAMBDA_URL_RE = /^https:\/\/[a-z0-9]+\.lambda-url\.us-east-1\.on\.aws$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function corsHeaders(origin) {
  const allowed =
    ALLOWED_ORIGINS.includes(origin) || LAMBDA_URL_RE.test(origin)
      ? origin
      : ALLOWED_ORIGINS[0];
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
