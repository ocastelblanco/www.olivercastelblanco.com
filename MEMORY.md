# MEMORY.md — ocastelblanco.com (Rediseño 2026)

> Leer este documento al inicio de cada sesión para recuperar el contexto sin necesidad de
> reexplicar el proyecto. Actualizar al cierre de cada sesión relevante.

## 1. Estado actual

| Campo | Valor |
|---|---|
| Versión | MVP en construcción — shell, i18n, Home, Proyectos, Contacto, The Lab + CI/CD Lambda implementados |
| URL producción | `https://ocastelblanco.com` (sitio anterior aún activo en `master`) |
| URL preview (Lambda) | Lambda Function URL en stage `preview` — se genera tras primer push al workflow CI/CD |
| URL CDN | `https://cdn.ocastelblanco.com` (no provisionado en esta iteración) |
| URL API | `https://api.ocastelblanco.com` (futuro, no provisionado) |
| Rama principal (protegida) | `master` — sitio anterior (Angular Universal + Serverless) |
| Rama de desarrollo (protegida) | `rediseno-2026` — rediseño desde cero |
| Última sesión | 2026-06-19 |

## 2. Funcionalidades

### Completadas
- [x] Rama `rediseno-2026` creada como rama huérfana, limpia, sin historial previo
- [x] Documentación inicial (objetivos, arquitectura de contenido, design system, bitácora
      de proceso con Stitch) commiteada y pusheada
- [x] `CLAUDE.md`, `PRD.md`, `tech-specs.md` (con OWASP y git flow) creados
- [x] Boilerplate Angular 22 (standalone, signals, zoneless, SSR)
- [x] Design tokens en SCSS según `DESIGN.md`
- [x] Shell de navegación (sidebar + topbar, responsive ≤720px)
- [x] CI con GitHub Actions (lint + build + test)
- [x] Identidad visual corporativa (logo, kit de assets, favicons)
- [x] Internacionalización ES/EN con cambio inmediato (`TranslationService` + `LangSwitcher`)
- [x] Home — "El Manifiesto del Fixer" (hero + 3 pilares de valor)
- [x] Registro de Proyectos (grid Metric-First: ConectaTech + Le Tiende)
- [x] Página de detalle — ConectaTech (caso de estudio)
- [x] Página de detalle — Le Tiende — Comandante (caso de estudio)
- [x] Terminal de contacto (formulario Reactive Forms + validación client-side + estado mock)
- [x] Despliegue CI/CD a AWS Lambda (`serverless.yml` + `lambda-handler.js` + workflow deploy)
- [x] The Lab — Micro-blogging técnico (listado estático con 3 entradas, namespace i18n `lab`)

### Pendientes (ver `TODO.md` para las 2 tareas activas)
- [ ] Endpoint backend Terminal de contacto (`POST api.ocastelblanco.com/contact`)
- [ ] `serverless.yml` production stage + CloudFront + S3 para assets estáticos (fase 2)

## 3. Registro de Decisiones de Arquitectura (ADRs)

### ADR-001 — Reescritura completa desde cero en rama huérfana

- **Fecha:** 2026-06-11
- **Estado:** Implementado
- **Decisión:** Crear `rediseno-2026` como rama `--orphan` (sin historial ni archivos del
  sitio anterior) para iniciar el rediseño 2026 completamente limpio.
- **Razón:** El usuario quería partir de cero, sin arrastrar configuración, dependencias ni
  estructura del sitio anterior (Angular Universal + Serverless en `master`).
- **Consecuencias:** `master` queda como referencia histórica/producción del sitio anterior.
  Cualquier reutilización de código de `master` debe ser explícita y deliberada (copiar, no
  heredar). `node_modules`, `dist`, `.angular`, `.DS_Store` y `src/secrets/*` del estado
  anterior fueron eliminados del working tree.

### ADR-002 — Angular 22 (última estable), Signals, sin Zone.js

- **Fecha:** 2026-06-11
- **Estado:** Decidido, pendiente de implementar
- **Decisión:** El frontend se construye sobre Angular 22 (o la versión estable más reciente
  disponible al momento de generar el boilerplate), con componentes standalone, **Signals**
  como modelo de reactividad y **sin Zone.js** (`provideZonelessChangeDetection()`).
- **Razón:** Angular 22 estabiliza Signals como modelo de reactividad por defecto y permite
  eliminar Zone.js. El usuario, como desarrollador Angular, prefiere siempre adoptar la
  versión estable más reciente del framework.
- **Consecuencias:** Cualquier librería de terceros usada debe ser compatible con
  zoneless/Signals. Los patrones basados en `NgZone`/detección de cambios automática deben
  evitarse; usar `signal`/`computed`/`effect` y actualizar el estado explícitamente.

### ADR-003 — Arquitectura serverless orientada a microservicios (AWS + multi-proveedor)

- **Fecha:** 2026-06-11
- **Estado:** Decidido, pendiente de implementar
- **Decisión:** Toda la infraestructura es serverless sobre AWS (Lambda + API Gateway + S3 +
  CloudFront, gestionada con Serverless Framework), diseñada desde el inicio bajo una lógica
  de **microservicios** expuestos en `api.ocastelblanco.com`. Esta arquitectura puede acoplar
  servicios externos especializados (Google Firebase, Cloudinary, etc.) sin acoplarlos al
  monolito Angular.
- **Razón:** El usuario quiere probar una arquitectura estable, eficiente y de costo
  prácticamente nulo (objetivo: capa gratuita de AWS), sin depender de servidores
  administrados, y que sirva como base extensible para integrar servicios especializados de
  distintos proveedores según se necesiten.
- **Consecuencias:** Cada microservicio nuevo se agrega como una función Lambda independiente
  bajo `api.ocastelblanco.com`, con su propio recurso en `serverless.yml`. La gestión de
  secretos por proveedor (AWS, Firebase, Cloudinary) debe seguir `tech-specs.md` §9. El
  acoplamiento a Firebase/Cloudinary se hace solo en las funciones Lambda que los requieran,
  nunca en el cliente directamente (salvo SDKs explícitamente diseñados para uso en cliente
  con claves públicas, ej. Firebase client SDK).

### ADR-004 — Design system "Technical Industrial Minimalism"

- **Fecha:** 2026-05-01 (definido durante el proceso de diseño con Google Stitch, ver
  `docs/proceso/Stitch.md`)
- **Estado:** Definido, pendiente de implementar como tokens de código
- **Decisión:** Adoptar el design system documentado en `DESIGN.md`: tema oscuro
  (Deep Charcoal `#131313`/`#121212`), acentos Cyber Lime (`#CCFF00`/`#c3f400`) y Electric
  Cyan (`#00F0FF`/`#00eefc`), tipografía JetBrains Mono (técnica) + Inter (cuerpo), radios de
  borde 0px, grid de 12 columnas con baseline de 4px.
- **Razón:** Refleja la identidad "Solutions Architect & AI Orchestrator" (precisión,
  autoridad técnica, estética de hardware premium) y fue validado iterativamente con Google
  Stitch antes de iniciar el desarrollo.
- **Consecuencias:** Cualquier componente nuevo debe usar los tokens definidos en
  `DESIGN.md`/`src/styles/_tokens.scss` (cuando exista). No introducir colores, tipografías
  o radios fuera de este sistema sin actualizar primero `DESIGN.md`.

### ADR-005 — Shell de navegación responsive: sidebar → barra inferior en móvil

- **Fecha:** 2026-06-12
- **Estado:** Implementado
- **Decisión:** El sitio no es *mobile first*, pero debe ser completamente visible y
  funcional en móviles (`PRD.md` §8). En viewports ≤720px, la `Sidebar` (normalmente fija a
  la izquierda) se convierte en una barra de navegación inferior fija de altura 56px, con
  los mismos 4 enlaces mostrando icono + etiqueta apilados. El `Topbar` ajusta su `left` a
  `0` (ya no reserva espacio para la sidebar lateral) y `.app-content` agrega
  `padding-bottom` para no quedar oculto detrás de la barra inferior.
- **Razón:** Petición explícita del usuario — el shell debe seguir siendo navegable en
  pantallas pequeñas sin depender de gestos de hover (que no existen en touch).
- **Consecuencias:** Cualquier nuevo elemento del shell o layout de página debe considerar el
  breakpoint `@media (max-width: 720px)` y dejar espacio para la barra inferior en móvil
  (56px) en lugar de la sidebar lateral (56px en desktop).

### ADR-006 — CI con GitHub Actions: lint + build + test en cada push/PR

- **Fecha:** 2026-06-12
- **Estado:** Implementado
- **Decisión:** Se agrega `.github/workflows/ci.yml`, que se ejecuta en `push` y
  `pull_request` sobre `master` y `rediseno-2026`. El job usa Node 22 (con cache de npm),
  ejecuta `npm ci`, y luego en secuencia `npm run lint` (ESLint vía
  `@angular-eslint/schematics`, builder `@angular-eslint/builder:lint` agregado a
  `angular.json`), `npm run build` y `npm test -- --watch=false`. No incluye pasos de
  despliegue.
- **Razón:** Mantener calidad de código (lint + tests + build verde) en cada cambio antes de
  fusionar a `rediseno-2026`, sin depender de verificación manual local.
- **Consecuencias:** Cualquier código nuevo debe pasar `npm run lint` sin errores (reglas
  por defecto de `@angular-eslint/schematics`, ver `eslint.config.js`). Si el lint falla en
  CI pero no localmente, correr `npm run lint` antes de hacer push. Los PRs que fallen
  cualquiera de los tres pasos no deben fusionarse.

### ADR-007 — Identidad visual corporativa: flujo LogoLoom (local/MCP) + Taskade (manual/externo)

- **Fecha:** 2026-06-12
- **Estado:** Fase 1 implementada; Fase 2 (Taskade) pendiente, manual
- **Decisión:** El logo maestro, isotipo, favicons y loader animado se generan en dos fases:
  1. **Fase 1 — LogoLoom** (`@mcpware/logoloom`, MCP server local registrado en `.mcp.json`):
     genera conceptos SVG basados en los tokens de `DESIGN.md` (paleta Industrial Minimalism,
     JetBrains Mono / Inter), optimiza el SVG resultante y exporta el kit base (variantes
     claro/oscuro/monocromático, favicons en múltiples tamaños, isotipo independiente y una
     versión animada como progress loader). Activos en `brand/`.
  2. **Fase 2 — Taskade "AI Logo Variations Agent"** (servicio externo, fuera de este
     repositorio y del motor JIT): a partir del logo maestro generado en la Fase 1, produce
     variantes adicionales del kit de marca. Es un paso manual que el usuario ejecuta por
     fuera de Claude Code; no se automatiza ni se referencia como tarea del `TODO.md`.
- **Razón:** LogoLoom es local, gratuito y permite que Claude Code lea el contexto del
  proyecto (design tokens, tipografías) directamente para diseñar el SVG. Taskade
  complementa con variantes de marca sin esfuerzo adicional, pero al ser un SaaS externo sin
  integración MCP conocida, se mantiene fuera del flujo automatizado.
- **Consecuencias:** Requiere reiniciar la sesión de Claude Code tras crear `.mcp.json` para
  que el MCP `logoloom` quede disponible. Los activos de marca viven en `brand/` (nuevo
  directorio, fuera de `src/`). Los favicons actuales en `public/` se sustituirán por la
  versión simplificada del logo generada en esta fase.
- **Revisión 2026-06-12 (corrección):** El primer concepto generado por LogoLoom
  ("Monograma OC" geométrico simple) fue rechazado por el usuario. El usuario diseñó su
  propio logo maestro — un emblema circular "OC" con motivo de circuito impreso (paths
  lime `#d2f50e` / cian `#01f1fd`-`#02def0` / verdes `#38e8bb`-`#73ea4f`, 1024×1024,
  guardado en `brand/OC_logo.svg`) y solicitó reconstruir el kit completo a partir de él.
  Se eliminaron todos los archivos anteriores de `brand/` (isotipo, favicon-mark,
  logo-full, loader, `kit/`) dejando solo `OC_logo.svg`. Se optimizó con `svgo`
  (-31.8%, vía CLI porque el SVG de 92KB excede el límite de tokens para pasarlo como
  parámetro MCP) y se exportó el kit completo invocando `exportBrandKit` directamente
  desde `node` (import del módulo `@mcpware/logoloom`, evitando el límite de tamaño de
  parámetro del protocolo MCP) a `brand/kit/` (24 archivos). `brand/isotype.svg` es una
  copia del logo maestro (ya es un emblema circular autocontenido, válido como isotipo).
  `brand/loader.svg` es nuevo: anillo lime/cian + texto "OC" con pulso de opacidad +
  arco cian rotatorio (`animateTransform`) como progress loader. Favicons en `public/`
  regenerados desde `brand/kit/icon-*.png` (verificado legible incluso a 32px). `npm run
  build` en verde.
- **Resultado (Fase 1):** Isotipo "Monograma OC" (anillo cuadrado blanco + bracket Cyber
  Lime + acento Electric Cyan sobre Deep Charcoal). Archivos: `brand/isotype.svg` /
  `isotype-light.svg`, `brand/logo-full.svg` (wordmark "OLIVER CASTELBLANCO" / "THE FIXER",
  texto convertido a paths con `text_to_path` usando Inter — JetBrains Mono no disponible en
  formato `.ttf/.otf` para `text_to_path`, pendiente si se requiere consistencia exacta con
  `DESIGN.md`), `brand/favicon-mark.svg`, `brand/loader.svg` (progress loader animado) y
  `brand/kit/` (25 archivos: PNG 16-1024px, ICO, WebP, OG/social images, `BRAND.md`).
  Favicons aplicados en `public/` y referenciados en `src/index.html`
  (`site.webmanifest` actualizado con nombre/colores del proyecto).
- **Pendiente (Fase 2 — manual, fuera de Claude Code):** Usar Taskade "AI Logo Variations
  Agent" con `brand/logo-full.svg` / `brand/isotype.svg` como entrada para generar
  variantes adicionales del kit de marca.
- **Revisión 2026-06-12 (segunda corrección — fondo animado):** El usuario tampoco aceptó
  el resultado anterior (kit basado en `OC_logo.svg`, sin fondo). Proporcionó
  `brand/OC_logo_fondo.svg` (master nuevo: el mismo emblema "OC" más un `<circle
  inkscape:label="fondo">` de fondo y 4 `<linearGradient>` etiquetados `_Linear0`.._Linear3`
  — negro→lime, cian→lime, cian→negro, negro→negro) y `brand/OC_logo_fondo.png` (referencia
  1024×1024). `brand/OC_logo.svg` (sin fondo) fue eliminado por el usuario; el nuevo master
  es `brand/OC_logo_fondo.svg`. Se optimizó con `svgo` (-28.3%, a 66.6 KB) y se regeneró el
  kit completo (24 archivos en `brand/kit/`) con el mismo script `exportBrandKit` vía
  `node` (bypass del límite de tamaño de parámetro MCP), apuntando al SVG optimizado.
  `brand/isotype.svg` = copia del SVG optimizado con fondo. Favicons en `public/`
  regenerados desde `brand/kit/icon-*.png` (legible a 16/32px). Se creó
  `brand/loader.svg`: el `<circle>` de fondo se duplicó en 4 copias, cada una con `fill`
  apuntando a uno de los 4 `<linearGradient>` originales (`bgGradient0..3`, vía
  `xlink:href` a `_Linear0.._Linear3`), animando su `opacity` con `<animate
  calcMode="linear">` (keyTimes/values) para un crossfade continuo Linear0→1→2→3→0, 0.5s
  por transición (ciclo total 2s, `repeatCount="indefinite"`). El grupo "forma" (octágono +
  "OC" + circuitos) queda fijo encima. `npm run build` en verde.
- **Revisión 2026-06-12 (tercera corrección — variantes monocromáticas):** El usuario
  proporcionó `brand/OC_logo_alpha.svg` (mismo emblema "OC", sin círculo de fondo) para
  regenerar `icon-mono-black.svg`, `icon-mono-white.svg`, `logo-full-mono-black.svg` y
  `logo-full-mono-white.svg`. Las versiones previas (generadas por `exportBrandKit`)
  conservaban los colores originales en vez de ser monocromáticas. Se regeneraron con un
  script que reemplaza todos los valores `fill:#XXXXXX`/`stroke:#XXXXXX` por `#000000`
  (black) o `#ffffff` (white) sobre `OC_logo_alpha.svg`, optimizado con `svgo` (-30.7%).
  Las 4 variantes son idénticas entre `icon-*` y `logo-full-*` (mismo SVG completo, sin
  distinción de "isotipo vs wordmark" en este master). `npm run build` en verde.
- **Revisión 2026-06-13 (cuarta corrección — fix de paths sin relleno + regeneración de
  bitmaps):** El usuario detectó que dos paths del SVG original quedaban sin `fill`
  (visible en las letras "OC") y corrigió todos los SVG de `brand/` (`OC_logo_fondo.svg`,
  `OC_logo_alpha.svg`, `isotype.svg`, `loader.svg`, `brand/kit/*mono*.svg`,
  `logo-full-light.svg`) por su cuenta, fuera de Claude Code. A partir del
  `OC_logo_fondo.svg` corregido (optimizado con `svgo`, -28.1%), se regeneraron **solo los
  binarios** del kit (`brand/kit/*.png`, `favicon.ico`, `icon-512.webp`) vía
  `exportBrandKit` por `node` a un directorio temporal, copiando de vuelta únicamente los
  archivos de imagen (sin tocar SVG/MD/HTML del kit). Favicons en `public/` regenerados
  desde los nuevos PNG/ICO. `npm run build` en verde.

### ADR-008 — Internacionalización (i18n): TranslationService propio basado en Signals

- **Fecha:** 2026-06-13
- **Estado:** Implementado (es-CO / en-US)
- **Decisión:** Implementar i18n con un `TranslationService` propio (`providedIn: 'root'`)
  basado en Angular Signals, sin `@angular/localize` (requiere builds separados por locale,
  incompatible con cambio inmediato) ni librerías externas (`ngx-translate`, `transloco`).
- **Razón:** El requisito de cambio inmediato de idioma sin recarga descarta `@angular/localize`.
  Para solo 2 idiomas, una librería externa agrega más peso que valor. El patrón Signals es
  nativo a Angular 22 zoneless: las plantillas rastrean automáticamente las lecturas de
  signals, por lo que `trans.t('key')` en un template se re-evalúa solo cuando
  `currentLocale` cambia, sin pipes especiales ni RxJS.
- **Consecuencias:**
  - Detección de idioma inicial: `localStorage('locale')` → `navigator.language` → `'en-US'`
    (SSR-seguro vía `isPlatformBrowser`).
  - Persistencia: `localStorage` key `'locale'`. Al cambiar, también se actualiza
    `document.documentElement.lang`.
  - Nuevos archivos: `src/app/core/i18n/` (tipos, diccionarios, servicio) y
    `src/app/shared/shell/lang-switcher/` (componente selector).
  - Componentes que consumen traducciones inyectan `TranslationService` y exponen
    `protected readonly trans = inject(TranslationService)` para uso en plantilla.
  - Para añadir un nuevo idioma: agregar un diccionario en `translations/`, extender
    `Locale` y añadir la opción en `LangSwitcher.options`.
  - Para añadir nuevas claves: extender `Translations` interface y los dos diccionarios.

### ADR-009 — CI/CD con despliegue a AWS Lambda (stage `preview`)

- **Fecha:** 2026-06-18
- **Estado:** Implementado
- **Decisión:** El workflow `.github/workflows/deploy.yml` despliega la app a AWS Lambda en
  stage `preview` en cada `push` a feature branches (`feature/**`, `fix/**`, `refactor/**`,
  `docs/**`, `hotfix/**`) y a `rediseno-2026`. Un solo Lambda URL de stage `preview` (último
  push gana) — no hay un Lambda por rama. El handler es `lambda-handler.mjs` (raíz), que
  importa el `app` de Express compilado (`dist/ocastelblanco/server/server.mjs`) y lo envuelve
  con `@vendia/serverless-express`. `serverless-esbuild` bundlea el handler + `@vendia` en
  un único archivo ESM (`.mjs`); el `dist/` de Angular se incluye por separado via
  `package.patterns`. Runtime: `nodejs24.x`, región: `us-east-1`, `memorySize: 512`,
  `timeout: 15s`. Se usa Lambda **Function URL** (no API Gateway) para evitar el prefijo de
  stage en la URL, lo que permite que el routing Angular funcione correctamente.
- **Razón:** El usuario necesita validar avances remotamente sin estar frente al Mac. El
  despliegue ocurre en cada push para que cualquier feature branch sea previsualizable antes
  de aprobar la PR. Lambda Function URL simplifica el setup al eliminar API Gateway.
- **Consecuencias:**
  - GitHub secrets configurados: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`,
    `SERVERLESS_LICENSE_KEY` (Serverless Framework v4 requiere licencia para CI no
    interactivo — licencia gratuita disponible en serverless.com).
  - `src/server.ts` exporta tanto `reqHandler` (para Angular CLI) como `app` (para Lambda).
  - `.gitignore` incluye `.serverless/` y `.esbuild/` (artefactos de build del framework).
  - La URL del Lambda URL se imprime en el GitHub Actions Step Summary tras cada deploy.
  - `NG_ALLOWED_HOSTS: '*.lambda-url.us-east-1.on.aws'` en el environment de Lambda —
    `AngularNodeAppEngine` valida el header `host` por seguridad y rechazaría el dominio de
    la Lambda Function URL sin esta variable (leída por `getAllowedHostsFromEnv()` en
    `@angular/ssr/node`).
  - `lambda-handler.js` usa `import()` dinámico para cargar `server.mjs` (ESM) desde un
    bundle CJS — Node.js soporta dynamic `import()` en contexto CommonJS.
  - Serverless Framework v4 incluye esbuild nativo; el plugin `serverless-esbuild` fue
    eliminado (conflicto con v4). Config bajo `build.esbuild` en `serverless.yml`.
  - Fase 2 (producción): `serverless.yml` production stage + CloudFront + S3 para assets
    estáticos — pendiente de implementar cuando el MVP esté completo.

## 4. Dependencias instaladas

| Paquete | Versión | Tipo |
|---|---|---|
| `@angular/core` | ^22.0.0 | dependency |
| `@angular/common` | ^22.0.0 | dependency |
| `@angular/compiler` | ^22.0.0 | dependency |
| `@angular/forms` | ^22.0.0 | dependency |
| `@angular/platform-browser` | ^22.0.0 | dependency |
| `@angular/platform-server` | ^22.0.0 | dependency |
| `@angular/router` | ^22.0.0 | dependency |
| `@angular/ssr` | ^22.0.1 | dependency |
| `express` | ^5.1.0 | dependency |
| `rxjs` | ~7.8.0 | dependency |
| `tslib` | ^2.3.0 | dependency |
| `@vendia/serverless-express` | latest | dependency |
| `@angular/build` | ^22.0.1 | devDependency |
| `@angular/cli` | ^22.0.1 | devDependency |
| `@angular/compiler-cli` | ^22.0.0 | devDependency |
| `@types/express` | ^5.0.1 | devDependency |
| `@types/node` | ^20.17.19 | devDependency |
| `jsdom` | ^28.0.0 | devDependency |
| `prettier` | ^3.8.1 | devDependency |
| `typescript` | ~6.0.2 | devDependency |
| `vitest` | ^4.0.8 | devDependency |
| `angular-eslint` | 22.0.0 | devDependency |
| `eslint` | ^10.3.0 | devDependency |
| `@eslint/js` | ^10.0.1 | devDependency |
| `typescript-eslint` | 8.60.1 | devDependency |
| `serverless` | latest | devDependency |
| ~~`serverless-esbuild`~~ | ~~latest~~ | eliminado — Serverless Framework v4 incluye esbuild nativo |

## 5. Configuraciones vigentes

| Configuración | Valor | Estado |
|---|---|---|
| Dominio principal | `ocastelblanco.com` | Activo (apunta al sitio anterior) |
| Lambda stage `preview` | URL generada en primer deploy (ver GitHub Actions Step Summary) | Activo — despliega en cada push a feature branches y `rediseno-2026` |
| Subdominio CDN | `cdn.ocastelblanco.com` | No provisionado en esta iteración |
| Subdominio API | `api.ocastelblanco.com` | No provisionado |
| Serverless service name | `ocastelblanco-com` | Definido en `serverless.yml` |
| Región AWS | `us-east-1` | Definido en `serverless.yml` y workflow |
| GitHub Secrets | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `SERVERLESS_LICENSE_KEY` | Configurados |

## 6. Patrones de código establecidos

### Configuración zoneless (sin Zone.js)

`src/app/app.config.ts`:
```ts
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes), provideClientHydration(withEventReplay())
  ]
};
```

`src/app/app.config.server.ts` extiende `appConfig` con `provideServerRendering(withRoutes(serverRoutes))`.

### Path aliases (`tsconfig.json`)

Sin `baseUrl` (deprecado en TS 6, TS5101). Los `paths` deben usar rutas con prefijo `./`
(TS5090) relativas a la ubicación de `tsconfig.json`:
```json
"paths": {
  "@core/*": ["./src/app/core/*"],
  "@shared/*": ["./src/app/shared/*"],
  "@features/*": ["./src/app/features/*"],
  "@env/*": ["./src/environments/*"]
}
```

### Entornos

`src/environments/environment.ts` (dev) y `environment.prod.ts` exponen `production` y
`apiUrl` (`https://dev.api.ocastelblanco.com` / `https://api.ocastelblanco.com`).

### Design tokens (Technical Industrial Minimalism)

`src/styles/_tokens.scss` define todos los colores de `DESIGN.md` como custom properties
CSS bajo `:root` (`--color-surface`, `--color-primary-container` /Cyber Lime,
`--color-secondary-container` /Electric Cyan, etc.) y el spacing scale (`--spacing-xs` 4px →
`--spacing-xxl` 128px) más `--radius: 0px`.

`src/styles/_typography.scss` importa JetBrains Mono + Inter desde Google Fonts y define
mixins (`h1`, `h2`, `h3`, `body-lg`, `body-md`, `technical-label`, `data-point`) aplicados
tanto a selectores de elemento (`h1`, `h2`, `h3`) como a clases utilitarias (`.body-lg`,
`.technical-label`, etc.).

`src/styles.scss` importa ambos parciales con `@use`, fija `border-radius: var(--radius)`
en `*`, aplica `background-color`/`color` desde los tokens en `body` y agrega una textura
de ruido sutil (SVG `feTurbulence`, opacidad 2.5%) vía `body::before`.

### Shell de navegación (sidebar + topbar)

`src/app/shared/shell/sidebar/` y `src/app/shared/shell/topbar/` son componentes standalone
(`@shared/shell/sidebar/sidebar`, `@shared/shell/topbar/topbar`) integrados en
`src/app/app.html` envolviendo el `<router-outlet>`. La sidebar es una franja fija de 56px
con iconos de 20px que se expande a 220px en `:hover` (transición CSS, sin estado en
TypeScript) mostrando las etiquetas (`technical-label`). Los enlaces (`RouterLink` +
`RouterLinkActive`) apuntan a `/`, `/proyectos`, `/lab` y `/contacto` según `PRD.md` §5 —
estas rutas aún no tienen componentes asociados en `app.routes.ts` (se agregan al construir
cada feature). El topbar es una franja fija superior que ocupa el espacio restante
(`left: 56px`), con el nombre del sitio y el rol de Oliver Castelblanco.

### CI con GitHub Actions

`.github/workflows/ci.yml` corre en `push`/`pull_request` sobre `master` y
`rediseno-2026`: Node 22 + cache npm → `npm ci` → `npm run lint` → `npm run build` →
`npm test -- --watch=false`. El lint usa ESLint configurado por `@angular-eslint/schematics`
(`eslint.config.js` en la raíz, builder `lint` agregado a `angular.json`). Cualquier
componente/servicio nuevo debe pasar `npm run lint` localmente antes de hacer push.

## 7. Gotchas conocidos

| Situación | Solución |
|---|---|
| `git rm -rf .` en una rama huérfana no borra archivos que estaban en `.gitignore` (ya removido) | Limpiar manualmente `node_modules`, `dist`, `.angular`, `.DS_Store`, `src/secrets/*` después del `git rm` |
| `.gitignore` del sitio anterior se eliminó junto con todo lo demás | Se recreó un `.gitignore` nuevo en el primer commit de `rediseno-2026`, incluyendo `src/secrets/secrets*.ts`, `.claude/` y `.omc/` |
| TypeScript 6 (`~6.0.2`) ya no soporta `baseUrl` en `tsconfig.json` (TS5101) | Omitir `baseUrl`; los `paths` deben usar rutas relativas con prefijo `./` (TS5090), p. ej. `["./src/app/core/*"]` |
| `ng` global apunta a Angular CLI 20.x aunque exista Angular 22 | Usar `npx -y @angular/cli@22 new ...` explícitamente para forzar la versión 22 del schematic |

## 8. Documentos de referencia

| Documento | Propósito |
|---|---|
| `CLAUDE.md` | Instrucciones permanentes (stack, convenciones, OWASP, git flow) |
| `PRD.md` | Requisitos de producto, audiencia, roadmap |
| `tech-specs.md` | Arquitectura técnica de referencia |
| `MEMORY.md` | Este documento — estado y ADRs |
| `TODO.md` | Motor JIT — 2 tareas activas |
| `DESIGN.md` | Design system "Technical Industrial Minimalism" |
| `docs/objetivos-alcances.md` | Objetivos y alcances originales del rediseño |
| `docs/arquitectura/arquitectura_ocastelblanco.md` | Narrativa y estructura de contenidos del sitio |
| `docs/arquitectura/arch_orch_project_prd.md` | Brief de marca/diseño "ARCH_ORCH" (Google Stitch) |
| `docs/proceso/Stitch.md` | Bitácora del proceso de diseño con IA (prompts y resultados) |
| `docs/proceso/*.zip` | Exports de pantallas generadas con Google Stitch |
| `.github/workflows/ci.yml` | Workflow de CI: lint + build + test en push/PR a `master` y `rediseno-2026` |
| `eslint.config.js` | Configuración de ESLint (`@angular-eslint/schematics`) |

## 9. Contexto de la sesión actual

**Fecha:** 2026-06-19

**Qué se hizo hoy:**
- The Lab completado y fusionado (PR #14):
  - Componente standalone `Lab` en `src/app/features/lab/` con 3 entradas estáticas.
  - Diseño de tarjetas: borde izquierdo Electric Cyan, tag en cyan, snippet en variante.
  - i18n completo es-CO / en-US — 15 claves en namespace `lab` (`i18n.types.ts` + diccionarios).
  - Ruta `lab` registrada con `loadComponent` (lazy) en `app.routes.ts`.
  - Build en verde, 6 rutas pre-renderizadas.

**Próxima tarea:** Endpoint backend Terminal de contacto (`POST api.ocastelblanco.com/contact`).
