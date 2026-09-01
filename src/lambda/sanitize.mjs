/**
 * Saneamiento de texto para el contenido de The Lab.
 *
 * La fuente de verdad es una hoja de Google Sheets, alimentada a mano. Los
 * pegados desde salidas de LLM, páginas web renderizadas o editores como
 * Notion, Slack o Docs arrastran caracteres de formato invisibles (sobre todo
 * U+200B ZERO WIDTH SPACE) que sobreviven intactos hasta el JSON publicado:
 * ni JSON.stringify ni PutObject los tocan.
 *
 * Son invisibles al leer, pero rompen búsquedas, comparaciones exactas de
 * cadena y anclas generadas a partir del texto. Como el JSON es el artefacto
 * público, el borde de escritura es el lugar correcto para limpiarlos: así no
 * depende de la disciplina de captura en la hoja.
 *
 * Caso real que motivó esto (2026-08-31): dos tags publicados tenían un
 * U+200B al inicio, uno en la entrada del 3 de agosto y otro en la del 28 de
 * julio.
 *
 * Los patrones usan escapes \\uXXXX a propósito. Un carácter invisible escrito
 * literal en el fuente es imposible de revisar en un diff.
 */

/**
 * Invisibles que nunca aportan nada en este contenido y siempre se eliminan.
 *
 *   U+200B  ZERO WIDTH SPACE          el que apareció en producción
 *   U+200C  ZERO WIDTH NON-JOINER
 *   U+FEFF  BOM / ZERO WIDTH NBSP
 *   U+2060  WORD JOINER
 *   U+00AD  SOFT HYPHEN
 *   U+180E  MONGOLIAN VOWEL SEPARATOR
 *
 * Deliberadamente NO incluye U+200D ZERO WIDTH JOINER: es parte legítima de
 * las secuencias de emoji compuestas (una familia de tres emojis va unida por
 * ZWJ), y quitarlo de la prosa las rompería en pedazos.
 */
const INVISIBLES = /[\u200B\u200C\uFEFF\u2060\u00AD\u180E]/g;

/**
 * Espacios atípicos que se colapsan a un espacio normal: NBSP, narrow NBSP,
 * figure space, thin space, hair space y el espacio de ancho medio.
 */
const ESPACIOS_RAROS = /[\u00A0\u202F\u2007\u2009\u200A\u3000]/g;

/** ZWJ suelto: sin un emoji a cada lado no une nada y solo estorba. */
const ZWJ_HUERFANO = /^\u200D+|\u200D+$/g;

/** Todo ZWJ, para campos donde no puede haber emoji compuesto. */
const ZWJ = /\u200D/g;

/**
 * Limpia prosa preservando las secuencias de emoji.
 *
 * Aplica NFC para que los acentos queden en forma compuesta: sin esto, una "ó"
 * pegada desde macOS puede llegar descompuesta (o + U+0301) y no coincidir con
 * la misma palabra escrita en otro lado.
 */
export function limpiarProsa(texto) {
  if (typeof texto !== 'string') return texto;
  return texto
    .replace(INVISIBLES, '')
    .replace(ZWJ_HUERFANO, '')
    .replace(ESPACIOS_RAROS, ' ')
    .normalize('NFC');
}

/**
 * Limpia un tag. Más agresivo que la prosa: los tags son etiquetas cortas de
 * clasificación, nunca llevan emoji compuesto, y un espacio al borde los
 * convierte en una categoría distinta pero visualmente idéntica.
 */
export function limpiarTag(tag) {
  if (typeof tag !== 'string') return tag;
  return tag
    .replace(INVISIBLES, '')
    .replace(ZWJ, '')
    .replace(ESPACIOS_RAROS, ' ')
    .replace(/\s+/g, ' ')
    .normalize('NFC')
    .trim();
}

/**
 * Sanea una entrada completa. Devuelve un objeto nuevo, sin mutar el que llega,
 * para que el validador siga viendo exactamente lo que mandó el cliente.
 *
 * `id` y `fecha` también se limpian (un U+200B en un id rompe el track-by del
 * listado) pero sin colapsar espacios internos, que en `fecha` son
 * significativos.
 */
export function limpiarEntrada(entrada) {
  return {
    ...entrada,
    id: limpiarProsa(entrada.id)?.trim(),
    fecha: limpiarProsa(entrada.fecha)?.trim(),
    tags: Array.isArray(entrada.tags) ? entrada.tags.map(limpiarTag).filter(Boolean) : entrada.tags,
    texto: {
      ...entrada.texto,
      es: limpiarProsa(entrada.texto?.es),
      en: limpiarProsa(entrada.texto?.en),
    },
  };
}

/**
 * Cuenta los caracteres invisibles que traía una entrada, para dejarlo en el
 * log de la publicación. Si el número deja de ser cero de forma sostenida,
 * conviene revisar de dónde se están copiando los textos hacia la hoja.
 */
export function contarInvisibles(entrada) {
  const partes = [
    entrada?.id,
    entrada?.fecha,
    ...(Array.isArray(entrada?.tags) ? entrada.tags : []),
    entrada?.texto?.es,
    entrada?.texto?.en,
  ].filter((parte) => typeof parte === 'string');

  return partes.reduce((total, parte) => {
    const invisibles = parte.match(INVISIBLES)?.length ?? 0;
    const espacios = parte.match(ESPACIOS_RAROS)?.length ?? 0;
    return total + invisibles + espacios;
  }, 0);
}
