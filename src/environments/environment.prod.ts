export const environment = {
  production: true,
  apiUrl: 'https://api.ocastelblanco.com',
  // Same-origin: una sola distribución CloudFront con dos orígenes (ADR-012).
  // `cdn.ocastelblanco.com` fue descartado — evita el preflight CORS.
  labContentUrl: '/content/lab.json',
  // Propiedad GA4 "Sitio personal - GA4" (flujo 6027540977), confirmada por el
  // usuario 2026-09-20. Público, no un secreto (CLAUDE.md §6 A02) — ver ADR-015.
  gaMeasurementId: 'G-Z9PLP5VH5C',
  // Site key pública de reCAPTCHA v3, dominio ocastelblanco.com (cubre www),
  // confirmada por el usuario 2026-09-21 — ver ADR-016.
  recaptchaSiteKey: '6Lenj8ctAAAAALCIfcrj39k_2k-yPsieUfDJBGi-',
};
