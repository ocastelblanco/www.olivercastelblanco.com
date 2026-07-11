# Apps Script — Publicar "The Lab" desde Google Sheets

Este documento describe cómo un Google Sheet actúa como CMS mínimo para las entradas de
"The Lab", y cómo un script de Google Apps Script las publica al endpoint
`POST https://api.ocastelblanco.com/lab`, que (en una fase posterior, ver Tarea 2 de
`TODO.md`) escribirá `lab.json` al bucket `cdn.ocastelblanco.com`.

## 1. Estructura del Google Sheet

Una sola hoja llamada `Lab`, con encabezados en la primera fila:

| fecha | tags | texto_es | texto_en |
|---|---|---|---|
| 2026-06-15 | Angular, Prompt Engineering | Angular 22: la herramienta secreta del **Industrial Design**... | Angular 22: the secret weapon for **Industrial Design**... |

- `fecha`: formato `AAAA-MM-DD` (texto, no fecha de Sheets, para evitar conversión automática
  de zona horaria).
- `tags`: lista separada por comas (ej. `Angular, Prompt Engineering`).
- `texto_es` / `texto_en`: texto plano usando el subset de Markdown soportado por
  `renderMarkdownLite` (`src/app/core/content/markdown-lite.ts`): `**negrita**`,
  `*itálica*`, `~~tachado~~`, `[texto](url)`.

El `id` de cada entrada se genera automáticamente a partir del número de fila (no se
gestiona manualmente en el Sheet).

## 2. Código de Apps Script

Crear el script vía **Extensiones → Apps Script** dentro del Sheet, y reemplazar el
contenido de `Code.gs` por lo siguiente:

```javascript
/**
 * Publicar The Lab — lee la hoja "Lab" y publica las entradas al endpoint
 * POST /lab de api.ocastelblanco.com, protegido por un token secreto.
 */

const SHEET_NAME = 'Lab';
const API_URL = 'https://api.ocastelblanco.com/lab';
const TOKEN_PROPERTY_KEY = 'LAB_PUBLISH_TOKEN';

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Publicar The Lab')
    .addItem('Publicar ahora', 'publicarLab')
    .addToUi();
}

function publicarLab() {
  const token = PropertiesService.getScriptProperties().getProperty(TOKEN_PROPERTY_KEY);

  if (!token) {
    Browser.msgBox(
      'Falta el token',
      'Configura la propiedad de script "' + TOKEN_PROPERTY_KEY + '" antes de publicar. ' +
        'Ver instrucciones en docs/proceso/apps-script-lab.md.',
      Browser.Buttons.OK,
    );
    return;
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) {
    Browser.msgBox('Error', 'No se encontró la hoja "' + SHEET_NAME + '".', Browser.Buttons.OK);
    return;
  }

  const rows = sheet.getDataRange().getValues();
  const [headers, ...dataRows] = rows;

  const idxFecha = headers.indexOf('fecha');
  const idxTags = headers.indexOf('tags');
  const idxTextoEs = headers.indexOf('texto_es');
  const idxTextoEn = headers.indexOf('texto_en');

  const entries = dataRows
    .filter((row) => row[idxFecha]) // ignora filas vacías
    .map((row, i) => ({
      id: String(i + 1),
      fecha: String(row[idxFecha]),
      tags: String(row[idxTags] || '')
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
      texto: {
        es: String(row[idxTextoEs] || ''),
        en: String(row[idxTextoEn] || ''),
      },
    }));

  try {
    const response = UrlFetchApp.fetch(API_URL, {
      method: 'post',
      headers: { 'x-lab-token': token },
      contentType: 'application/json',
      payload: JSON.stringify(entries),
      muteHttpExceptions: true,
    });

    const status = response.getResponseCode();
    const body = response.getContentText();

    if (status >= 200 && status < 300) {
      Browser.msgBox('Publicado', 'The Lab se publicó correctamente.\n\n' + body, Browser.Buttons.OK);
    } else {
      Browser.msgBox(
        'Error HTTP ' + status,
        'La publicación falló.\n\n' + body,
        Browser.Buttons.OK,
      );
    }
  } catch (error) {
    Browser.msgBox('Error', 'No se pudo contactar el endpoint: ' + error.message, Browser.Buttons.OK);
  }
}
```

## 3. Configurar el token secreto

El token **nunca** se escribe en el código del script. Se guarda en las propiedades del
proyecto de Apps Script:

1. Abrir el Sheet → **Extensiones → Apps Script**.
2. En el editor de Apps Script, ir a **Configuración del proyecto** (ícono de engranaje en
   la barra lateral izquierda).
3. Bajar hasta **Propiedades del script** → **Añadir propiedad del script**.
4. Clave: `LAB_PUBLISH_TOKEN`. Valor: el mismo token configurado como variable de entorno
   `LAB_PUBLISH_TOKEN` en el despliegue de `serverless.yml` (gestionado fuera del
   repositorio, nunca hardcodeado).
5. Guardar.

## 4. Instalar el menú personalizado (primera vez)

1. En el editor de Apps Script, guardar el script (el archivo `Code.gs` de arriba).
2. Volver al Sheet y recargar la página del navegador. Apps Script pedirá autorización la
   primera vez — revisar los permisos solicitados (acceso a la hoja y a servicios externos
   vía `UrlFetchApp`) y aceptar.
3. Tras la recarga y autorización, aparecerá el menú **"Publicar The Lab"** en la barra de
   menús del Sheet, con la opción **"Publicar ahora"**.
4. Cada vez que se agreguen o edite filas en la hoja `Lab`, usar ese menú para reenviar el
   contenido completo al endpoint `POST /lab`.

## 5. Notas de seguridad

- El endpoint valida el token con comparación exacta (sin regex) — un token incorrecto o
  ausente responde `401 Unauthorized` (ver `src/lambda/lab-handler.mjs`).
- El endpoint valida la forma de cada entrada (`id`, `fecha`, `tags`, `texto.es`,
  `texto.en`) antes de aceptar el payload — cualquier campo inválido responde `400` con el
  detalle del campo que falló.
- Mientras el bucket S3 de contenido no exista (Tarea 2 de `TODO.md`), el endpoint solo
  valida y responde un stub `200 { ok: true, received: N }` — no persiste el contenido
  todavía.
