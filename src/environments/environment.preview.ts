export const environment = {
  production: true,
  apiUrl: 'https://preview-api.ocastelblanco.com',
  // TODO(Tarea 4 — Assets + behaviors CloudFront): el stage preview todavía no
  // tiene un CDN delante de su bucket de contenido, así que usa el fixture de
  // dev hasta que exista una forma de servir `content/lab.json` públicamente.
  labContentUrl: 'content/lab.dev.json',
};
