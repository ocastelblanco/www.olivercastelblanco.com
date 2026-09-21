export const environment = {
  production: true,
  apiUrl: 'https://preview-api.ocastelblanco.com',
  // TODO(Tarea 4 — Assets + behaviors CloudFront): el stage preview todavía no
  // tiene un CDN delante de su bucket de contenido, así que usa el fixture de
  // dev hasta que exista una forma de servir `content/lab.json` públicamente.
  labContentUrl: 'content/lab.dev.json',
  // Vacío — mismo motivo que en dev: sin endpoint público para el fixture ni
  // servidor real durante el build, el fetch SSR se omite (ADR-011).
  labContentSsrUrl: '',
  // Vacío en preview — mismo criterio que dev (ADR-015), evita contaminar GA4.
  gaMeasurementId: '',
  // Vacío en preview — sin claves de reCAPTCHA (ADR-016), verificación omitida.
  recaptchaSiteKey: '',
};
