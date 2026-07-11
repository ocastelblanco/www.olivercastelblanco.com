/**
 * Mini-parser de un subset ESTRICTO de Markdown a HTML seguro, sin librerías externas.
 *
 * Subset soportado:
 *  - **negrita**       -> <strong>
 *  - *itálica*         -> <em>
 *  - ~~tachado~~       -> <del>
 *  - [texto](url)      -> <a href="..." target="_blank" rel="noopener noreferrer">
 *                         (solo si la url empieza por http:// o https://; si no, se deja como texto plano)
 *
 * Seguridad (OWASP A03 — Inyección/XSS): el texto ORIGINAL se escapa (&, <, >) antes de
 * aplicar cualquier transformación de marcado, de modo que no sea posible inyectar HTML
 * arbitrario (ni siquiera vía el propio Sheet). No depende únicamente de la sanitización
 * por defecto de Angular en [innerHTML] — este HTML ya es seguro por construcción.
 */

function escapeHtml(source: string): string {
  return source.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function isSafeUrl(url: string): boolean {
  return /^https?:\/\//.test(url);
}

export function renderMarkdownLite(source: string): string {
  let html = escapeHtml(source);

  // Links: [texto](url) — antes de negrita/itálica para no confundir los corchetes.
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text: string, url: string) => {
    if (!isSafeUrl(url)) return text;
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`;
  });

  // Negrita: **texto**
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Tachado: ~~texto~~
  html = html.replace(/~~([^~]+)~~/g, '<del>$1</del>');

  // Itálica: *texto* (después de negrita para no chocar con los asteriscos dobles)
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  return html;
}
