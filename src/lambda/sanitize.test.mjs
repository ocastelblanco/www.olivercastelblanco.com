/**
 * Pruebas del saneamiento de The Lab.
 *
 *   node --test src/lambda/
 *
 * Usa el runner nativo de Node (>= 18), sin dependencias nuevas: el handler es
 * ESM plano y queda fuera del builder de Angular que corre `npm test`.
 *
 * Los casos construyen los caracteres invisibles con String.fromCharCode a
 * propósito. Escribirlos literales dejaría una prueba que nadie puede revisar
 * en un diff, que es justo el problema que este módulo ataca.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { limpiarProsa, limpiarTag, limpiarEntrada, contarInvisibles } from './sanitize.mjs';

const ZWSP = String.fromCharCode(0x200b);
const ZWNJ = String.fromCharCode(0x200c);
const ZWJ = String.fromCharCode(0x200d);
const BOM = String.fromCharCode(0xfeff);
const NBSP = String.fromCharCode(0x00a0);
const SOFT_HYPHEN = String.fromCharCode(0x00ad);

test('quita el U+200B al inicio de un tag, el caso que apareció en producción', () => {
  assert.equal(limpiarTag(ZWSP + 'OPEX Optimization AI'), 'OPEX Optimization AI');
  assert.equal(limpiarTag('AI Orchestration Framework'), 'AI Orchestration Framework');
});

test('quita invisibles en cualquier posición', () => {
  assert.equal(limpiarTag('OPEX' + ZWSP + 'Optimization'), 'OPEXOptimization');
  assert.equal(limpiarTag('FinOps' + BOM), 'FinOps');
  assert.equal(limpiarProsa('super' + SOFT_HYPHEN + 'cali'), 'supercali');
  assert.equal(limpiarProsa(ZWNJ + 'texto'), 'texto');
});

test('preserva el ZWJ interno para no romper emojis compuestos', () => {
  const familia = '\u{1F468}' + ZWJ + '\u{1F469}' + ZWJ + '\u{1F467}';
  assert.equal(limpiarProsa(`Mi familia ${familia} viaja`), `Mi familia ${familia} viaja`);
  assert.ok(limpiarProsa(familia).includes(ZWJ), 'el ZWJ interno debe sobrevivir');
});

test('quita el ZWJ huérfano en los bordes, donde no une nada', () => {
  assert.equal(limpiarProsa(ZWJ + 'texto' + ZWJ), 'texto');
});

test('en tags quita todo ZWJ: son etiquetas cortas, nunca emoji compuesto', () => {
  assert.equal(limpiarTag('AI' + ZWJ + 'Ops'), 'AIOps');
});

test('normaliza espacios atípicos a espacio normal', () => {
  assert.equal(limpiarProsa('costo' + NBSP + 'total'), 'costo total');
  assert.equal(limpiarTag('Scope' + NBSP + 'Creep'), 'Scope Creep');
});

test('recorta y colapsa espacios solo en tags', () => {
  assert.equal(limpiarTag('  FinOps   Cloud  '), 'FinOps Cloud');
  assert.equal(limpiarProsa('dos  espacios'), 'dos  espacios', 'la prosa conserva su espaciado');
});

test('aplica NFC para que los acentos descompuestos coincidan', () => {
  const descompuesto = 'o' + String.fromCharCode(0x0301);
  assert.equal(limpiarProsa(`c${descompuesto}digo`), 'código');
  assert.equal(limpiarProsa(`c${descompuesto}digo`).length, 6);
});

test('deja intacto un texto que ya está limpio', () => {
  const limpio = 'El **peaje de revisión** era invisible. ¿Lo mediste, o lo asumiste?';
  assert.equal(limpiarProsa(limpio), limpio);
});

test('no toca markdown, enlaces ni identificadores técnicos', () => {
  const md = 'Ver [ai-effort-tracking](https://github.com/ocastelblanco/ia-orchestration-skills) y `cache_read`.';
  assert.equal(limpiarProsa(md), md);
});

test('limpia una entrada completa sin mutar la original', () => {
  const original = {
    id: '1',
    fecha: 'Mon Aug 31 2026 00:00:00 GMT-0500 (hora estándar de Colombia)',
    tags: [ZWSP + 'Verification Tax', 'FinOps'],
    texto: { es: 'Peaje' + ZWSP + ' de revisión', en: 'Verification' + ZWSP + ' tax' },
  };
  const copia = structuredClone(original);
  const limpia = limpiarEntrada(original);

  assert.deepEqual(original, copia, 'la entrada recibida no se muta');
  assert.deepEqual(limpia.tags, ['Verification Tax', 'FinOps']);
  assert.equal(limpia.texto.es, 'Peaje de revisión');
  assert.equal(limpia.texto.en, 'Verification tax');
  assert.equal(limpia.fecha, original.fecha, 'la fecha conserva sus espacios internos');
  assert.equal(limpia.id, '1');
});

test('descarta tags que quedan vacíos tras limpiar', () => {
  const limpia = limpiarEntrada({
    id: '1',
    fecha: 'x',
    tags: ['FinOps', ZWSP, '   '],
    texto: { es: 'a', en: 'b' },
  });
  assert.deepEqual(limpia.tags, ['FinOps']);
});

test('tolera campos ausentes sin lanzar', () => {
  assert.doesNotThrow(() => limpiarEntrada({ id: '1', fecha: 'x', tags: undefined, texto: undefined }));
  assert.equal(limpiarProsa(undefined), undefined);
  assert.equal(limpiarTag(42), 42);
});

test('cuenta los invisibles encontrados para el log', () => {
  const entrada = {
    id: '1',
    fecha: 'x',
    tags: [ZWSP + 'a', 'b' + BOM],
    texto: { es: 'c' + ZWSP + 'd', en: 'e' + NBSP + 'f' },
  };
  assert.equal(contarInvisibles(entrada), 4);
  assert.equal(contarInvisibles({ id: '1', fecha: 'x', tags: ['a'], texto: { es: 'b', en: 'c' } }), 0);
});

test('el JSON publicado tras limpiar no contiene ningún invisible', () => {
  const entradas = [
    {
      id: '1',
      fecha: 'Mon Aug 31 2026',
      tags: [ZWSP + 'Verification Tax', 'FinOps' + BOM],
      texto: { es: 'Peaje' + NBSP + 'de revisión', en: 'Review' + ZWSP + ' tax' },
    },
  ];
  const publicado = JSON.stringify(entradas.map(limpiarEntrada));
  const sospechosos = [0x200b, 0x200c, 0xfeff, 0x2060, 0x00ad, 0x00a0];
  for (const cp of sospechosos) {
    assert.ok(
      !publicado.includes(String.fromCharCode(cp)),
      `el JSON publicado no debe contener U+${cp.toString(16).toUpperCase().padStart(4, '0')}`,
    );
  }
});
