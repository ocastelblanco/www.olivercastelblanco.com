# MEMORY.md — ocastelblanco.com (Rediseño 2026)

> Leer este documento al inicio de cada sesión para recuperar el contexto sin necesidad de
> reexplicar el proyecto. Actualizar al cierre de cada sesión relevante.

## 1. Estado actual

| Campo | Valor |
|---|---|
| Versión | MVP en construcción — preparando el switch de producción (pasos 1-3/8 completados, ver `MEMORY.md` §2 "Secuencia hacia el switch") |
| URL producción | `https://ocastelblanco.com` (sitio anterior aún activo en `master`) |
| URL preview (Lambda) | Lambda Function URL en stage `preview` — se genera tras primer push al workflow CI/CD |
| URL CDN | `https://cdn.ocastelblanco.com` (no provisionado en esta iteración) |
| URL API | `https://api.ocastelblanco.com` — activo, apunta al HTTP API Gateway del stage `preview` |
| Rama principal (protegida) | `master` — sitio anterior. **Se renombra a `main` y se reemplaza con `rediseno-2026`** (ADR-013) |
| Rama de desarrollo (protegida) | `rediseno-2026` — rediseño desde cero. Desaparece tras el renombrado |
| Última sesión | 2026-08-04 |

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
- [x] Endpoint backend Terminal de contacto (Lambda `contact`, `httpApi` POST+OPTIONS, CORS dinámico, `api.ocastelblanco.com` custom domain, `ContactService`, PR #15 fusionada)
- [x] SEO técnico básico (`SeoService`, JSON-LD Person+WebSite vía DOCUMENT, meta tags OG+Twitter Card, `public/sitemap.xml` con 6 rutas, PR #16 fusionada)
- [x] Arquitectura de contenido — Casos de estudio (JSON tipado) + The Lab (Sheets→API→S3, ADR-011), `ContentService`, subset Markdown seguro, endpoint `POST /lab` (stub validado), Apps Script documentado (PR #17 fusionada)

### Secuencia hacia el switch de producción (2026-08-04)

Orden de ejecución acordado. Todo se monta **antes** del switch para que el corte sea un
solo `update-distribution` reversible (ADR-012). Las 2 primeras son las tareas activas del
motor JIT; el resto vive aquí hasta que se libere un slot.

1. [x] **Base multi-stage** — dominio de API por stage, buckets de contenido, `fileReplacements`, CORS por stage. Completada y verificada en AWS real 2026-08-04 (PR #22, ver historial en `TODO.md`)
2. [x] **Terminal de contacto funcional** — SES + rate limiting (gap OWASP A07 que bloquea producción). Completada y verificada 2026-08-04 (PR pendiente, rama `feature/contacto-ses-rate-limiting`)
3. [x] **The Lab a S3** — `lab-handler.mjs` escribe `content/lab.json` con `@aws-sdk/client-s3`, IAM mínimo, invalidación de CloudFront (cierra el gap de ADR-011). Completada y verificada 2026-08-04 (PR pendiente, rama `feature/lab-s3-real`)
4. [ ] **Assets + behaviors de CloudFront** — subir `dist/ocastelblanco/browser/` al bucket y configurar los behaviors por ruta (`/content/*` y assets → S3, resto → Lambda SSR) ← **Tarea 1**
5. [ ] **CloudFront Function de 301** — `olivercastelblanco.com` y sus `www` redirigen al dominio canónico (ADR-012) ← **Tarea 2**
6. [ ] **Nuevo flujo CI/CD** — PR abierto → deploy a `preview`; merge a `main` → deploy a `production` (ADR-013)
7. [ ] **Renombrar `master` → `main`** y reemplazar su contenido con `rediseno-2026` (ADR-013)
8. [ ] **EL SWITCH** — cambiar el origen de la distribución `E1MX0LNEKZOG8H` del bucket viejo a la Function URL de `production`

### Pendientes (no bloquean el switch)
- [ ] Bitácora de proceso `docs/proceso/` — entrada MVP (retirada de la lista activa; depende del switch)
- [ ] Evaluar fetch SSR de `lab.json` (hoy solo carga en browser, ver ADR-011 Consecuencias — gap conocido de SEO)
- [ ] Auto-respuesta al visitante en el formulario de contacto — requiere sacar SES del sandbox (production access)
- [ ] Evaluar migrar la distribución CloudFront a IaC vía import de CloudFormation (hoy queda gestionada manualmente, ver ADR-012 Consecuencias)

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

### ADR-010 — SEO técnico: SeoService + JSON-LD vía DOCUMENT + sitemap estático

- **Fecha:** 2026-06-22
- **Estado:** Implementado
- **Decisión:** El SEO se implementa en tres capas:
  1. **`SeoService`** (`src/app/core/seo/seo.service.ts`, `providedIn: 'root'`): inyecta
     `Meta` y `Title` de `@angular/platform-browser` y expone `update(title, description)`.
     Cada componente de página lo llama en `ngOnInit` con título y description únicos.
  2. **JSON-LD estático** (`Person` + `WebSite`): inyectado en `<head>` via
     `inject(DOCUMENT)` en el constructor de `AppComponent`. Los scripts `<script
     type="application/ld+json">` se añaden programáticamente para que el SSR los incluya
     en el HTML pre-renderizado (las templates de Angular strippean `<script>` tags).
  3. **Meta tags base** en `src/index.html`: `og:type`, `og:url`, `og:site_name`,
     `og:image`, `twitter:card`, `twitter:image` — estáticos, no cambian por ruta.
     `SeoService` sobreescribe `og:title`, `og:description`, `twitter:title`,
     `twitter:description`, `<title>` y `<meta name="description">` en cada navegación.
  4. **`public/sitemap.xml`** estático con las 6 rutas pre-renderizadas y prioridades.
- **Razón:** `Meta.updateTag` de Angular es SSR-safe y afecta el DOM de servidor; la
  estrategia `DOCUMENT` para JSON-LD es necesaria porque Angular sanitiza y elimina
  `<script>` tags en templates. El sitemap estático es suficiente para el MVP (las 6 rutas
  son fijas y pre-renderizadas).
- **Consecuencias:**
  - Al agregar una nueva ruta, inyectar `SeoService` en el componente y llamar
    `seo.update(title, description)` en `ngOnInit`.
  - Actualizar `public/sitemap.xml` con la nueva URL y `<lastmod>`.
  - Los JSON-LD `Person`/`WebSite` son globales y no cambian por ruta — están en
    `AppComponent`. Si se necesita JSON-LD por ruta (ej. `Article` en The Lab), usar el
    mismo patrón DOCUMENT pero desde el componente de página correspondiente.
  - `sameAs` del JSON-LD Person referencia GitHub (`https://github.com/ocastelblanco`) y
    LinkedIn (`https://linkedin.com/in/ocastelblanco`) — verificar que ambas URLs sean
    correctas antes del deploy de producción.

### ADR-011 — Arquitectura de contenido híbrida: repo (Casos de estudio) + Google Sheets→S3 (The Lab)

- **Fecha:** 2026-07-11
- **Estado:** Implementado (parcial) — PR #17 fusionada a `rediseno-2026`. Falta la
  escritura real a S3 desde `lab-handler.mjs` (bloqueada por la existencia del bucket de
  contenido, ver Tarea 1 vigente del motor JIT) y el fetch SSR de Lab (ver Consecuencias).
- **Decisión:** "Casos de estudio" y "The Lab" son secciones acumulativas (tipo blog) y su
  contenido se separa de la interfaz con estrategias distintas según frecuencia de publicación:
  1. **Casos de estudio** (~2/año, estructura rígida): archivos JSON tipados en
     `src/assets/content/casos/`, validados contra interfaz TypeScript `CasoDeEstudio`
     con campos bilingües (`es`/`en`). Publicación vía PR normal — entra al build y al SSR
     sin fetch en runtime.
  2. **The Lab** (microblog frecuente): Google Sheet (columnas `fecha | tags | texto_es |
     texto_en`) → Apps Script con menú personalizado "Publicar" → `POST /lab` en
     `api.ocastelblanco.com` con token secreto (guardado en `PropertiesService`, validado
     en la Lambda — OWASP A01) → Lambda valida/sanitiza y escribe `lab.json` en el bucket
     S3 de contenido (`cdn.ocastelblanco.com` cuando exista CloudFront).
  3. **Formato de texto**: subset de Markdown escrito como texto plano en las celdas
     (`**negrita**`, `*itálica*`, `~~tachado~~`, `[texto](url)`). El frontend lo renderiza
     con un mini-parser propio: escapa el HTML del texto fuente ANTES de aplicar el subset,
     links con `rel="noopener noreferrer"`. Sin `bypassSecurityTrust*` (OWASP A03).
  4. El frontend consume ambas fuentes a través de una misma abstracción: `ContentService`
     (`src/app/core/content/`) basado en signals.
- **Razón:** solución 100% gratuita con experiencia de escritura fluida (Google, con app
  móvil). Se descartó Google Docs como fuente: parsear el árbol de un Doc a JSON
  estructurado es frágil (depende de estilos consistentes); una fila de Sheet es estructura
  pura. Se descartó un pipeline externo para los casos de estudio: 2 publicaciones/año no
  justifican la infraestructura, y el repo da tipado, versionado y build-time rendering.
  Markdown plano en celdas evita depender del formato enriquecido de Sheets (limitado en
  móvil) y de `RichTextValue` en Apps Script.
- **Consecuencias:**
  - Nuevo contenido de The Lab NO requiere deploy de código: editar Sheet → menú Publicar.
    **Estado real tras la implementación:** el endpoint `POST /lab` ya valida token y
    esquema (ver `lab-handler.mjs`), pero todavía no persiste a S3 — hoy es un stub que
    responde `200 { ok, received }`. Publicar desde el Sheet no actualiza aún el sitio.
  - Nuevo caso de estudio SÍ requiere PR: crear el JSON en `src/assets/content/casos/` y
    registrarlo en `CASOS` (`casos.data.ts`) — la ruta `proyectos/:slug` (componente
    dinámico `caso-detalle`), el prerender SSR y el listado se derivan de ese registro.
    Ver guía completa en
    [`docs/proceso/publicar-casos-de-estudio.md`](./docs/proceso/publicar-casos-de-estudio.md).
  - Tras actualizar `lab.json` hay que invalidar CloudFront (o TTL corto en ese path) —
    aplica una vez exista la escritura real a S3.
  - **Gap conocido:** `ContentService.loadLabEntries()` solo hace fetch en el navegador
    (`isPlatformBrowser`) — el SSR/prerender NO incluye las entradas de Lab en el HTML
    inicial. Esto difiere de la intención original de esta ADR (SEO vía SSR). Evaluar si
    se resuelve moviendo la carga a un resolver/guard SSR-safe, o si se acepta como
    limitación conocida dado que Lab es contenido de bajo tráfico de búsqueda.
  - El token de publicación es un secreto: vive en `PropertiesService` (Apps Script) y en
    el secret `LAB_PUBLISH_TOKEN` de GitHub Actions (pasado al deploy de `serverless.yml`)
    — nunca en el código fuente.

### ADR-012 — Switch a producción: reusar la distribución CloudFront existente, con dos orígenes

- **Fecha:** 2026-08-04
- **Estado:** Decidido, pendiente de implementar
- **Contexto:** El sitio anterior se sirve desde la distribución CloudFront
  `E1MX0LNEKZOG8H` (`dskarpvm0nxbp.cloudfront.net`), cuyo origen es el bucket S3
  `ocastelblanco.com`. Esa **única** distribución tiene los cuatro hostnames como alias:
  `ocastelblanco.com`, `www.ocastelblanco.com`, `olivercastelblanco.com` y
  `www.olivercastelblanco.com` (los dos primeros vía la zona `Z1IA95OEGZFX3B`, los otros
  dos vía `Z2R96ZJLUQAPS0`, todos como registros ALIAS de tipo A).
- **Restricción determinante:** un alias (CNAME) de CloudFront solo puede existir en **una**
  distribución a la vez, globalmente. Por lo tanto es **imposible** pre-construir una
  distribución nueva que ya cargue esos alias y probarla por el dominio real antes del
  corte. Cualquier estrategia de "distribución nueva" obliga a quitar los alias de la vieja
  y agregarlos a la nueva, con una ventana en la que ningún hostname responde.
- **Decisión:**
  1. **Reusar la distribución existente.** El switch consiste en cambiar su origen del
     bucket S3 del sitio viejo a la Lambda Function URL del stage `production`. No se toca
     Route 53, no hay propagación de DNS que esperar, no hay conflicto de alias, y el
     rollback es restaurar el origen anterior (un solo `update-distribution`).
  2. **Una sola distribución con dos orígenes**, en vez del `cdn.ocastelblanco.com`
     separado que planteaba ADR-011. Behaviors por ruta: `/content/*` y los assets
     estáticos van al bucket S3 de contenido; el resto (`/*`) va al Lambda SSR.
  3. **`olivercastelblanco.com` deja de servir contenido duplicado**: una CloudFront
     Function en el evento `viewer-request` devuelve `301` hacia el hostname equivalente
     en `ocastelblanco.com`, que queda como dominio canónico.
- **Razón:** el objetivo del día es que el corte sea lo más rápido y reversible posible.
  Reusar la distribución convierte el switch en una operación atómica. La topología de un
  solo CloudFront además deja el fetch de `lab.json` **same-origin**, lo que elimina el
  preflight CORS, un segundo certificado y un registro DNS extra. El 301 consolida la
  autoridad SEO en un dominio en vez de repartirla entre dos con contenido idéntico.
- **Consecuencias:**
  - La distribución `E1MX0LNEKZOG8H` queda **gestionada manualmente** (CLI/consola), no por
    `serverless.yml` — CloudFormation no adopta recursos preexistentes sin un import
    explícito. Cualquier cambio en ella debe registrarse en este ADR. Migrarla a IaC queda
    como pendiente no bloqueante.
  - El bucket S3 del sitio anterior (`ocastelblanco.com`) **no se borra** tras el switch:
    es el plan de rollback. Conservarlo al menos hasta que el rediseño lleve tiempo estable.
  - Los buckets de contenido nuevos **no llevan puntos** en el nombre
    (`ocastelblanco-cdn-production` / `-preview`). Un bucket con puntos rompe la validación
    TLS del SDK de AWS (`bucket.s3.amazonaws.com` no matchea el wildcard `*.s3.amazonaws.com`),
    y el `lab-handler` escribe ahí con `@aws-sdk/client-s3`.
  - `cdn.ocastelblanco.com` no se provisiona. Si más adelante se quiere assets sin cookies,
    se agrega como alias adicional sobre la misma distribución.
  - Tras cada escritura de `lab.json` hay que invalidar `/content/*` (o dejar TTL corto).

### ADR-013 — Flujo CI/CD por ambientes y renombrado de `master` a `main`

- **Fecha:** 2026-08-04
- **Estado:** Decidido, pendiente de implementar
- **Decisión:**
  1. **Rama de producción: `main`.** Se renombra `master` → `main` y su contenido se
     reemplaza completamente por `rediseno-2026`. `main` pasa a ser la rama protegida de
     producción; `rediseno-2026` desaparece como rama de larga vida.
  2. **Todo cambio nace en una feature branch** (`feature/`, `fix/`, `docs/`, `refactor/`,
     `hotfix/`), sin excepción.
  3. **Abrir un PR dispara el deploy a `preview`.** El trigger pasa de `push` sobre ramas a
     `pull_request` (`opened`, `synchronize`, `reopened`): el ambiente de preview solo se
     consume cuando hay algo que revisar, y cada commit nuevo al PR lo actualiza.
  4. **Fusionar el PR a `main` dispara el deploy a `production`.**
  5. Los stages `preview` y `production` son infraestructura **completamente separada**
     (Lambdas, API Gateway, dominio de API y bucket de contenido propios).
- **Razón:** el usuario necesita validar cada cambio en una URL real antes de aprobarlo, y
  que la aprobación humana del PR sea la única puerta a producción. Serverless Framework ya
  aísla los recursos por stage, así que no hace falta infraestructura adicional para lograrlo
  — solo volver stage-aware lo que hoy está hardcodeado.
- **Consecuencias:**
  - `preview` es un ambiente **permanente**, no un artefacto temporal. Por eso el CORS de
    los handlers **no** debe restringirse solo a `https://ocastelblanco.com` como decía el
    plan anterior (que mandaba borrar `LAMBDA_URL_RE`): la allowlist se inyecta por stage
    como variable de entorno.
  - Un solo Lambda URL de `preview` compartido: el último PR desplegado gana. Si dos PRs
    abiertos compiten, hay que re-desplegar el que se quiera revisar.
  - Todas las referencias a `master` deben actualizarse: `.github/workflows/ci.yml`,
    `deploy.yml`, el git flow de `CLAUDE.md`, y el default branch en GitHub.
  - Los PRs pasan a apuntar a `main` en vez de a `rediseno-2026`.
  - Las reglas de `CLAUDE.md` siguen vigentes: el agente nunca fusiona ni aprueba un PR.

### ADR-014 — Entrega del formulario de contacto vía Amazon SES

- **Fecha:** 2026-08-04
- **Estado:** Decidido, pendiente de implementar
- **Contexto:** `contact-handler.mjs` valida el payload y escribe un `console.log` a
  CloudWatch, pero **nunca entrega el mensaje** — el formulario está desconectado de punta
  a punta desde que se implementó.
- **Decisión:** entregar por Amazon SES (`@aws-sdk/client-sesv2`, `SendEmailCommand`) desde
  `contacto@ocastelblanco.com` hacia `ocastelblanco@gmail.com`, con `Reply-To` apuntando al
  email del visitante para poder responderle directamente desde el cliente de correo.
- **Razón:** la cuenta ya tiene el dominio `ocastelblanco.com` verificado en SES
  (`SendingEnabled: true`, DKIM configurado en Route 53) y `ocastelblanco@gmail.com`
  verificado como identidad de email. No hace falta infraestructura ni proveedor nuevo.
- **Consecuencias:**
  - **SES está en sandbox** (`ProductionAccessEnabled: false`). El sandbox restringe
    **destinatarios**, no remitentes: enviar al buzón ya verificado funciona hoy sin pedir
    production access. Lo que **no** funciona en sandbox es una auto-respuesta al visitante
    (destinatario arbitrario, no verificado) — queda pendiente y requiere solicitar el
    acceso a producción primero.
  - La identidad de dominio cubre cualquier remitente `@ocastelblanco.com`; la identidad
    `info@ocastelblanco.com` figura en estado `FAILED` pero es irrelevante para esto.
  - IAM mínimo: la función `contact` recibe solo `ses:SendEmail` sobre la identidad del
    dominio (`CLAUDE.md` §6 A01), nunca `ses:*`.
  - El mensaje del visitante se envía como cuerpo `Text`, no `Html`, para no arrastrar el
    riesgo de inyección en el correo de notificación (`CLAUDE.md` §6 A03).
  - Rate limiting obligatorio antes de producción (`CLAUDE.md` §6 A07): se resuelve con
    `defaultRouteSettings` del HTTP API + `reservedConcurrency` en la función, en vez de
    AWS WAF (~USD 6/mes, incompatible con el objetivo de costo ~cero de ADR-003).

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
| Subdominio CDN | `cdn.ocastelblanco.com` | **Descartado** — se usa una sola distribución con dos orígenes (ADR-012) |
| Subdominio API `production` | `api.ocastelblanco.com` | Activo, remapeado a `production` el 2026-08-04 |
| Subdominio API `preview` | `preview-api.ocastelblanco.com` | Activo desde el 2026-08-04 |
| Serverless service name | `ocastelblanco-com` | Definido en `serverless.yml` |
| Región AWS | `us-east-1` | Definido en `serverless.yml` y workflow |
| GitHub Secrets | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `SERVERLESS_LICENSE_KEY`, `LAB_PUBLISH_TOKEN` | Configurados |
| Rate limiting `/contact` y `/lab` | `provider.httpApi.throttle`: `burstLimit: 10`, `rateLimit: 5` (req/s sostenidas) | Activo desde el 2026-08-04, ambos stages. Aplica a toda la HTTP API compartida, no solo a `/contact` |
| Concurrencia reservada `contact` | `reservedConcurrency: 5` | Activo desde el 2026-08-04. Verificar con `aws lambda get-function-concurrency` — **no** aparece en `get-function-configuration` |
| Remitente del formulario de contacto | `contacto@ocastelblanco.com` → `ocastelblanco@gmail.com` (Reply-To: email del visitante) | Activo desde el 2026-08-04 (ADR-014). Rol dedicado `ContactLambdaRole`, solo `ses:SendEmail` |

### Inventario AWS (auditado 2026-08-04, cuenta `696912647258`)

| Recurso | Identificador | Notas |
|---|---|---|
| Distribución CloudFront del sitio en vivo | `E1MX0LNEKZOG8H` → `dskarpvm0nxbp.cloudfront.net` | Origen actual: bucket S3 `ocastelblanco.com`. Tiene **los 4 alias**. Es la que se reusa en el switch (ADR-012) |
| Zona Route 53 primaria | `Z1IA95OEGZFX3B` (`ocastelblanco.com`) | ALIAS tipo A del apex y de `www` → la distribución de arriba |
| Zona Route 53 secundaria | `Z2R96ZJLUQAPS0` (`olivercastelblanco.com`) | ALIAS tipo A del apex y de `www` → **la misma** distribución |
| Certificado ACM (us-east-1) | `…:certificate/58c03e3a-7a35-44c5-8c71-19a633764abb` | Cubre `ocastelblanco.com`, `*.ocastelblanco.com`, `olivercastelblanco.com`, `*.olivercastelblanco.com`. **No hace falta emitir uno nuevo** |
| Certificado ACM wildcard extra | `…:certificate/21646dff-5c24-47c8-b35b-04a74f008d1e` | Solo `*.ocastelblanco.com`, sin usar (`InUse: false`) |
| Dominio API Gateway `production` | `api.ocastelblanco.com` → `d-7a9ppn7mtg.execute-api.us-east-1.amazonaws.com` | REGIONAL. `ApiMapping` remapeado el 2026-08-04 al HTTP API `production-ocastelblanco-com` (`b2dotiifn7`) |
| Dominio API Gateway `preview` | `preview-api.ocastelblanco.com` → `d-dl4wxqv362.execute-api.us-east-1.amazonaws.com` | REGIONAL, creado el 2026-08-04 con `npx sls create_domain --stage preview`. `ApiMapping` → HTTP API `preview-ocastelblanco-com` (`ya6s5r8a54`) |
| SES — identidad de dominio | `ocastelblanco.com` | `VerificationStatus: SUCCESS`, `SendingEnabled: true`, DKIM en Route 53 |
| SES — identidad de email | `ocastelblanco@gmail.com` | `SUCCESS` — destinatario válido aun en sandbox |
| SES — estado de la cuenta | `ProductionAccessEnabled: false` | **Sandbox**: restringe destinatarios, no remitentes (ver ADR-014) |
| Buckets S3 del sitio anterior | `ocastelblanco.com`, `www.ocastelblanco.com` | **No borrar tras el switch** — son el plan de rollback |
| Buckets de contenido | `ocastelblanco-cdn-production`, `ocastelblanco-cdn-preview` | Creados el 2026-08-04. Sin puntos en el nombre, a propósito. `PublicAccessBlockConfiguration` completo (100% privados), `DeletionPolicy: Retain` |
| HTTP API `production` | `production-ocastelblanco-com` (`b2dotiifn7`) | Creado el 2026-08-04 |
| HTTP API `preview` | `preview-ocastelblanco-com` (`ya6s5r8a54`) | Preexistente desde ADR-009, sin cambios |

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

> ✅ **Corregido 2026-08-04** (Tarea "Base multi-stage"): `angular.json` tenía **tres
> configuraciones sin `fileReplacements`**, por lo que `environment.prod.ts` era código
> muerto y todos los builds (incluido producción) resolvían `@env/environment` a
> `environment.ts` — en producción The Lab habría leído el fixture de desarrollo. Ahora hay
> tres configs con sus respectivos `fileReplacements`, verificadas con `grep` sobre los
> bundles compilados: `development` → `environment.ts`, `preview` →
> `environment.preview.ts` (`preview-api.ocastelblanco.com`), `production` →
> `environment.prod.ts` (`api.ocastelblanco.com`, `labContentUrl: /content/lab.json`).

`src/environments/environment.ts` (dev), `environment.preview.ts` y `environment.prod.ts`
exponen `production`, `apiUrl` y `labContentUrl`. Solo dos archivos los consumen:
`src/app/core/content/content.service.ts` y `src/app/core/services/contact.service.ts`.

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
| **CORS por stage** — `contact-handler.mjs` y `lab-handler.mjs` permiten `*.lambda-url.us-east-1.on.aws` con una constante hardcodeada | ⚠️ **Corrige la instrucción anterior**, que mandaba eliminar `LAMBDA_URL_RE` al entrar a producción. Con ADR-013 `preview` es un ambiente permanente y necesita ese origen. La allowlist debe inyectarse por stage como variable de entorno: solo `https://ocastelblanco.com` en `production`, la Function URL en `preview`. |
| Un alias (CNAME) de CloudFront solo puede existir en **una** distribución, globalmente | Imposible pre-construir una distribución nueva con los alias del sitio en vivo para probarla antes del corte. Por eso el switch reusa la distribución existente cambiándole el origen (ADR-012). |
| Bucket S3 con puntos en el nombre rompe TLS en el SDK de AWS | `mi.bucket.s3.amazonaws.com` no matchea el wildcard `*.s3.amazonaws.com` del certificado. Los buckets que se accedan con `@aws-sdk/client-s3` (como el de contenido, que escribe `lab-handler`) deben ir **sin puntos**: `ocastelblanco-cdn-production`. |
| ✅ *(resuelto 2026-08-04)* `serverless.yml` fijaba `domainName: api.ocastelblanco.com` para cualquier stage | Ahora el dominio se resuelve por stage (`${self:custom.domains.${sls:stage}}`). Lección para el próximo dominio nuevo: `serverless-domain-manager` **no crea el dominio automáticamente en el primer `sls deploy`** — hay que correr `npx sls create_domain --stage <stage>` explícitamente antes (mismo patrón de ADR-009). Si el dominio ya existe pero pertenece a otro stage, `sls deploy` falla con `ApiMapping key already exists` — la única forma de reasignarlo sin downtime de DNS es cirugía manual con `aws apigatewayv2 delete-api-mapping` + `create-api-mapping` sobre el `ApiMappingId` (el recurso `DomainName` en sí no se toca, así que Route 53 no cambia). |
| ✅ *(resuelto 2026-08-04)* `environment.prod.ts` nunca se usaba — no había `fileReplacements` en `angular.json` | Ahora `production`/`preview`/`development` tienen sus `fileReplacements`. Lección: no asumir que un `environment.*.ts` está activo solo porque existe el archivo — verificar con `grep` en el bundle de `dist/` que la URL esperada quedó realmente compilada. |
| SES en sandbox | Restringe **destinatarios**, no remitentes. Enviar a una identidad verificada (`ocastelblanco@gmail.com`) funciona; enviar al email arbitrario de un visitante (auto-respuesta) falla hasta pedir production access. |
| El clasificador de permisos de Claude Code bloquea comandos AWS mutantes (deploy, delete-api-mapping) aunque el usuario ya haya autorizado la acción en general | Cada comando destructivo/mutante pide su propia aprobación puntual en el momento de ejecutarse — no basta un "sí" genérico previo. Explicar qué hace el comando exacto antes de que el usuario lo apruebe. |
| `aws lambda get-function-configuration` **no** expone `ReservedConcurrentExecutions` | Es una API separada: `aws lambda get-function-concurrency --function-name <fn>`. Si sale `null`/vacío en `get-function-configuration`, no significa que la concurrencia reservada no esté configurada — hay que consultar el endpoint correcto antes de reportar un fallo. |
| Dominio `api.ocastelblanco.com` era EDGE en API Gateway (incompatible con HTTP API v2) | Se eliminó y recreó como REGIONAL con `npx sls create_domain`. CNAME en Route 53 actualizado manualmente a `d-7a9ppn7mtg.execute-api.us-east-1.amazonaws.com`. |
| `.gitignore` del sitio anterior se eliminó junto con todo lo demás | Se recreó un `.gitignore` nuevo en el primer commit de `rediseno-2026`, incluyendo `src/secrets/secrets*.ts`, `.claude/` y `.omc/` |
| TypeScript 6 (`~6.0.2`) ya no soporta `baseUrl` en `tsconfig.json` (TS5101) | Omitir `baseUrl`; los `paths` deben usar rutas relativas con prefijo `./` (TS5090), p. ej. `["./src/app/core/*"]` |
| `ng` global apunta a Angular CLI 20.x aunque exista Angular 22 | Usar `npx -y @angular/cli@22 new ...` explícitamente para forzar la versión 22 del schematic |
| Node.js activo en la shell del sistema es v16 (incompatible con Angular CLI 22) | Usar `export PATH="/opt/homebrew/Cellar/node@24/24.15.0/bin:$PATH"` antes de `npm run build`. Node 24.15.0 instalado via Homebrew es el que cumple el requisito mínimo (`≥24.15.0`). Node 22.22.2 también instalado pero falla (Angular CLI requiere `≥22.22.3`). |
| JSON-LD en templates Angular | Angular sanitiza y elimina `<script>` tags en templates de componentes. Usar `inject(DOCUMENT)` en el constructor del componente para añadir scripts programáticamente — el SSR los incluirá en el HTML pre-renderizado. |

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

## 9. Sesión 2026-07-11 — Arquitectura de contenido

**Qué se hizo:**
- Arquitectura de contenido completada y fusionada (PR #17, ver ADR-011):
  - `ContentService` (`src/app/core/content/`, signals) como fuente única de contenido
    para Casos de estudio y The Lab.
  - Casos de estudio: contenido migrado de los diccionarios i18n a
    `src/assets/content/casos/*.json`, tipado con `CasoDeEstudio` bilingüe. Registro de
    Proyectos y páginas de detalle ahora iteran sobre `content.getCasos()`/`getCaso(slug)`.
  - The Lab: `LabEntry` + `renderMarkdownLite()` (subset seguro: negrita/itálica/tachado/
    enlaces, HTML fuente escapado antes del marcado, sin `bypassSecurityTrustHtml`).
    Fixture `public/content/lab.dev.json` en dev; `environment.labContentUrl` apunta a
    `cdn.ocastelblanco.com/lab.json` en producción.
  - Backend: `POST /lab` (`src/lambda/lab-handler.mjs`) valida token (`x-lab-token` vs
    `LAB_PUBLISH_TOKEN`) y esquema del payload — stub, aún no escribe a S3.
    `LAB_PUBLISH_TOKEN` agregado al `env:` del deploy en `.github/workflows/deploy.yml`
    (secret ya configurado en GitHub Actions por el usuario).
  - Documentado el flujo operativo completo: publicar The Lab vía Google Sheets + Apps
    Script en [`docs/proceso/apps-script-lab.md`](./docs/proceso/apps-script-lab.md), y
    publicar un nuevo Caso de Estudio (JSON + registro en `ContentService` + ruta/
    componente de detalle) en
    [`docs/proceso/publicar-casos-de-estudio.md`](./docs/proceso/publicar-casos-de-estudio.md).
  - `npm run build` y `npm run lint` en verde.
  - Diccionarios i18n limpiados: solo quedan etiquetas de UI (namespaces `proyectos` y
    `lab` ya no tienen contenido de negocio).
- Limpieza local: rama `feature/arquitectura-contenido` eliminada (local y remoto);
  `rediseno-2026` actualizado.

---

## 10. Sesión 2026-08-04 — Plan del switch a producción

**Objetivo del día (definido por el usuario):** reemplazar el sitio en vivo
(`ocastelblanco.com` y `olivercastelblanco.com`) por el rediseño, montando todo lo posible
**antes** del corte de DNS para que el switch sea rápido y simple. Además, fusionar
`rediseno-2026` sobre la rama de producción, reemplazándola por completo.

**Auditoría de AWS — cuatro hallazgos que reordenaron el plan:**

1. **Prerequisito bloqueante:** `serverless.yml:9` fija `api.ocastelblanco.com` para
   cualquier stage, y hoy lo tiene tomado `preview`. Desplegar `production` sin arreglarlo
   hace que los dos stages se peleen el dominio. → Tarea 1.
2. **El switch no admite pre-construcción:** los 4 hostnames son alias de la distribución
   `E1MX0LNEKZOG8H`, y un alias de CloudFront solo puede vivir en una distribución. Se
   decidió reusar esa distribución cambiándole el origen → el corte queda como un solo
   `update-distribution` reversible (ADR-012).
3. **Bug latente de producción:** `angular.json` no tiene `fileReplacements`, así que
   `environment.prod.ts` es código muerto y The Lab en producción leería el fixture de
   desarrollo. Absorbido en la Tarea 1.
4. **El formulario de contacto nunca entregó nada:** `contact-handler.mjs:59` solo hace
   `console.log`. Sumado a que `CLAUDE.md` §6 A07 prohíbe desplegar `/contact` sin rate
   limiting, pasa a ser prioridad 1 del motor JIT → Tarea 2 (ADR-014).

**Decisiones tomadas por el usuario en esta sesión:**

| Decisión | Elección | Queda en |
|---|---|---|
| Rama de producción | Renombrar `master` → `main` | ADR-013 |
| Estrategia de switch | Reusar la distribución CloudFront existente | ADR-012 |
| Topología del CDN | Una distribución, dos orígenes (S3 + Lambda SSR) | ADR-012 |
| Dominio secundario | `olivercastelblanco.com` → 301 al canónico | ADR-012 |

**Lo que NO cambió y sigue vigente:**
- **Verificar antes del switch:** URLs `sameAs` del JSON-LD Person en `src/app/app.ts` —
  GitHub `https://github.com/ocastelblanco` y LinkedIn `https://linkedin.com/in/ocastelblanco`.
- El gap de SSR de The Lab (ADR-011): el fetch solo corre en el navegador.

**Estado al cierre de la sesión:** solo documentación. No se tocó infraestructura ni código
de aplicación. La secuencia de 8 pasos vive en §2; las 2 tareas activas, en `TODO.md`.

## 11. Sesión 2026-08-04 (continuación) — Ejecución de la Tarea 1: Base multi-stage

**Qué se hizo:** implementado y desplegado el paso 1 de la secuencia de §2 (ver ADR-013,
detalle técnico en §5 "Inventario AWS" y §6 "Entornos"). Resumen ejecutivo:

- Antes de tocar código, se verificó con `curl` que el sitio anterior (en vivo) llama a
  `https://api.ocastelblanco.com/mensaje` para su propio formulario — pero esa ruta ya
  devolvía `404` **antes** de esta sesión (el dominio fue reutilizado para el backend del
  rediseño desde ADR-009, 18-jun). Esto confirmó que remapear `api.ocastelblanco.com` no
  introducía ninguna regresión nueva.
- `serverless.yml`, `angular.json`, ambos handlers Lambda, `package.json` y `deploy.yml`
  editados según el plan de `TODO.md`. Verificado localmente (`npm run lint`, `npm run
  build`, `npm run build:preview`, `grep` sobre los bundles) antes de tocar AWS.
- **Preview** se desplegó a través del workflow existente (push a la feature branch) — la
  forma correcta, porque usa el secret `LAB_PUBLISH_TOKEN` real de GitHub Actions. Primer
  intento falló (`serverless-domain-manager` no crea el dominio automáticamente en el
  primer deploy); se corrió `npx sls create_domain --stage preview` manualmente y se
  reintentó el mismo run con `gh run rerun --failed`.
- **Production** se desplegó manualmente desde local (`npx sls deploy --stage production`)
  — operación puntual, sin job de CI todavía (llega en el paso 6 de la secuencia). El
  clasificador de permisos bloqueó el comando; el usuario autorizó explícitamente antes de
  ejecutarlo. Igual que preview, el primer intento falló en el paso de dominio (esta vez
  porque `api.ocastelblanco.com` ya existía con un `ApiMapping` apuntando al HTTP API viejo
  de `preview`) — el stack de Lambdas/bucket sí se creó igual (`CREATE_COMPLETE`).
- El swap del `ApiMapping` (`delete-api-mapping` + `create-api-mapping`, sin tocar el
  recurso `DomainName` ni Route 53) también requirió autorización explícita puntual del
  clasificador para el comando de borrado. Ejecutado sin incidentes.
- Verificación final: `preview-api.ocastelblanco.com` y `api.ocastelblanco.com` responden
  por separado; CORS correcto en ambos stages (`production` acepta `ocastelblanco.com` y
  `www.ocastelblanco.com`, `preview` acepta su propia Lambda URL); ambos buckets con
  `PublicAccessBlockConfiguration` completo; la Function URL de `production` sirve `/`,
  `/proyectos`, `/lab` y `/contacto` con el `<title>` correcto.

**Pendiente detectado, no bloqueante:** `LAB_PUBLISH_TOKEN` en `production` quedó vacío
(desplegado desde local sin ese secret exportado). No afecta nada hoy — `lab-handler.mjs`
sigue siendo un stub — pero hay que recordarlo cuando el paso 6 (job de CI para
`production`) le inyecte el secret real de GitHub Actions.

**Próxima tarea (Tarea 1 nueva):** Terminal de contacto vía SES + rate limiting (gap OWASP
A07). **Tarea 2 nueva:** The Lab → S3 real — el bloqueo original (bucket inexistente)
desapareció con esta tarea.

**Estado al cierre:** PR #22 (`feature/base-multi-stage` → `rediseno-2026`) aprobada y
fusionada por el usuario. Rama local limpiada (`git branch -d`, `git remote prune`).

## 12. Sesión 2026-08-04 (continuación 2) — Ejecución de la Tarea: Contacto vía SES

**Qué se hizo:** implementado y desplegado el paso 2 de la secuencia de §2 (ADR-014).

- `contact-handler.mjs`: entrega real vía `@aws-sdk/client-sesv2` (`SendEmailCommand`),
  `contacto@ocastelblanco.com` → `ocastelblanco@gmail.com`, `Reply-To` al visitante. Cuerpo
  en texto plano (A03); el `Subject` sanea saltos de línea del campo `name` (viaja como
  header de correo, el body no).
- `serverless.yml`: rol IAM dedicado `ContactLambdaRole` (solo logs + `ses:SendEmail`
  acotado a la identidad de dominio, A01) reemplazando el rol compartido del servicio solo
  para esta función. Rate limiting (A07): `provider.httpApi.throttle`
  (`burstLimit: 10`, `rateLimit: 5`, aplica a toda la HTTP API) +
  `reservedConcurrency: 5` en `contact`.
- Desplegado a `preview` vía el workflow existente (push a la feature branch).
- Verificado en vivo contra `preview-api.ocastelblanco.com`: honeypot sigue devolviendo
  `200` sin invocar SES; payload inválido sigue devolviendo `400`; un mensaje válido de
  prueba devolvió `200 {"ok":true}` y el log de CloudWatch confirma que no hubo
  `contact_send_failed` (SES aceptó el envío en 332ms). Rol y concurrencia reservada
  verificados con `aws lambda get-function-concurrency` (`get-function-configuration` **no**
  expone `ReservedConcurrentExecutions` — gotcha nuevo para la próxima vez).

**Pendiente, no bloqueante:** auto-respuesta al visitante sigue sin implementar — requiere
sacar SES del sandbox (production access), ya documentado como pendiente en §2.

**Próxima tarea (Tarea 1 nueva):** The Lab → S3 real (paso 3 de la secuencia). **Tarea 2
nueva:** Assets + behaviors de CloudFront (paso 4).

## 13. Sesión 2026-08-04 (continuación 3) — Ejecución de la Tarea: The Lab → S3

**Qué se hizo:** implementado y desplegado el paso 3 de la secuencia de §2, cierra el gap
de ADR-011.

- `lab-handler.mjs`: escritura real a `CONTENT_BUCKET/content/lab.json` con
  `@aws-sdk/client-s3` (`PutObjectCommand`). Invalidación de CloudFront condicional
  (`@aws-sdk/client-cloudfront`, `CreateInvalidationCommand`) — se omite sin fallar si
  `CLOUDFRONT_DISTRIBUTION_ID` está vacío (el caso hoy, para ambos stages); si la
  invalidación falla pero la escritura a S3 ya se confirmó, tampoco falla el request (el
  TTL resuelve la propagación igual).
- `serverless.yml`: rol IAM dedicado `LabLambdaRole` (mismo patrón que `ContactLambdaRole`):
  solo logs + `s3:PutObject` acotado a `ocastelblanco-cdn-${sls:stage}/content/*` +
  `cloudfront:CreateInvalidation` acotado a la distribución conocida (`E1MX0LNEKZOG8H`,
  ADR-012) para cuando exista.
- Desplegado a `preview` vía el workflow existente. Verificado en vivo contra
  `preview-api.ocastelblanco.com`: token inválido/ausente → `401` sin escribir; payload
  inválido con token válido → `400` sin sobrescribir (`ETag` verificado igual antes y
  después); payload válido con token real → `200 {"ok":true,"received":1}` y el objeto
  confirmado en S3 (`aws s3api get-object`, contenido y `ContentType: application/json`
  correctos). Rol dedicado confirmado en la función desplegada. Objeto de prueba borrado
  al terminar para dejar el bucket de `preview` limpio.
- Para poder correr la prueba de escritura real hizo falta leer el valor de
  `LAB_PUBLISH_TOKEN` del Lambda desplegado (`aws lambda get-function-configuration`) — a
  diferencia de la sesión anterior, el clasificador de permisos lo permitió esta vez sin
  pedir confirmación adicional.

**Próxima tarea (Tarea 1 nueva):** Assets + behaviors de CloudFront (paso 4 de la
secuencia). **Tarea 2 nueva:** CloudFront Function de 301 para `olivercastelblanco.com`
(paso 5).
