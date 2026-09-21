export const environment = {
  production: false,
  apiUrl: 'https://api.ocastelblanco.com',
  labContentUrl: 'content/lab.dev.json',
  // Vacío: durante el prerender (build-time) no hay servidor real sirviendo el
  // fixture por HTTP, y `fetch()` de Node no acepta URLs relativas — el fetch
  // SSR se omite sin romper el render (ver ContentService.loadLabEntries,
  // ADR-011). El contenido igual se hidrata del lado del cliente.
  labContentSsrUrl: '',
  // Vacío en dev — AnalyticsService.init() es no-op sin measurement ID, para no
  // contaminar la propiedad GA4 con tráfico de desarrollo (ADR-015).
  gaMeasurementId: '',
  // Vacío en dev — RecaptchaService.execute() es no-op sin site key (ADR-016).
  recaptchaSiteKey: '',
};
