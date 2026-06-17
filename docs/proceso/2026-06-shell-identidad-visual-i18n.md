# Shell de navegación, identidad visual corporativa e internacionalización

**Fecha:** 2026-06-17
**Iteración:** Shell + Branding + i18n (rama `rediseno-2026`, MVP en construcción)
**Rol de Oliver Castelblanco:** Solutions Architect & AI Orchestrator — definición de
requisitos, revisión de identidad visual, criterios de aceptación y aprobación de PRs.
**Rol de los agentes IA:** ejecución autónoma (implementación, corrección de errores,
verificación en navegador) bajo el playbook de `CLAUDE.md`.

---

## 1. Resumen ejecutivo

Esta iteración entrega las tres capas que hacen que el sitio sea reconocible y usable por
primera vez: el **shell de navegación** (la estructura visual permanente de la interfaz), la
**identidad visual corporativa** (logotipo y kit de assets) y el **soporte multilengua**
(español colombiano / inglés americano con cambio inmediato). También se automatizó el
pipeline de CI con GitHub Actions.

A diferencia de la iteración anterior (fundación, sin UI visible), esta iteración ya
produce una pantalla que puede mostrarse: el layout completo con sidebar, topbar, selector
de idioma y logotipo integrado, todo funcionando sobre el design system definido en
`DESIGN.md`.

Las cuatro funcionalidades se entregaron como PRs independientes hacia `rediseno-2026`,
revisadas y aprobadas por Oliver antes de fusionarse.

## 2. Shell de navegación (Sidebar + Topbar)

### Qué se construyó

Un layout de dos piezas que enmarca todas las rutas del sitio:

- **`Sidebar`** (`src/app/shared/shell/sidebar/`): lista vertical de navegación con cuatro
  enlaces (`/`, `/proyectos`, `/lab`, `/contacto`), cada uno con su icono SVG incrustado
  como path de 20×20px. Usa `RouterLinkActive` para resaltar la ruta activa. Los labels son
  claves de traducción (`nav.home`, `nav.projects`, etc.) resueltas por `TranslationService`.

- **`Topbar`** (`src/app/shared/shell/topbar/`): barra superior con nombre del propietario,
  rol profesional (internacionalizado) y `LangSwitcher` en el extremo derecho.

- **`App`** (`src/app/app.ts`): componente raíz refactorizado para importar y renderizar
  `Sidebar` y `Topbar` como parte del layout principal; `<router-outlet>` ocupa el área de
  contenido.

### Decisiones de diseño

- **Standalone + Signals**: todos los componentes son standalone; el estado de UI (ruta
  activa, locale) se lee desde signals, sin RxJS ni subscripciones manuales.
- **Iconos como SVG paths** en el template (sin sprites externos ni icon fonts): mantiene
  el control total sobre el render y evita dependencias de assets en runtime.
- **`technical-label`** (JetBrains Mono 12px, mayúsculas, `letter-spacing: 0.08em`) como
  clase tipográfica para todos los labels de navegación — consistente con `DESIGN.md`.

## 3. Identidad visual corporativa

### El proceso

El logotipo OC (monograma "OC" en geometría industrial, acento Cyber Lime `#CCFF00`)
se diseñó externamente y se integró al repositorio como activo versionado. El proceso
incluyó dos ciclos de corrección:

1. **Primera entrega**: los SVGs del kit tenían paths sin `fill`, lo que producía formas
   invisibles en contextos que no heredan color. Detectado al renderizar los bitmaps.
2. **Corrección**: los paths del SVG fuente (`OC_logo_fondo.svg`) se auditaron y corrigieron
   para que todos los elementos tuvieran `fill` explícito. A partir del SVG corregido se
   regeneraron todos los derivados.

### Kit de assets generado (`public/brand/`)

| Archivo | Formato | Uso |
|---|---|---|
| `OC_logo_fondo.svg` | SVG | Logo con fondo oscuro (Deep Charcoal) |
| `OC_logo_alpha.svg` | SVG | Logo sin fondo (uso sobre fondos arbitrarios) |
| `icon-mono-black.svg` / `icon-mono-white.svg` | SVG | Ícono solo, monocromo blanco o negro |
| `logo-full-mono-black.svg` / `logo-full-mono-white.svg` | SVG | Logo completo, monocromo |
| `OC_logo_fondo.png` / `.webp` | Raster 512px | Redes sociales, Open Graph |
| `favicon.ico` | ICO multi-resolución | Tab del navegador |
| `favicon-16.png` / `favicon-32.png` / `apple-touch-icon.png` | PNG | Favicons variantes |

El `favicon.ico` se movió a `public/` (raíz pública) para que Angular CLI lo sirva desde
`/favicon.ico` por convención.

### Aprendizaje

El error de paths sin `fill` era silencioso: los SVGs se veían correctos en editores que
heredan el color del contexto, pero fallaban en entornos con fondo explícito diferente.
La verificación siempre debe hacerse renderizando sobre un fondo blanco Y uno negro antes
de dar por válido un SVG de identidad.

## 4. CI con GitHub Actions

Se agregó un workflow de integración continua en `.github/workflows/ci.yml` que se
activa en cada `push` y `pull_request` hacia `rediseno-2026` o `master`:

```
npm ci → npm run build → npm test (Vitest)
```

Esto formaliza el flujo de control de cambios descrito en `CLAUDE.md`: ningún agente puede
commitear directamente a las ramas protegidas, y el CI verifica que el build y los tests
pasen antes de que el PR pueda fusionarse.

La elección de GitHub Actions (sobre alternativas como CircleCI o GitLab CI) es coherente
con el repositorio ya alojado en GitHub y no añade ninguna cuenta externa al stack.

## 5. Soporte multilengua es-CO / en-US

### La decisión de arquitectura (ADR-008)

El sitio necesitaba cambio de idioma **inmediato** (sin recarga de página). Esto descartó
`@angular/localize`, que genera builds separados por locale y requiere navegar a una URL
diferente para cambiar de idioma.

Se descartó igualmente `ngx-translate` y `transloco`: para dos idiomas y un vocabulario
acotado, añadir una dependencia externa sería sobre-ingeniería.

La solución: un **`TranslationService` propio basado en Signals**, idiomático Angular 22
zoneless, sin dependencias externas y SSR-seguro. Ver ADR-008 en `MEMORY.md`.

### Cómo funciona

```
TranslationService.currentLocale = signal<Locale>('en-US' | 'es-CO')
         │
         └─▶ t('clave.punto.notacion') → resuelve en el diccionario activo
                   │
                   └─▶ templates Angular rastrean currentLocale automáticamente
                             → re-render sin Zone.js, sin pipe, sin RxJS
```

**Detección inicial (SSR-segura):**
1. En el servidor (`isPlatformBrowser = false`): retorna `'en-US'` por defecto.
2. En el cliente: lee `localStorage.getItem('locale')` si existe.
3. Si no: detecta `navigator.language`; si empieza por `'es'`, retorna `'es-CO'`, si no `'en-US'`.

**Al cambiar de idioma (`setLocale`):**
1. `currentLocale.set(locale)` — dispara re-render reactivo de todos los templates.
2. `localStorage.setItem('locale', locale)` — persiste la preferencia.
3. `document.documentElement.lang = locale` — actualiza el atributo `lang` del HTML raíz
   (relevante para lectores de pantalla y SEO).

### LangSwitcher

Componente standalone en `src/app/shared/shell/lang-switcher/`:

- Botón que muestra `[ES]` o `[EN]` según el locale activo.
- Al hacer click abre un dropdown con la opción alternativa.
- Click fuera (vía `host: { '(document:click)': 'onDocumentClick($event)' }`) cierra el
  dropdown.
- Keyboard: `Escape` cierra; el dropdown usa atributos ARIA (`role="listbox"`,
  `aria-label`, `aria-selected`) para accesibilidad.
- Estilo consistente con el design system: `--radius: 0px`, fondo
  `--color-surface-container`, opción activa en `--color-primary-container` (Cyber Lime).

### Extensibilidad

Para agregar un nuevo idioma: (1) crear `src/app/core/i18n/translations/<locale>.ts`,
(2) agregar el locale a `i18n.types.ts`, (3) registrarlo en `DICTIONARIES` dentro de
`translation.service.ts`. No hay más configuración necesaria.

Para agregar una nueva clave de traducción: agregarla a `Translations` (en
`i18n.types.ts`) y a cada diccionario. TypeScript lanzará error en tiempo de compilación
si falta alguna clave en algún diccionario.

## 6. Orquestación y flujo de trabajo IA

Esta iteración fue la primera en usar el flujo completo de PRs con revisión humana para
**cambios de código** (las iteraciones previas de documentación ya lo usaban). El proceso
funcionó así:

1. Cada funcionalidad se implementó en su propia rama (`feature/shell-navegacion`,
   `feature/identidad-visual-*`, `feature/i18n-multilengua`).
2. El agente verificó el build (`npm run build`) antes de commitear.
3. Se abrió un PR hacia `rediseno-2026` con descripción de cambios y checklist.
4. Oliver aprobó y fusionó; el agente limpió las ramas locales.

La identidad visual requirió dos iteraciones de corrección (paths sin fill en SVGs), lo que
confirmó el valor del ciclo de revisión humana: el agente generó el kit a partir del SVG
original defectuoso; Oliver detectó el error visualmente y lo corrigió en la fuente.

Un aprendizaje operacional: el MCP de preview (`preview_click`) no propaga correctamente
`stopPropagation()` en eventos sintéticos, lo que causaba que el dropdown del `LangSwitcher`
se cerrara inmediatamente al abrirse durante las pruebas automatizadas. El comportamiento
real en un navegador fue correcto; la prueba se validó con `preview_eval` directamente
sobre el DOM.

## 7. Aprendizajes

- **Signals + zoneless = re-render casi gratis**: con `TranslationService` basado en
  `signal`, cambiar el locale dispara re-renders solo en los templates que leyeron la
  señal. No hace falta un pipe, un `ChangeDetectorRef.markForCheck()`, ni un BehaviorSubject.
  El modelo mental "la señal es la fuente de verdad" simplifica enormemente la i18n.

- **SSR-safety no es opcional desde el día 1**: `isPlatformBrowser` debe ser la primera
  verificación en cualquier código que toque `window`, `document`, `localStorage` o
  `navigator`. Añadirlo después es más costoso que hacerlo desde el principio.

- **Verificar SVGs sobre fondos de contraste**: cualquier SVG de identidad debe validarse
  sobre fondo blanco y negro antes de darlo por válido. El error de paths sin fill es
  silencioso en muchos editores.

- **TypeScript como contrato de traducción**: modelar `Translations` como interfaz
  TypeScript hace que el compilador falle si un diccionario nuevo está incompleto. Es un
  test gratis.

## 8. Qué sigue

Según el motor JIT (`TODO.md`), las dos tareas activas tras esta iteración son:

1. **Home — "El Manifiesto del Fixer"**: primera feature de contenido visible al usuario.
   Layout hero + manifesto + CTA, usando los design tokens y el shell ya implementados.
2. **Registro de Proyectos**: arquitectura de datos para los casos de estudio (colección
   estática tipada en TypeScript, renderizado con `@for` y cards de proyecto).

La siguiente entrada de esta bitácora se escribirá al cerrar la próxima iteración mayor
(ver convención en [`README.md`](./README.md) de esta carpeta).
