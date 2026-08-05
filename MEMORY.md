# MEMORY.md — ocastelblanco.com (Rediseño 2026)

> Leer este documento al inicio de cada sesión para recuperar el contexto sin necesidad de
> reexplicar el proyecto. Actualizar al cierre de cada sesión relevante.

## 1. Estado actual

| Campo | Valor |
|---|---|
| Versión | **MVP en producción.** El switch se ejecutó el 2026-08-04 — secuencia de 8 pasos completa (ver `MEMORY.md` §2) |
| URL producción (sitio en vivo) | `https://ocastelblanco.com` — sirve el **rediseño 2026** desde el 2026-08-04 |
| URL preview (Lambda) | Lambda Function URL del stage `preview` — un solo URL compartido, el último PR desplegado gana |
| URL CDN | Descartado como subdominio propio (ADR-012) — el contenido de `/content/*` se sirve desde la misma distribución que el sitio en vivo, vía OAC |
| URL API `production` | `https://api.ocastelblanco.com` — activo desde el 2026-08-04, apunta al HTTP API del stage `production` |
| URL API `preview` | `https://preview-api.ocastelblanco.com` — activo desde el 2026-08-04 |
| Rama de producción (protegida) | `main` — creada el 2026-08-04 a partir de `rediseno-2026` (ADR-013). Default branch del repositorio |
| Rama anterior (histórica, sin protección) | `rediseno-2026` — archivada, ya no es base de PRs |
| Rama del sitio anterior | `master` — **borrada** el 2026-08-04 a pedido del usuario. Código preservado en el tag `archive/sitio-anterior` |
| Última sesión | 2026-08-05 |

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
4. [x] **CloudFront sirve `/content/*`** — OAC + behavior acotado a `/content/*` únicamente (ver revisión ADR-012 2026-08-04: un behavior amplio `*.js`/`*.css` ahora rompería el sitio anterior, que usa el mismo patrón de nombres con hash). Subir el bundle Angular y los behaviors de assets estáticos se posponen al paso 8. Completada y verificada 2026-08-04 (PR pendiente, rama `feature/cloudfront-content-behavior`)
5. [x] **CloudFront Function de 301** — `olivercastelblanco.com` y sus `www` redirigen al dominio canónico (ADR-012). Completada y verificada 2026-08-04 (PR pendiente, rama `feature/cloudfront-301-olivercastelblanco`)
6. [x] **Nuevo flujo CI/CD** — PR abierto → deploy a `preview`; merge a `main` → deploy a `production` (ADR-013). Workflow implementado y verificado para `preview` 2026-08-04 (PR pendiente, rama `feature/cicd-pr-preview-merge-production`); el disparo real de `production` queda pendiente de que exista `main` (paso 7)
7. [x] **Renombrar `master` → `main`** y reemplazar su contenido con `rediseno-2026` (ADR-013). Completada y verificada 2026-08-04 — primer `deploy-production` real disparado y exitoso (PR de limpieza pendiente, rama `feature/renombrar-main-cleanup`)
8. [x] **EL SWITCH** — cambiar el origen por defecto (`/*`) de la distribución `E1MX0LNEKZOG8H` del bucket viejo a la Function URL de `production`, **más** (movido desde el paso 4 original): subir `dist/ocastelblanco/browser/` al bucket de contenido y agregar los behaviors de assets estáticos (`*.js`, `*.css`, etc.) → S3. **Ejecutado y verificado en vivo 2026-08-04** — `ocastelblanco.com` sirve el rediseño completo. Incidente breve durante la ejecución (Host header mal reenviado, resuelto en minutos) documentado en ADR-012. **La secuencia de 8 pasos hacia el switch queda completa.**

### Pendientes tras el switch

- [ ] 🔴 **Headers de seguridad ausentes en producción (OWASP A05)** — `CLAUDE.md` §6 exige `Content-Security-Policy`, `X-Content-Type-Options: nosniff` y `Referrer-Policy` en la respuesta de CloudFront/Lambda; verificado con `curl` el 2026-08-05 que **ninguno está presente**. Además se filtra `x-powered-by: Express`. Gap **activo en producción** desde el switch → Prioridad 1 del motor JIT ← **Tarea 1**
- [x] Bitácora de proceso `docs/proceso/` — entrada MVP. Completada 2026-08-05 (`2026-08-mvp-en-produccion.md`, cubre PRs #15-29)
- [ ] Evaluar fetch SSR de `lab.json` (hoy solo carga en browser, ver ADR-011 Consecuencias — gap conocido de SEO) ← **Tarea 2**
- [ ] Auto-respuesta al visitante en el formulario de contacto — requiere sacar SES del sandbox (production access)
- [ ] Evaluar migrar la distribución CloudFront a IaC vía import de CloudFormation (hoy queda gestionada manualmente, ver ADR-012 Consecuencias)
- [ ] Limpiar el glob de assets de `angular.json` — hoy copia `public/content/lab.dev.json` (fixture de dev) a **todos** los builds, incluido producción; se esquivó excluyéndolo de la subida a S3, pero la causa de fondo sigue
- [ ] Revisar en Search Console el efecto del 301 de `olivercastelblanco.com` sobre el indexado existente
- [ ] Evaluar un `404` limpio para `/content/*` — hoy el `CustomErrorResponses` heredado (403/404 → `/index.html`) hace que un objeto faltante devuelva `200` con HTML
- [ ] Integración con Cloudinary para gestión de imágenes (`PRD.md` §6, prioridad Media — único item del roadmap sin completar fuera de los de prioridad Baja)

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
- **Estado:** Implementado — el switch se ejecutó el 2026-08-04, `ocastelblanco.com` sirve el rediseño
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
- **Revisión 2026-08-04 (alcance de "Behaviors por ruta" reducido):** al ejecutar la tarea
  de CloudFront se detectó que el sitio anterior sirve sus propios assets
  (`main.*.js`, `styles.*.css`, `runtime.*.js`, `polyfills.*.js`) en la raíz con el mismo
  patrón de nombres con hash que usa Angular — confirmado con `curl` contra el bundle en
  vivo. Un behavior amplio `*.js`/`*.css` agregado **antes** del switch interceptaría esos
  requests y rompería el sitio en vivo de inmediato (los assets del rediseño, distintos,
  quedarían sirviéndose donde el navegador espera los del sitio anterior). En cambio,
  `/content/*` es un path que el sitio anterior no usa en absoluto — cero riesgo.
  **Consecuencia:** el punto 2 de la Decisión se ejecuta en dos tiempos: `/content/*` se
  agrega ahora (paso 4 de la secuencia, sin tocar el behavior por defecto ni los alias);
  los behaviors de assets estáticos y la subida del bundle Angular al bucket se posponen
  al switch (paso 8), donde ocurren atómicamente junto con el cambio de origen por
  defecto — en ese momento el sitio anterior ya no existe, así que la colisión de nombres
  deja de ser posible.
- **Implementado 2026-08-04 (paso 4 — `/content/*`):** Origin Access Control
  `ocastelblanco-cdn-production-oac` (`E31BG8XJQBYR7A`), origen nuevo
  `S3-ocastelblanco-cdn-production` (vía OAC) y behavior `/content/*` (`CachePolicyId`
  managed `CachingDisabled`) agregados a `E1MX0LNEKZOG8H`. Bucket policy condicionada a
  `AWS:SourceArn` de la distribución — no cuenta como pública, los 4 flags de
  `PublicAccessBlockConfiguration` del bucket siguen en `true`. El origen original y el
  behavior por defecto no se tocaron.
- **Implementado 2026-08-04 (paso 5 — 301 `olivercastelblanco.com`):** CloudFront
  Function `olivercastelblanco-redirect` (`cloudfront-js-2.0`, evento `viewer-request`)
  asociada solo al behavior por defecto: si `Host` es `olivercastelblanco.com` o
  `www.olivercastelblanco.com`, responde `301` hacia el mismo host+path+querystring bajo
  `ocastelblanco.com`; para cualquier otro host, deja pasar la request sin modificarla.
  Probada con `aws cloudfront test-function` (3 casos: host secundario con
  path+querystring, `www.` secundario, host canónico sin cambios) antes de publicarla y
  asociarla. Verificado en vivo: los 4 hostnames responden como se espera, el sitio
  anterior (home + `main.js`) sin cambios.
- **Gotcha descubierto al verificar (no es una regresión de esta tarea):** la
  distribución ya tenía `CustomErrorResponses` configurados desde el sitio anterior
  (403/404 → `/index.html` con `200`, `ErrorCachingMinTTL: 300`) — un fallback típico de
  SPA. Como el `ResponsePagePath` (`/index.html`) no matchea `/content/*`, CloudFront lo
  resuelve por el behavior por defecto (bucket viejo). Consecuencia: pedir
  `/content/lab.json` cuando el objeto **no existe** en el bucket de contenido devuelve
  `200` con el `index.html` del sitio anterior, no un `404` limpio — comportamiento
  preexistente, no introducido por esta tarea (confirmado: con el objeto presente,
  `/content/lab.json` responde el JSON real correctamente). Relevante para cuando el
  frontend haga fetch de Lab en producción: si el objeto llega a faltar, el fetch
  recibiría HTML en vez de JSON. No bloqueante hoy (el switch de paso 8 reemplaza el
  origen del sitio anterior de todas formas), pero anotar como riesgo a revisar si
  `CustomErrorResponses` se hereda tal cual tras el switch.
  **Confirmado tras el switch:** el gotcha persiste, ahora contra el nuevo origen — pedir
  `/content/lab.json` sin el objeto presente devuelve `200` con el HTML del rediseño
  (renderizado por la Lambda vía el mismo `CustomErrorResponse`), no un `404`. Sigue sin
  ser bloqueante (comportamiento idéntico al de antes del switch, solo que ahora
  renderiza la app nueva) pero queda como candidato a revisar en una tarea futura si se
  quiere un `404` limpio para `/content/*`.
- **Implementado y ejecutado 2026-08-04 (paso 8 — EL SWITCH):** preparación completada
  primero (bundle de `dist/ocastelblanco/browser/` subido a `ocastelblanco-cdn-production`
  **excluyendo `content/*`** — ver gotcha nuevo sobre `angular.json` abajo — config de
  behaviors de assets estáticos y cambio de origen redactados y verificados contra la API
  de AWS antes de aplicar, checklist de JSON-LD/`NG_ALLOWED_HOSTS` confirmado). El usuario
  autorizó la ejecución de forma explícita e inequívoca en el momento (`CLAUDE.md`).
  Aplicado via `update-distribution`: origen nuevo `Lambda-production-app` (custom origin,
  HTTPS-only, hacia la Function URL de `production`), `DefaultCacheBehavior.TargetOriginId`
  cambiado a ese origen (antes `S3-ocastelblanco.com`), 6 behaviors nuevos para assets
  estáticos con hash (`*.css`, `*.ico`, `*.js`, `*.png`, `*.webmanifest`, `*.xml`) →
  `S3-ocastelblanco-cdn-production` con `CachePolicyId` managed `CachingOptimized`. Los 4
  alias y `/content/*` no se tocaron.
  **Incidente durante el switch (resuelto en minutos):** el primer intento de
  `DefaultCacheBehavior` incluía `OriginRequestPolicyId` managed `AllViewer` (para
  garantizar que headers/cookies/querystrings llegaran a la Lambda) — esto reenvía el
  header `Host` **original del visitante** (`ocastelblanco.com`, o el dominio crudo de
  CloudFront) en vez de sustituirlo por el dominio del origen, que es el comportamiento
  por defecto de CloudFront para orígenes custom **sin** un origin request policy que
  incluya `Host`. El checklist previo del switch había verificado la suposición correcta
  (comportamiento por defecto) pero no contempló que agregar `AllViewer` la invalidaría.
  Consecuencia: `getAllowedHostsFromEnv()` de Angular (`@angular/ssr/node`) rechazaba la
  request con `403` porque el `Host` reenviado no matcheaba `NG_ALLOWED_HOSTS`
  (`*.lambda-url.us-east-1.on.aws`) — el 403 lo generaba la propia app, no CloudFront ni
  IAM, lo que inicialmente confundió el diagnóstico (los logs de CloudWatch mostraban
  invocaciones "exitosas" porque Angular respondía 403 sin lanzar una excepción).
  Diagnosticado comparando el `x-amzn-requestid` de la respuesta del cliente contra los
  `RequestId` en CloudWatch — no coincidían, revelando que hubo múltiples intentos y que
  el que llegó al cliente no era el que aparecía en el log más reciente. **Fix:**
  reemplazar `OriginRequestPolicyId` por el managed `AllViewerExceptHostHeader`
  (`b689b0a8-53d0-40ab-baf2-68738e2966ac`) — reenvía todo lo demás pero deja que
  CloudFront sustituya `Host` por el dominio del origen, como se había verificado
  originalmente. Aplicado, desplegado, invalidación de `/*` para limpiar las respuestas
  403 que habían quedado cacheadas por el `ErrorCachingMinTTL` de la distribución.
  **Verificado en vivo tras el fix:** `ocastelblanco.com`, `www.ocastelblanco.com` → `200`
  con el título del rediseño; `/proyectos`, `/lab`, `/contacto` → `200`; assets estáticos
  (`main-*.js`) servidos desde S3 (`x-cache: Miss from cloudfront`); `olivercastelblanco.com`
  y su `www` siguen redirigiendo con `301`; `api.ocastelblanco.com` sin cambios (distribución
  separada); 15 requests consecutivos a distintas rutas, todos `200`, sin repetición del 403.
  **Gotcha nuevo descubierto en la preparación:** `angular.json` copia
  `public/content/lab.dev.json` (fixture de dev) a **todos** los builds vía el glob de
  assets `**/*`, incluido `production` — se evitó subir ese archivo al bucket con
  `aws s3 sync --exclude "content/*"`, pero la causa de fondo (el glob de assets no
  distingue por configuración) sigue sin corregirse; candidato a limpieza futura, no
  bloqueante hoy.
- **Implementado 2026-08-05 — Headers de seguridad (OWASP A05, `CLAUDE.md` §6):**
  Response Headers Policy nueva `ocastelblanco-security-headers`
  (`f768cc69-b1ed-4827-917e-c5b3a61d8901`) asociada al behavior por defecto y a los 6
  behaviors de assets estáticos de `E1MX0LNEKZOG8H` — **no** a `/content/*` (JSON, no
  necesita CSP). Incluye `X-Content-Type-Options: nosniff`, `Referrer-Policy:
  strict-origin-when-cross-origin`, `Strict-Transport-Security` (`max-age=63072000`,
  `includeSubDomains`, `preload`), `X-Frame-Options: SAMEORIGIN` y
  `Content-Security-Policy`:
  ```
  default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';
  font-src 'self' https://fonts.gstatic.com; img-src 'self' data:;
  connect-src 'self' https://api.ocastelblanco.com; object-src 'none';
  base-uri 'self'; frame-ancestors 'self'; form-action 'self';
  upgrade-insecure-requests
  ```
  **Gap en el plan original, resuelto con una alternativa más rigurosa:** la tarea decía
  "probar en `preview` antes de aplicar en vivo" — pero `preview` no tiene CloudFront
  delante (es una Lambda Function URL cruda, ver ADR-013), así que no existe una Response
  Headers Policy que probar ahí. En su lugar: la CSP se aplicó primero como header
  **custom** `Content-Security-Policy-Report-Only` (en vez del campo dedicado
  `SecurityHeadersConfig.ContentSecurityPolicy`, que siempre enforce) junto con los demás
  headers ya en modo enforcing (no rompen nada por diseño). Verificado con
  `claude-in-chrome` contra el sitio en vivo: cero mensajes de consola tras recargar cada
  ruta (`/`, `/proyectos`, `/lab`, `/contacto`), ambas fuentes (`JetBrains Mono`, `Inter`)
  cargando `200` desde `fonts.gstatic.com`, el SVG de ruido (`data:`) cargando, JSON-LD
  presente (2 scripts `application/ld+json`) sin bloqueo — CSP no afecta ese `type`, es
  data no ejecutable. Con eso confirmado, se promovió la CSP a `SecurityHeadersConfig`
  (enforcing) y se quitó el header custom. Re-verificado en vivo tras la promoción: mismo
  resultado, cero errores de consola.
  **`style-src` requiere `'unsafe-inline'`:** el build de Angular inyecta CSS crítico vía
  `<style ng-app-id="ng">` inline en el HTML (confirmado en el `dist/` local antes de
  aplicar nada) — sin `'unsafe-inline'` esos estilos se habrían bloqueado. `script-src`
  **no** lo necesita: no hay `<script>` inline ejecutable en el sitio (los JSON-LD son
  `application/ld+json`, exentos de `script-src` por spec).
  **`x-powered-by: Express` pendiente**, no es un header de CloudFront — se resuelve con
  `app.disable('x-powered-by')` en `src/server.ts` (PR #31), que solo toma efecto en
  producción cuando ese PR se fusione y dispare `deploy-production`.

### ADR-013 — Flujo CI/CD por ambientes y renombrado de `master` a `main`

- **Fecha:** 2026-08-04
- **Estado:** Implementado por completo
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
- **Implementado 2026-08-04 (puntos 2-3 — workflow):** `.github/workflows/deploy.yml`
  reescrito con dos jobs. `deploy-preview` dispara por `pull_request`
  (`opened`/`synchronize`/`reopened`) contra la rama base vigente — hoy
  `pull_request.branches: [rediseno-2026]`, pendiente de actualizar a `main` en la tarea
  de renombrado. `deploy-production` dispara por `push` contra `main` — no existe
  todavía, así que este job no se ha ejecutado ni una sola vez; queda verificado por
  revisión de código (misma estructura que `deploy-preview`, `npm run build` sin
  `--configuration` y `--stage production`) hasta que la tarea de renombrado lo active de
  verdad. Se eliminó el trigger `push` sobre `feature/**` — todo cambio pasa por PR.
  Verificado en vivo: abrir el PR #27 disparó **solo** `deploy-preview` (evento
  `pull_request`, `deploy-production` quedó correctamente omitido por su condición
  `if: github.event_name == 'push'`); el deploy resultante respondió correctamente contra
  `preview-api.ocastelblanco.com`.
  **Pendiente real de esta implementación:** confirmar en la práctica que un merge a
  `main` sí dispara `deploy-production` y que el Lambda de producción queda con
  `LAB_PUBLISH_TOKEN` real — solo se puede probar una vez exista `main` (tarea de
  renombrado).
- **Implementado 2026-08-04 (punto 1 — renombrado):** `main` creada con
  `git push origin rediseno-2026:main` (no un `git branch -m`, para conservar
  `rediseno-2026` como referencia histórica intacta). Ese mismo push, por ser un `push` a
  `main`, disparó `deploy-production` **por primera vez** — confirmado exitoso
  (`Build & Deploy (production)` en verde, `deploy-preview` correctamente omitido) y
  `LAB_PUBLISH_TOKEN` de producción confirmado configurado (verificado que no está vacío,
  sin exponer el valor). Default branch del repositorio cambiado a `main`
  (`gh repo edit --default-branch main`). **Sin protecciones de rama que migrar**: ni
  `master` ni `rediseno-2026` tenían protección real de GitHub configurada — la
  "protección" siempre fue una convención de `CLAUDE.md`, no una regla de plataforma.
  `.github/workflows/deploy.yml` (`pull_request.branches`) y `.github/workflows/ci.yml`
  (push/pull_request) actualizados de `rediseno-2026`/`master` a `main`. `CLAUDE.md`
  actualizado: sección "Ramas protegidas" sin condicionales, `main` como única rama
  protegida. `master` y `rediseno-2026` no se borraron — quedan como referencia histórica
  sin protección activa.

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
| Origin Access Control | `ocastelblanco-cdn-production-oac` (`E31BG8XJQBYR7A`) | Creado el 2026-08-04. Único origen que puede leer `ocastelblanco-cdn-production` |
| Distribución `E1MX0LNEKZOG8H` — origen nuevo | `S3-ocastelblanco-cdn-production` → `ocastelblanco-cdn-production.s3.us-east-1.amazonaws.com` | Agregado el 2026-08-04 vía OAC. El origen original (`S3-ocastelblanco.com`) y el behavior por defecto (`/*`) **no se tocaron** |
| Distribución `E1MX0LNEKZOG8H` — behavior nuevo | `/content/*` → `S3-ocastelblanco-cdn-production`, `CachePolicyId` managed `CachingDisabled` (`4135ea2d-6df8-44a3-9df3-4b5a84be39ad`) | Agregado el 2026-08-04. Único behavior además del por defecto |
| CloudFront Function | `olivercastelblanco-redirect` (`arn:aws:cloudfront::696912647258:function/olivercastelblanco-redirect`) | Creada y publicada el 2026-08-04. Asociada al behavior por defecto de `E1MX0LNEKZOG8H`, evento `viewer-request` |
| Distribución `E1MX0LNEKZOG8H` — `CustomErrorResponses` | 403/404 → `/index.html` (200), `ErrorCachingMinTTL: 300` | Preexistente (sitio anterior, fallback de SPA) — descubierto al verificar la tarea de `/content/*`, ver ADR-012 gotcha |
| Distribución `E1MX0LNEKZOG8H` — origen por defecto (`/*`) | `Lambda-production-app` → Function URL de `production` (`mcbveoxamga7a3jmkfkqbqwble0ahapk.lambda-url.us-east-1.on.aws`), custom origin HTTPS-only | **EL SWITCH, ejecutado 2026-08-04.** Reemplaza a `S3-ocastelblanco.com` (sitio anterior) como origen por defecto. `CachePolicyId` managed `CachingDisabled`, `OriginRequestPolicyId` managed `AllViewerExceptHostHeader` (`b689b0a8-53d0-40ab-baf2-68738e2966ac` — **no** `AllViewer`, ver gotcha en §7) |
| Distribución `E1MX0LNEKZOG8H` — behaviors de assets estáticos | `*.css`, `*.ico`, `*.js`, `*.png`, `*.webmanifest`, `*.xml` → `S3-ocastelblanco-cdn-production`, `CachePolicyId` managed `CachingOptimized` | Agregados el 2026-08-04 (switch). El bucket también sirve `/content/*` (tarea anterior) |
| Bucket `ocastelblanco-cdn-production` — bundle Angular | `dist/ocastelblanco/browser/` subido el 2026-08-04, **excluyendo `content/*`** | Ver gotcha: `angular.json` copia el fixture de dev (`content/lab.dev.json`) a todos los builds |
| Response Headers Policy | `ocastelblanco-security-headers` (`f768cc69-b1ed-4827-917e-c5b3a61d8901`) | Creada el 2026-08-05. Asociada al behavior por defecto + 6 behaviors de assets estáticos de `E1MX0LNEKZOG8H` — **no** a `/content/*`. `nosniff`, `Referrer-Policy`, `HSTS`, `X-Frame-Options: SAMEORIGIN`, `CSP` (ver ADR-012) |

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
| Agregar un `CacheBehavior` nuevo a una distribución CloudFront no invalida lo que ya estaba cacheado bajo el behavior por defecto para ese mismo path | Si un path (ej. `/content/lab.json`) se pidió antes de que existiera su behavior específico, un edge POP puede seguir sirviendo la respuesta vieja durante su TTL. Correr `create-invalidation` sobre el path nuevo después de agregar el behavior, no asumir que el cambio de config invalida el caché existente. |
| `CustomErrorResponses` a nivel de distribución (403/404 → `/index.html`) se resuelven con su **propio** lookup de behavior para el `ResponsePagePath` | Si el `ResponsePagePath` no matchea el `PathPattern` del behavior original de la request, CloudFront lo sirve desde el behavior que sí matchea (típicamente el default) — no desde el origen que generó el error. Un objeto faltante en un behavior nuevo puede terminar devolviendo `200` con contenido de OTRO origen en vez de un `404` limpio. Revisar `CustomErrorResponses` de la distribución antes de asumir que "no existe el objeto" se traduce en un error visible. |
| ⚠️ Un `OriginRequestPolicyId` que reenvíe el header `Host` (ej. managed `AllViewer`) rompe orígenes custom que validan `Host` (Lambda Function URL + `NG_ALLOWED_HOSTS` de Angular, ALBs, APIs con Host-based routing) | Sin origin request policy que incluya `Host`, CloudFront sustituye automáticamente el `Host` del viewer por el dominio del origen antes de reenviarlo — es el comportamiento que hace funcionar `NG_ALLOWED_HOSTS` con un patrón fijo como `*.lambda-url.us-east-1.on.aws`. `AllViewer` reenvía el `Host` **original del visitante**, rompiendo esa validación con un `403` que la app genera internamente (no un error de CloudFront/IAM — los logs de CloudWatch muestran la invocación como "exitosa" porque no hubo excepción, solo una respuesta 403 legítima de la app). Si se necesita reenviar headers/cookies/querystrings a un origen así, usar el managed `AllViewerExceptHostHeader` (`b689b0a8-53d0-40ab-baf2-68738e2966ac`), nunca `AllViewer`. Diagnóstico: si CloudWatch muestra invocaciones normales pero el cliente recibe 403, comparar el `x-amzn-requestid` de la respuesta contra el `RequestId` más reciente en los logs — si no coinciden, hay respuestas cacheadas o de intentos distintos de por medio. |
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
| `docs/proceso/2026-08-mvp-en-produccion.md` | Bitácora del cierre del MVP: auditoría previa, secuencia de 8 pasos hacia el switch, incidente del header `Host` y gotchas de CloudFront/SES |
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

## 14. Sesión 2026-08-04 (continuación 4) — Ejecución de la Tarea: CloudFront sirve `/content/*`

**Qué se hizo:** implementado el paso 4 de la secuencia de §2, con **alcance reducido**
respecto al plan original tras detectar un riesgo real de romper el sitio en vivo (ver
ADR-012, revisión 2026-08-04).

- Antes de tocar la distribución en vivo, se confirmó con `curl` que el sitio anterior
  sirve `main.*.js`, `styles.*.css`, `runtime.*.js`, `polyfills.*.js` en la raíz con el
  mismo patrón de hash que usa Angular — un behavior amplio `*.js`/`*.css` habría
  interceptado y roto esos assets de inmediato. Se presentó el hallazgo al usuario, que
  aprobó acotar la tarea solo a `/content/*` (path que el sitio anterior no usa en
  absoluto) y posponer los behaviors de assets estáticos al switch (paso 8).
- Creada una Origin Access Control (`ocastelblanco-cdn-production-oac`,
  `E31BG8XJQBYR7A`) para el bucket `ocastelblanco-cdn-production`.
- Actualizada la distribución `E1MX0LNEKZOG8H` (`update-distribution` sobre la config
  obtenida primero de forma read-only, con `--if-match` del ETag correcto): se agregó un
  origen nuevo (`S3-ocastelblanco-cdn-production`, vía OAC) y un behavior nuevo
  (`/content/*` → ese origen, `CachePolicyId` managed `CachingDisabled`). El origen
  original, el behavior por defecto y los 4 alias quedaron sin ningún cambio.
- Bucket policy en `ocastelblanco-cdn-production`: `s3:GetObject` para el principal
  `cloudfront.amazonaws.com`, condicionado a `AWS:SourceArn` = ARN de esta distribución.
  Verificado que **no** cuenta como política pública: los 4 flags de
  `PublicAccessBlockConfiguration` siguen en `true` después de aplicarla — es el patrón
  documentado de AWS para OAC + bucket 100% privado.
- Verificado en vivo: `/content/lab.json` responde `200` vía
  `https://dskarpvm0nxbp.cloudfront.net/content/lab.json` con un objeto de prueba escrito
  directo a S3; acceso directo al bucket (sin pasar por CloudFront) devuelve `403`; el
  sitio anterior (`ocastelblanco.com/`, `main.*.js`, `styles.*.css`) respondió `200` sin
  ningún cambio antes y después del update. Objeto de prueba borrado al terminar.
- A diferencia de tareas anteriores, ninguno de los comandos AWS mutantes de esta tarea
  fue bloqueado por el clasificador de permisos (crear OAC, `update-distribution`,
  `put-bucket-policy`) — posiblemente porque la autorización explícita ya había quedado
  registrada en la decisión de acotar el alcance vía `AskUserQuestion`.
- Sin cambios en `serverless.yml` ni código de aplicación — toda la configuración vive en
  la distribución CloudFront, gestionada manualmente (ADR-012).

**Próxima tarea (Tarea 1 nueva):** CloudFront Function de 301 para
`olivercastelblanco.com` (paso 5 de la secuencia). **Tarea 2 nueva:** Nuevo flujo CI/CD —
PR abre `preview`, merge a `main` despliega `production` (paso 6, ADR-013).

## 15. Sesión 2026-08-04 (continuación 5) — Ejecución de la Tarea: CloudFront Function de 301

**Qué se hizo:** implementado el paso 5 de la secuencia de §2 (ADR-012).

- CloudFront Function `olivercastelblanco-redirect` (`cloudfront-js-2.0`): si
  `Host` es `olivercastelblanco.com` o `www.olivercastelblanco.com`, responde `301` hacia
  el mismo host equivalente bajo `ocastelblanco.com`, preservando path y querystring; para
  cualquier otro host, deja pasar la request sin modificarla.
- Probada con `aws cloudfront test-function` **antes** de publicarla o asociarla (3 casos:
  host secundario con path+querystring, `www.` secundario, host canónico) — los 3 pasaron
  exactamente como se esperaba.
- Publicada (`publish-function`) y asociada **solo** al behavior por defecto (`/*`) de
  `E1MX0LNEKZOG8H`, evento `viewer-request`. El origen, los behaviors existentes
  (`/content/*` de la tarea anterior) y los 4 alias no se tocaron.
- Verificado en vivo: `olivercastelblanco.com` y `www.olivercastelblanco.com` → `301`
  con `Location` correcto; `ocastelblanco.com` y `www.ocastelblanco.com` → `200` sin
  redirigir; `main.js` del sitio anterior sin cambios.
- **Hallazgo durante la verificación (no es una regresión):** al probar
  `/content/lab.json` sin el objeto de prueba (borrado al final de la tarea anterior), la
  respuesta fue `200` con el `index.html` del sitio anterior en vez de un `404`. Se
  investigó y se confirmó que la distribución ya tenía `CustomErrorResponses` (403/404 →
  `/index.html`, `200`) configurados desde el sitio anterior — un fallback de SPA
  preexistente. Como `/index.html` no matchea `/content/*`, CloudFront lo resuelve por el
  behavior por defecto (bucket viejo). Confirmado que con el objeto presente,
  `/content/lab.json` responde el JSON real correctamente — no hay regresión, es
  comportamiento preexistente que ahora queda documentado (ver ADR-012 y §7 Gotchas).
- Ningún comando AWS mutante de esta tarea fue bloqueado por el clasificador de permisos.
- Sin cambios en `serverless.yml` ni código de aplicación.

**Próxima tarea (Tarea 1 nueva):** Nuevo flujo CI/CD — PR abre `preview`, merge a `main`
despliega `production` (paso 6, ADR-013). **Tarea 2 nueva:** Renombrar `master` → `main`
y reemplazar su contenido con `rediseno-2026` (paso 7).

## 16. Sesión 2026-08-04 (continuación 6) — Ejecución de la Tarea: Nuevo flujo CI/CD

**Qué se hizo:** implementado el paso 6 de la secuencia de §2 (ADR-013).

- `.github/workflows/deploy.yml` reescrito con dos jobs: `deploy-preview` (trigger
  `pull_request`, `opened`/`synchronize`/`reopened`, contra `rediseno-2026`) y
  `deploy-production` (trigger `push` contra `main`). Se eliminó el trigger `push` sobre
  `feature/**` — todo cambio pasa por PR de ahora en adelante.
- `deploy-production` usa `npm run build` (config `production` por defecto) y
  `npx serverless deploy --stage production` — resuelve el pendiente de
  `LAB_PUBLISH_TOKEN` vacío en `production` (quedó así del primer deploy manual de la
  tarea de base multi-stage), inyectando el secret real de GitHub Actions.
- Verificado en vivo: abrir el PR #27 disparó **solo** `deploy-preview` (evento
  `pull_request`), `deploy-production` quedó correctamente omitido por su condición
  (`if: github.event_name == 'push'`). El deploy de preview resultante respondió
  correctamente contra `preview-api.ocastelblanco.com`.
- **Verificación pendiente, honesta:** `deploy-production` no se ha ejecutado ni una sola
  vez todavía — `main` no existe. Queda verificado solo por revisión de código (misma
  estructura que `deploy-preview`, config y stage correctos). La prueba real (¿dispara
  correctamente? ¿el Lambda de producción queda con el token real?) ocurre como parte de
  la siguiente tarea, cuando `main` empiece a existir.

**Próxima tarea (Tarea 1 nueva):** Renombrar `master` → `main` y reemplazar su contenido
con `rediseno-2026` (paso 7 de la secuencia). **Tarea 2 nueva:** EL SWITCH (paso 8) —
solo como preparación/planificación en el motor JIT; la ejecución real sigue requiriendo
autorización explícita del usuario en el momento (`CLAUDE.md`).

## 17. Sesión 2026-08-04 (continuación 7) — Ejecución de la Tarea: Renombrar `master` → `main`

**Qué se hizo:** implementado el paso 7 de la secuencia de §2 (ADR-013) — el penúltimo
antes del switch.

- Antes de ejecutar, se confirmó explícitamente con el usuario (vía `AskUserQuestion`) que
  crear `main` dispararía de inmediato el primer `deploy-production` real, como efecto
  secundario del push — el usuario autorizó ejecutar toda la secuencia sin pausas
  adicionales.
- `git push origin rediseno-2026:main` — creó `main` con el contenido de `rediseno-2026`
  sin renombrar la rama origen (se conserva `rediseno-2026` con su historial intacto).
  Ese push disparó `deploy-production` por primera vez: exitoso
  (`Build & Deploy (production)` en verde), `deploy-preview` correctamente omitido.
  `LAB_PUBLISH_TOKEN` de producción confirmado configurado (sin exponer el valor).
  Producción verificada sirviendo correctamente tras el redeploy.
- Default branch del repositorio cambiado a `main` (`gh repo edit --default-branch main`).
- **Hallazgo:** ni `master` ni `rediseno-2026` tenían protección de rama real en GitHub
  (`gh api .../branches/.../protection` → 404 en ambas). La "protección" documentada en
  `CLAUDE.md` siempre fue una convención de disciplina del agente, no una regla de
  plataforma — no hubo nada que migrar en ese frente.
  `.github/workflows/deploy.yml` (`pull_request.branches`) y `.github/workflows/ci.yml`
  (push/pull_request, antes apuntando a `master`+`rediseno-2026`) actualizados a `main`.
  `CLAUDE.md` §"Git Flow para Agentes IA" actualizado: `main` como única rama protegida,
  sin las notas condicionales del renombrado en curso.
- `master` y `rediseno-2026` no se borraron — quedan como referencia histórica sin
  protección activa.
- Cambios de `deploy.yml`/`ci.yml`/`CLAUDE.md` van en un PR aparte contra `main` (rama
  `feature/renombrar-main-cleanup`) — sirve además como la prueba en vivo de que
  `deploy-preview` dispara correctamente contra la nueva base.

**Próxima tarea (Tarea 1 nueva):** EL SWITCH (paso 8) — solo preparación/planificación en
el motor JIT; la ejecución real requiere autorización explícita del usuario en el momento
(`CLAUDE.md`). **Tarea 2 nueva:** evaluar el fetch SSR de `lab.json` (gap de SEO conocido
desde ADR-011, independiente del switch).

**Fuera del motor JIT — pedido puntual del usuario (2026-08-04):** el usuario preguntó si
podía borrar la rama `master` (sitio anterior). Se confirmó que era seguro: sin
protección real en GitHub, sin referencias en workflows ni infraestructura, y que el
rollback real del sitio en vivo depende del bucket S3 y de CloudFront (ADR-012), no de la
rama. Se recomendó archivar antes de borrar; el usuario eligió esa opción. Ejecutado:
`git tag archive/sitio-anterior origin/master` (verificado mismo SHA), push del tag,
`git push origin --delete master`, limpieza de la rama local. `CLAUDE.md` §"Ramas
protegidas" y `MEMORY.md` §1 actualizados para reflejar que `master` ya no existe como
rama — el código queda accesible permanentemente vía el tag.

## 18. Sesión 2026-08-04 (continuación 8) — EL SWITCH: ejecución y resultado

**Qué se hizo:** ejecutado el paso 8, último de la secuencia hacia producción
(`MEMORY.md` §2, ADR-012). El usuario autorizó explícitamente en el momento, tras
fusionar el PR #28 (renombrado `master` → `main`).

**Preparación (turno anterior, documentada ahora):**
- `dist/ocastelblanco/browser/` (28 archivos) subido a `ocastelblanco-cdn-production`
  con `aws s3 sync --exclude "content/*"` — la exclusión evitó que `content/lab.dev.json`
  (fixture de dev, presente en el bundle por un gap de `angular.json`, ver gotcha en §7)
  contaminara el prefijo `/content/*` reservado para el contenido real de The Lab.
- Config de la distribución redactada sin aplicar: nuevo origen custom hacia la Function
  URL de `production`, `DefaultCacheBehavior` apuntando ahí, 6 behaviors nuevos para
  assets estáticos con hash. IDs de cache/origin-request policies managed verificados
  contra la API de AWS antes de usarlos (no se confió en memoria).
- Checklist confirmado: JSON-LD `sameAs` correctos, `NG_ALLOWED_HOSTS` compatible con el
  comportamiento por defecto de CloudFront para orígenes custom.

**Ejecución:**
1. Config fresca de la distribución obtenida justo antes de aplicar (mismo ETag que la
   base del draft — nada había cambiado).
2. Primer intento de `update-distribution` falló: `MinTTL` no puede coexistir con
   `CachePolicyId` en la misma cache behavior (campos legacy sobrantes del
   `DefaultCacheBehavior` original). Corregido eliminando `MinTTL`/`DefaultTTL`/`MaxTTL`.
3. Segundo intento aceptado (`Status: InProgress`) y desplegado (~2 min).
4. **Verificación inicial reveló el sitio roto: `403` en todas las rutas**, incluida la
   URL cruda de CloudFront (no específico de un alias). CloudWatch mostraba la invocación
   Lambda como exitosa (sin excepción) — el diagnóstico se resolvió comparando el
   `x-amzn-requestid` de la respuesta del cliente contra el `RequestId` más reciente en
   los logs: no coincidían, revelando que la respuesta 403 no venía de esa invocación
   "exitosa" sino de otra distinta.
5. **Causa raíz:** el `OriginRequestPolicyId` managed `AllViewer` que se había usado
   (para forwardear headers/cookies/querystrings a la Lambda) reenvía también el header
   `Host` **original del visitante**, sobrescribiendo el comportamiento por defecto de
   CloudFront de sustituirlo por el dominio del origen. Angular
   (`getAllowedHostsFromEnv()`, `@angular/ssr/node`) rechazaba la request con `403`
   porque ese `Host` no matcheaba `NG_ALLOWED_HOSTS` (`*.lambda-url.us-east-1.on.aws`) —
   el 403 lo generaba la propia aplicación, no CloudFront ni un problema de permisos IAM.
   El checklist previo había verificado la suposición correcta sobre el comportamiento
   por defecto, pero no contempló que agregar `AllViewer` la invalidaría.
6. **Fix:** `OriginRequestPolicyId` cambiado al managed `AllViewerExceptHostHeader`
   (`b689b0a8-53d0-40ab-baf2-68738e2966ac`, verificado contra la API antes de usarlo) —
   reenvía todo lo demás pero deja que CloudFront sustituya `Host` por el dominio del
   origen. Aplicado, desplegado (~1 min), e invalidado `/*` para limpiar las respuestas
   403 que habían quedado cacheadas por el `ErrorCachingMinTTL` de la distribución.
7. **Verificación final, exhaustiva:** `ocastelblanco.com` y `www.` → `200` con el
   título del rediseño; `/proyectos`, `/lab`, `/contacto` → `200`; assets estáticos
   (`main-*.js`) servidos desde S3 (`x-cache: Miss from cloudfront`);
   `olivercastelblanco.com` y su `www` siguen redirigiendo (`301`); `api.ocastelblanco.com`
   sin cambios (distribución separada); 15 requests consecutivos a distintas rutas, todos
   `200`. Confirmado que el gotcha de `CustomErrorResponses` (403/404 → `/index.html`)
   persiste mismo que antes, ahora renderizando el rediseño en vez del sitio anterior —
   no bloqueante, comportamiento consistente con lo documentado en la tarea de `/content/*`.

**Tiempo total del incidente:** desde la primera verificación rota hasta la confirmación
final, resuelto en el mismo turno — no hubo ventana prolongada de sitio caído sin que se
estuviera trabajando activamente en el fix.

**Resultado:** `https://ocastelblanco.com` sirve el rediseño 2026 completo. La secuencia
de 8 pasos hacia el switch (`MEMORY.md` §2) queda **completa**. El objetivo del día
(reemplazar el sitio en vivo, definido por el usuario al inicio de la sesión) está
cumplido.

**Pendientes que sobreviven al switch (no bloqueantes, ver `MEMORY.md` §2 "Pendientes"):**
bitácora de proceso en `docs/proceso/` (ahora que el switch cerró la iteración mayor del
MVP, esta tarea se reincorpora con prioridad alta — regla 5 del motor JIT en `TODO.md`),
fetch SSR de `lab.json`, auto-respuesta SES, migrar CloudFront a IaC, limpiar el glob de
assets de `angular.json` para que `content/lab.dev.json` no llegue a builds que no son
`development`.

## 19. Sesión 2026-08-05 — Bitácora del MVP y hallazgo de headers de seguridad

**Antes de empezar — secreto hardcodeado interceptado:** el working tree local tenía un
cambio sin commitear en `serverless.yml` que ponía el valor real de `LAB_PUBLISH_TOKEN`
como fallback por defecto (`${env:LAB_PUBLISH_TOKEN, '<token real>'}`). El repositorio es
**público**; se verificó con `git log --all -S` que el token **nunca había sido
commiteado**, así que no hubo exposición. Revertido con `git restore` tras confirmarlo con
el usuario. Para desplegar en local sin tocar el archivo: `export LAB_PUBLISH_TOKEN=...`
en la shell antes de `sls deploy`.

**Qué se hizo:** completada la Tarea 1 del motor JIT — entrada de bitácora del MVP en
`docs/proceso/2026-08-mvp-en-produccion.md`.

- **Alcance ajustado respecto al plan:** el plan pedía cubrir "la narrativa completa"
  desde el boilerplate. Pero el boilerplate, la identidad visual y el i18n ya estaban
  documentados en las dos entradas de junio — reescribirlos habría duplicado contenido. La
  entrada cubre de los PRs #15 a #29 (el hueco sin documentar desde la última entrada) y
  enlaza a las anteriores en una sección "Entradas relacionadas".
- **Métricas verificadas, no estimadas:** el plan traía "28 PRs" como aproximación. Se
  consultó GitHub y el repo directamente: **29 PRs fusionados, 14 ADRs, 102 commits en
  `main`**. La entrada usa los valores reales.
- Contenido principal: la auditoría inicial y sus tres bugs latentes, la restricción de
  alias de CloudFront, la secuencia de 8 pasos con su lógica de ordenamiento, las
  ADR-012/013/014, el incidente del header `Host` con el detalle del diagnóstico, los
  cuatro puntos de decisión humana, y 8 gotchas técnicos reutilizables.
- `docs/proceso/README.md` actualizado con la entrada en el índice; enlaces internos
  verificados.

**Hallazgo de la sesión (reordena el motor JIT):** al recalcular prioridades se verificó
con `curl` que `https://ocastelblanco.com` **no devuelve ningún header de seguridad** —
ni `Content-Security-Policy`, ni `X-Content-Type-Options`, ni `Referrer-Policy`, ni
`Strict-Transport-Security` — pese a que `CLAUDE.md` §6 A05 los exige explícitamente.
Además expone `x-powered-by: Express`. El requisito existía desde antes, pero solo se
convirtió en un **gap OWASP activo en producción** con el switch del 2026-08-04, lo que
por las reglas del motor JIT lo vuelve **Prioridad 1** — por encima del fetch SSR de The
Lab (Prioridad 2, completa la feature Alta "SEO técnico").

Revisado también el roadmap de `PRD.md` §6: todos los items de prioridad Alta y Media
están completos salvo "Integración con Cloudinary" (Media), que queda por debajo de las
dos tareas activas.

**Próxima tarea (Tarea 1 nueva):** headers de seguridad en producción (OWASP A05) — con la
advertencia de calibrar la CSP contra Google Fonts y el JSON-LD, y de probarla en
`preview` antes de aplicarla en vivo. **Tarea 2:** fetch SSR de The Lab (sin cambios).

## 20. Sesión 2026-08-05 (continuación) — Headers de seguridad en producción

**Antes de empezar — secreto interceptado (segunda vez esta semana):** el working tree
local tenía un cambio sin commitear en `serverless.yml` con el valor real de
`LAB_PUBLISH_TOKEN` hardcodeado como fallback por defecto. Repo público. Verificado con
`git log --all -S` que nunca se había commiteado — sin exposición. Revertido con
`git restore` tras confirmar con el usuario. Ver también §19 (incidente idéntico, mismo
día anterior) — patrón a vigilar: revisar `git status`/`git diff` al inicio de cada
sesión antes de tocar nada, no asumir que el working tree local coincide con el último
commit.

**Qué se hizo:** implementada la Tarea 1 del motor JIT — OWASP A05, headers de seguridad
ausentes en producción.

- **Código** (`src/server.ts`): `app.disable('x-powered-by')`. Desplegado y verificado en
  `preview` (PR #31, abierto — el efecto en producción llega cuando se fusione).
- **Infraestructura** (CloudFront, sin cambios de código): Response Headers Policy nueva
  con los 4 headers exigidos por `CLAUDE.md` §6 A05 más `X-Frame-Options`. Detalle
  completo en ADR-012 (revisión 2026-08-05).
- **Investigación previa a escribir la CSP:** se auditaron todos los recursos externos
  reales del sitio antes de escribir una sola directiva — `grep` de dominios `https://`
  en todo `src/`+`public/`, inspección del `dist/` local para confirmar si Angular
  inlinea CSS crítico (sí, vía `<style ng-app-id="ng">`) y si el `@import` de Google
  Fonts se resuelve en build-time o runtime (en build-time: el CSS final referencia
  `fonts.gstatic.com` directo, `fonts.googleapis.com` nunca se solicita en el navegador).
  Este trabajo de auditoría fue lo que permitió escribir una CSP funcional al primer
  intento, en vez de iterar a ciegas contra fallos.
- **Gap real en el plan original:** pedía probar en `preview` antes de aplicar en vivo,
  pero `preview` no tiene CloudFront delante (Lambda Function URL cruda) — no hay
  Response Headers Policy que probar ahí. Se resolvió con una verificación más rigurosa:
  CSP primero en modo `Content-Security-Policy-Report-Only` sobre producción, verificada
  con `claude-in-chrome` (navegador real, no solo `curl`) — cero errores de consola en
  las 4 rutas, red confirmando que ambas fuentes cargan desde `fonts.gstatic.com` y el
  JSON-LD sigue presente. Recién con eso confirmado se promovió a enforcing, con una
  segunda verificación idéntica después.
- **Fricciones menores de la API de CloudFront** (todas resueltas en el momento):
  `create-response-headers-policy` no acepta un wrapper `ResponseHeadersPolicyConfig`
  (el archivo JSON *es* el config); el objeto `XSSProtection` que devuelve
  `get-response-headers-policy` viene vacío (`{}`) pero `update-` lo rechaza si no tiene
  todos los campos requeridos — hay que borrarlo si no se va a usar; `Comment` tiene un
  límite de longitud bajo (falla con un comentario descriptivo largo).

**Verificado (parcial — ver DoD):**
- [x] `curl -I` devuelve los 4 headers + `X-Frame-Options`
- [x] CSP no rompe fuentes ni JSON-LD (verificado con navegador real, dos veces)
- [ ] `x-powered-by` — pendiente de que el usuario fusione el PR #31
- [x] "Probado antes de producción" — logrado por una vía distinta a la literal del plan (ver gap arriba), documentado como tal
- [x] Documentado en `MEMORY.md`

**Próxima tarea (Tarea 1, sin cambios):** queda pendiente confirmar `x-powered-by` tras
fusionar el PR #31. **Tarea 2 (sin cambios):** fetch SSR de The Lab.
