import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';

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

const CONTACT_FROM = 'contacto@ocastelblanco.com';
const CONTACT_TO = 'ocastelblanco@gmail.com';
const ses = new SESv2Client({});

// ADR-016 — anti-spam con reCAPTCHA v3. Vacío en dev/preview: sin secreto, la
// verificación se omite (mismo criterio que CONTENT_BUCKET en lab-handler.mjs).
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET || '';
// URL hardcodeada, nunca derivada de input del usuario (CLAUDE.md §6 A10, SSRF).
const RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';
const RECAPTCHA_MIN_SCORE = 0.5;
const RECAPTCHA_ACTION = 'contact';

/**
 * Verifica un token de reCAPTCHA v3 contra Google. Fail-open si Google no
 * responde: un portafolio prefiere un spam ocasional a perder un contacto
 * real por la caída de un tercero. El fallo se registra para monitoreo.
 */
async function verifyRecaptcha(token, remoteIp) {
  if (!RECAPTCHA_SECRET) {
    return { ok: true, skipped: true };
  }
  if (!token) {
    return { ok: false, reason: 'missing-token' };
  }

  try {
    const params = new URLSearchParams({ secret: RECAPTCHA_SECRET, response: token });
    if (remoteIp) params.set('remoteip', remoteIp);

    const res = await fetch(RECAPTCHA_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });
    const data = await res.json();
    const score = typeof data.score === 'number' ? data.score : null;

    if (!data.success || data.action !== RECAPTCHA_ACTION || score === null || score < RECAPTCHA_MIN_SCORE) {
      return { ok: false, reason: 'rejected', score, success: data.success, action: data.action };
    }
    return { ok: true, score };
  } catch (err) {
    console.error(JSON.stringify({ event: 'recaptcha_verify_failed', error: err.message }));
    return { ok: true, skipped: true, error: err.message };
  }
}

// El Subject viaja como header de correo — a diferencia del body (Text, no
// ejecutable), un salto de línea ahí sí es una forma de inyección de headers.
// `name` es input de usuario libre, así que se sanea solo para este uso.
const stripLineBreaks = (s) => s.replace(/[\r\n]+/g, ' ').trim();

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

// Auto-respuesta al visitante. Es un "nice to have": si falla, no debe
// afectar el statusCode de la respuesta HTTP ni el flujo principal — el
// mensaje del visitante ya llegó a CONTACT_TO cuando esta función se llama.
async function sendAutoReply(name, email) {
  try {
    await ses.send(
      new SendEmailCommand({
        FromEmailAddress: CONTACT_FROM,
        Destination: { ToAddresses: [email] },
        Content: {
          Simple: {
            Subject: { Data: 'Recibí tu mensaje — Oliver Castelblanco' },
            Body: {
              Text: {
                Data: `Hola ${stripLineBreaks(name)},\n\nGracias por escribirme. Recibí tu mensaje y te responderé lo antes posible.\n\nSaludos,\nOliver Castelblanco`,
              },
            },
          },
        },
      }),
    );
    console.log(JSON.stringify({ event: 'autoreply_send_ok', email }));
  } catch (err) {
    console.error(JSON.stringify({ event: 'autoreply_send_failed', error: err.message }));
  }
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

  const sourceIp = event.requestContext?.http?.sourceIp;
  const recaptcha = await verifyRecaptcha(body.recaptchaToken, sourceIp);

  console.log(
    JSON.stringify({
      event: 'contact_message',
      name,
      email,
      messageLength: message.length,
      ip: sourceIp,
      recaptchaScore: recaptcha.score ?? null,
      recaptchaSkipped: recaptcha.skipped ?? false,
      timestamp: new Date().toISOString(),
    }),
  );

  if (!recaptcha.ok) {
    return json(403, { error: 'Verificación de seguridad fallida.' }, origin);
  }

  try {
    await ses.send(
      new SendEmailCommand({
        FromEmailAddress: CONTACT_FROM,
        Destination: { ToAddresses: [CONTACT_TO] },
        // `email` ya pasó EMAIL_RE, que excluye \s — no hay inyección de
        // headers posible a través de este campo.
        ReplyToAddresses: [email],
        Content: {
          Simple: {
            Subject: { Data: `Nuevo mensaje de contacto — ${stripLineBreaks(name)}` },
            Body: {
              Text: { Data: `Nombre: ${name}\nEmail: ${email}\n\n${message}` },
            },
          },
        },
      }),
    );
  } catch (err) {
    console.error(JSON.stringify({ event: 'contact_send_failed', error: err.message }));
    return json(502, { error: 'No se pudo enviar el mensaje. Intenta de nuevo.' }, origin);
  }

  // El mensaje al dueño ya se envió con éxito — un fallo acá solo se
  // registra, nunca cambia el 200 de esta respuesta.
  await sendAutoReply(name, email);

  return json(200, { ok: true }, origin);
};
