export const environment = {
  production: true,
  apiUrl: 'https://api.ocastelblanco.com',
  // Same-origin: una sola distribución CloudFront con dos orígenes (ADR-012).
  // `cdn.ocastelblanco.com` fue descartado — evita el preflight CORS.
  labContentUrl: '/content/lab.json',
  // Propiedad GA4 "Sitio personal - GA4" (flujo 6027540977), confirmada por el
  // usuario 2026-09-20. Público, no un secreto (CLAUDE.md §6 A02) — ver ADR-014.
  gaMeasurementId: 'G-Z9PLP5VH5C',
};
