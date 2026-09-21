export const environment = {
  production: false,
  apiUrl: 'https://api.ocastelblanco.com',
  labContentUrl: 'content/lab.dev.json',
  // Vacío en dev — AnalyticsService.init() es no-op sin measurement ID, para no
  // contaminar la propiedad GA4 con tráfico de desarrollo (ADR-015).
  gaMeasurementId: '',
  // Vacío en dev — RecaptchaService.execute() es no-op sin site key (ADR-016).
  recaptchaSiteKey: '',
};
