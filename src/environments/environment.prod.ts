export const environment = {
  production: true,
  apiUrl: 'https://api.ocastelblanco.com',
  // Same-origin: una sola distribución CloudFront con dos orígenes (ADR-012).
  // `cdn.ocastelblanco.com` fue descartado — evita el preflight CORS.
  labContentUrl: '/content/lab.json',
};
