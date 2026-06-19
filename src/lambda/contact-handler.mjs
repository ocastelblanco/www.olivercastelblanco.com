const ALLOWED_ORIGIN = 'https://ocastelblanco.com';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
    body: JSON.stringify(body),
  };
}

export const handler = async (event) => {
  if (event.requestContext?.http?.method === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'Invalid JSON' });
  }

  // Honeypot — bots fill this field; legitimate users never see it
  if (body.website) {
    return json(200, { ok: true });
  }

  const name = (body.name || '').trim();
  const email = (body.email || '').trim();
  const message = (body.message || '').trim();

  const errors = [];
  if (name.length < 2) errors.push('name');
  if (!EMAIL_RE.test(email)) errors.push('email');
  if (message.length < 10) errors.push('message');

  if (errors.length > 0) {
    return json(400, { error: 'Validation failed', fields: errors });
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

  return json(200, { ok: true });
};
