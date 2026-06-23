# TODO.md — Motor JIT

> Este archivo contiene **siempre exactamente 2 tareas atómicas**, calculadas comparando
> `PRD.md` (objetivo del producto) con `MEMORY.md` (estado real del proyecto).
>
> **Cómo funciona el motor JIT:**
> 1. Al completar una tarea, muévela al "Historial de tareas completadas" con fecha.
> 2. Recalcula la siguiente tarea más prioritaria según:
>    - Prioridad 1: gaps de seguridad OWASP activos en producción (`CLAUDE.md` §6).
>    - Prioridad 2: features de prioridad **Alta** del roadmap (`PRD.md` §6 / `tech-specs.md` §11).
>    - Prioridad 3: features de prioridad **Media**.
> 3. Actualiza `MEMORY.md` (estado, ADRs si aplica) antes de escribir la nueva tarea.
> 4. Nunca dejar más de 2 tareas activas. No planificar un backlog grande.
> 5. **Documentación de proceso (`docs/proceso/`)**: si la tarea recién completada cierra
>    una **iteración mayor** del producto (cambio de versión "mayor" registrado en
>    `MEMORY.md` §1 — ej. Pre-MVP → MVP, o un hito completo del roadmap de `PRD.md` §6),
>    agrega como tarea de alta prioridad escribir la entrada correspondiente en
>    `docs/proceso/` siguiendo la convención de [`docs/proceso/README.md`](./docs/proceso/README.md).
>    Esta documentación es un insumo directo de "The Lab" y de la narrativa de
>    orquestación IA del sitio (`PRD.md` §2).

---

## Tarea 1 — [INFRA]: Deploy de producción — Lambda + CloudFront + S3

**Origen:** `MEMORY.md` §2 Pendientes y ADR-009 (fase 2). Hace el sitio rediseñado
accesible en `https://ocastelblanco.com` y completa el ciclo MVP.

**Archivos:** `serverless.yml` (stage `production`, configuración de dominio),
`.github/workflows/deploy.yml` (job de producción bajo condición `rediseno-2026`),
posible `cloudfront.yml` o recursos en `serverless.yml` para CloudFront + S3.

**Qué hacer:**
1. Agregar stage `production` en `serverless.yml`: mismo Lambda + URL pero con
   `domainName: ocastelblanco.com` (o vía CloudFront). `NG_ALLOWED_HOSTS` para el
   dominio de producción.
2. Provisionar distribución CloudFront con `ocastelblanco.com` como CNAME apuntando
   al Lambda, con certificado ACM en `us-east-1`.
3. Bucket S3 `cdn.ocastelblanco.com` para assets estáticos (`dist/ocastelblanco/browser/`)
   con CloudFront delante.
4. Actualizar `angular.json` / build config para que los assets apunten al CDN en producción.
5. Workflow: job `deploy-prod` que se dispara solo en push a `rediseno-2026`.
6. **Al entrar a producción:** eliminar `LAMBDA_URL_RE` de `src/lambda/contact-handler.mjs`.

**Definition of done:**
- [ ] `https://ocastelblanco.com` sirve el rediseño 2026 (Angular SSR via Lambda)
- [ ] Assets estáticos servidos desde `https://cdn.ocastelblanco.com` (CloudFront + S3)
- [ ] `NG_ALLOWED_HOSTS` incluye `ocastelblanco.com`
- [ ] CORS del contact handler restringido solo a `https://ocastelblanco.com`
- [ ] `npm run build` en verde con config de producción
- [ ] CI/CD deploy a `production` activo en GitHub Actions

---

## Tarea 2 — [DOCS]: Bitácora de proceso — Entrada MVP en `docs/proceso/`

**Origen:** `TODO.md` §1 regla 5 — al cerrar una iteración mayor (MVP completo tras deploy de
producción), se documenta el proceso en `docs/proceso/` siguiendo `docs/proceso/README.md`.
Esta entrada es insumo directo de "The Lab" y la narrativa de orquestación IA del sitio.

**Archivos:** `docs/proceso/` — nueva entrada en formato definido en
[`docs/proceso/README.md`](./docs/proceso/README.md) cubriendo la construcción del MVP
(boilerplate Angular 22 → SEO técnico, pasando por identidad visual, i18n, CI/CD, deploy).

**Qué hacer:**
1. Leer `docs/proceso/README.md` para la convención de nombrado y estructura.
2. Crear la entrada del MVP (puede ser un solo archivo o varios según convención),
   cubriendo: stack decision, rol de IA en cada fase, métricas (tiempo, tokens, PRs).
3. La entrada debe ser citable y servir como contenido para The Lab.

**Dependencia:** completar Tarea 1 (Deploy de producción) antes de escribir esta entrada,
ya que el deploy cierra el ciclo MVP.

**Definition of done:**
- [ ] Entrada en `docs/proceso/` siguiendo la convención de `docs/proceso/README.md`
- [ ] Cubre la narrativa completa del MVP: decisiones de diseño, rol de IA, métricas
- [ ] Contenido citable directamente en The Lab

---

## Historial de tareas completadas

### 2026-06-22 — [FEATURE]: SEO técnico básico (JSON-LD + meta tags + sitemap)

`SeoService` (`providedIn: 'root'`) en `src/app/core/seo/seo.service.ts`: inyecta `Meta` y
`Title` de `@angular/platform-browser`, expone `update(title, description)` que actualiza
`<title>`, `og:title`, `og:description`, `twitter:title` y `twitter:description` por ruta.
JSON-LD `Person` (nombre, jobTitle, url, sameAs GitHub/LinkedIn) y `WebSite` (name, url)
inyectados en `<head>` vía `inject(DOCUMENT)` en el constructor de `AppComponent` — SSR-safe,
aparecen en el HTML pre-renderizado. Meta tags base Open Graph y Twitter Card añadidos a
`src/index.html` (description, og:type/url/site_name/image, twitter:card/image). `SeoService`
invocado en `ngOnInit` de los 6 componentes de página (Home, Proyectos, ConectaTech, LeTiende,
Lab, Contacto) con título y description únicos por ruta. `public/sitemap.xml` estático con
las 6 rutas pre-renderizadas y `<lastmod>2026-06-22`. `npm run build` en verde (6 rutas
pre-renderizadas); meta tags y JSON-LD verificados con `grep` en el HTML SSR.

### 2026-06-19 — [FEATURE]: Endpoint backend Terminal de contacto

Lambda handler `src/lambda/contact-handler.mjs` con validación server-side (nombre ≥2
chars, email RFC válido, mensaje ≥10 chars), honeypot anti-spam (campo `website` oculto),
log a CloudWatch. CORS dinámico en handler: permite `https://ocastelblanco.com` (producción)
y `*.lambda-url.us-east-1.on.aws` (preview). `serverless.yml`: función Lambda `contact`
con `httpApi` events (`POST` y `OPTIONS /contact`), `serverless-domain-manager` v10 con
`api.ocastelblanco.com` como dominio personalizado regional (Route 53 + ACM `*.ocastelblanco.com`).
Angular: `provideHttpClient(withFetch())` en `app.config.ts`, `ContactService`, `submit()`
usa HTTP real con signals `loading`/`sendError`. i18n: claves `sending` y `error_send`.
`environment.ts` apunta a `https://api.ocastelblanco.com`. `npm run build` en verde.
PR #15 fusionada. **Pendiente para producción:** eliminar `LAMBDA_URL_RE` del handler.

### 2026-06-19 — [FEATURE]: The Lab — Micro-blogging técnico (listado estático)

Componente standalone `src/app/features/lab/` con listado de 3 entradas estáticas
(Angular 22, Prompt Engineering, Cloud Economics — temas de `docs/arquitectura §5`).
Tarjetas con borde izquierdo Electric Cyan, tag en cyan, snippet en variante, fecha
alineada a la derecha. i18n completo en 15 claves bajo namespace `lab` en `i18n.types.ts`
y ambos diccionarios (es-CO / en-US). Títulos con `<em>` renderizados vía `[innerHTML]`
(contenido de diccionarios propios — seguro). Ruta `lab` registrada con `loadComponent`
en `app.routes.ts`. Build en verde, 6 rutas pre-renderizadas. PR #14 fusionada.

### 2026-06-18 — [FEATURE]: Despliegue CI/CD a AWS Lambda (stage `preview`)

`serverless.yml` (Serverless Framework v4, `nodejs24.x`, `us-east-1`, Lambda Function URL,
`memorySize: 512`, `timeout: 15s`). `lambda-handler.mjs` (raíz): importa `app` de Express
compilado desde `dist/ocastelblanco/server/server.mjs` y lo wrappea con
`@vendia/serverless-express`. `src/server.ts`: añadido `export { app }` para el handler.
`.github/workflows/deploy.yml`: deploy a stage `preview` en cada push a feature branches y
`rediseno-2026`; URL del Lambda impresa en Step Summary. `.gitignore`: añadidos
`.serverless/` y `.esbuild/`. `npm run build` en verde localmente. Requiere secrets
`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` y `SERVERLESS_LICENSE_KEY` en GitHub Actions
(configurados). `NG_ALLOWED_HOSTS: '*.lambda-url.us-east-1.on.aws'` añadido para que
`AngularNodeAppEngine` acepte el dominio de la Lambda Function URL (seguridad de host). PR
#13 fusionada.

### 2026-06-18 — [FEATURE]: Terminal de contacto

Componente standalone `src/app/features/contacto/` con Angular Reactive Forms, validación
client-side (campos requeridos, `Validators.email`, `Validators.minLength`), estética
terminal/CLI (inputs con `border-bottom` único, fondo transparente, JetBrains Mono, botón
de submit en `--color-primary-container`). Estado de éxito mock con `signal<boolean>` +
bloque `@if (sent())`. Ruta `contacto` registrada con `loadComponent` en `app.routes.ts`.
Claves i18n `contacto.*` (15 claves: labels, placeholders, errores, success state) en ambos
diccionarios. `npm run build` y `npm run lint` en verde. PR #12 fusionada.

### 2026-06-18 — [FEATURE]: Página de detalle — Le Tiende — Comandante

Componente standalone `src/app/features/proyectos/le-tiende/` con hero Metric-First
(`$0.50/mes` en Electric Cyan), secciones Desafío / Enfoque / Impacto y footer de stack.
Acento de borde izquierdo en Electric Cyan (diferenciado de ConectaTech en Cyber Lime).
Ruta lazy `proyectos/le-tiende` registrada en `app.routes.ts`. Enlace "Ver caso →" añadido
a la card Le Tiende en el Registro de Proyectos. Claves i18n `lt_challenge`, `lt_approach`,
`lt_impact_1/2` en tipos y diccionarios. `npm run build` y `npm run lint` en verde.
PR #11 fusionada.

### 2026-06-17 — [FEATURE]: Página de detalle — Caso de Estudio ConectaTech

Componente standalone `src/app/features/proyectos/conectatech/` con hero Metric-First
(`-80%` en Cyber Lime), secciones Desafío / Enfoque / Impacto y footer de stack (Electric
Cyan). Ruta lazy `proyectos/conectatech` registrada en `app.routes.ts`. Enlace "Ver caso →"
añadido a la card ConectaTech en el Registro de Proyectos. Claves i18n compartidas para
páginas de detalle (`back`, `view_case`, etiquetas de sección) en ambos diccionarios. `npm
run build` y `npm run lint` en verde. PR #10 fusionada.

### 2026-06-17 — [FEATURE]: Registro de Proyectos (Project Registry)

Componente standalone `src/app/features/proyectos/` con grid de dos tarjetas Metric-First:
ConectaTech (-80% staff requirements, borde Cyber Lime) y Le Tiende — Comandante
($0.50/mo OPEX). Métricas en Cyber Lime, stack en Electric Cyan, acento de borde izquierdo
por tarjeta. Layout horizontal 2 columnas en desktop, apilado en ≤720px. Diccionarios
`es-CO` y `en-US` ampliados con namespace `proyectos` (12 claves). Ruta `proyectos`
registrada con `loadComponent`. Título `index.html` corregido a "Oliver Castelblanco".
`npm run build` y `npm run lint` en verde. PR #9 fusionada.

### 2026-06-17 — [FEATURE]: Home — "El Manifiesto del Fixer"

Componente standalone `src/app/features/home/` con hero (headline en dos partes: marca
"The Fixer:" en Cyber Lime hardcodeada + resto traducido) y tres pilares de valor
(Efficiency / Architecture / Design) como cards con tokens del design system. Ruta `''`
registrada con `loadComponent` (lazy) en `app.routes.ts`. Soporte de etiquetas básicas de
formato (`<em>`, `<strong>`) en strings de traducción vía `[innerHTML]` con sanitización
automática de Angular (sin `bypassSecurityTrustHtml` — contenido proviene de nuestros
propios diccionarios TypeScript, no de input de usuario). Diccionarios `es-CO` y `en-US`
ampliados con namespace `home` (8 claves tipadas). `npm run build`, `npm run lint` y
verificación visual en verde. PR #8 fusionada.

### 2026-06-13 — [FEATURE]: Internacionalización (i18n) — es-CO / en-US con cambio inmediato

`TranslationService` propio basado en Signals (`src/app/core/i18n/`): diccionarios
TypeScript tipados para `es-CO` y `en-US`, detección inicial desde `localStorage` →
`navigator.language` → `'en-US'` (SSR-seguro). Componente standalone `LangSwitcher`
(`src/app/shared/shell/lang-switcher/`) con dropdown en esquina superior derecha del topbar,
diseñado con los tokens del design system (JetBrains Mono, `--radius: 0px`, paleta oscura
+ Cyber Lime para activo). `Topbar` y `Sidebar` inyectan `TranslationService`; sus
plantillas usan `trans.t('key')` que se re-evalúan automáticamente al cambiar el signal
`currentLocale`. Cambio de idioma es inmediato (sin recarga), persiste en `localStorage` y
actualiza `document.documentElement.lang`. `npm run build` y `npm test` en verde.
`MEMORY.md` actualizado (ADR-008).

### 2026-06-13 — [FIX]: Identidad visual corporativa — Fix de paths sin relleno y regeneración de bitmaps

El usuario corrigió por su cuenta los SVG de `brand/` (dos paths de las letras "OC" sin
`fill`). A partir de `brand/OC_logo_fondo.svg` corregido (optimizado con `svgo`, -28.1%)
se regeneraron solo los binarios del kit (`brand/kit/*.png`, `favicon.ico`,
`icon-512.webp`) sin tocar SVG/MD/HTML, y se actualizaron los favicons en `public/`.
`npm run build` verificado en verde. `MEMORY.md` actualizado (ADR-007, nueva revisión).

### 2026-06-12 — [FIX]: Identidad visual corporativa — Variantes monocromáticas (icon/logo-full mono black/white)

El usuario proporcionó `brand/OC_logo_alpha.svg` (emblema "OC" sin fondo) para regenerar
`brand/kit/icon-mono-black.svg`, `icon-mono-white.svg`, `logo-full-mono-black.svg` y
`logo-full-mono-white.svg`, que antes conservaban los colores originales. Regenerados
reemplazando todos los `fill:#XXXXXX`/`stroke:#XXXXXX` por `#000000` o `#ffffff` y
optimizando con `svgo` (-30.7%). `npm run build` verificado en verde. `MEMORY.md`
actualizado (ADR-007, nueva revisión).

### 2026-06-12 — [FIX]: Identidad visual corporativa — Logo maestro (segunda corrección: fondo + loader animado por gradientes)

El usuario tampoco aceptó el kit anterior (sin fondo) y proporcionó un nuevo master,
`brand/OC_logo_fondo.svg` (emblema "OC" + `<circle>` de fondo + 4 `<linearGradient>`
`_Linear0.._Linear3`), reemplazando a `brand/OC_logo.svg` (eliminado). Optimizado con
`svgo` (-28.3%) y regenerado el kit completo (24 archivos en `brand/kit/`) vía el mismo
script `exportBrandKit` por `node`. `brand/isotype.svg` = copia del SVG con fondo
optimizado. Favicons en `public/` regenerados y verificados legibles a 16/32px. Nuevo
`brand/loader.svg`: 4 copias del `<circle>` de fondo, cada una con un `<linearGradient>`
distinto (`_Linear0.._Linear3`) y `<animate>` de `opacity` con `calcMode="linear"` para
crossfade continuo entre los 4 gradientes (0.5s por transición, ciclo 2s,
`repeatCount="indefinite"`); el grupo "forma" queda fijo encima. `npm run build`
verificado en verde. `MEMORY.md` actualizado (ADR-007, nueva revisión).

### 2026-06-12 — [FEATURE]: Identidad visual corporativa — Logo maestro (Fase 1: LogoLoom)

MCP `logoloom` configurado en `.mcp.json` y usado para procesar el logo. Diseñado el
monograma "OC" (anillo cuadrado blanco + bracket Cyber Lime + acento Electric Cyan) sobre
Deep Charcoal, validado con el usuario entre 3 conceptos. Generados: `brand/isotype.svg`
(+ `isotype-light.svg`), `brand/logo-full.svg` (wordmark "OLIVER CASTELBLANCO" / "THE FIXER"
convertido a paths con `text_to_path`), `brand/favicon-mark.svg` y `brand/loader.svg`
(progress loader animado con `animateMotion`). Exportado kit completo de 25 archivos a
`brand/kit/` con `export_brand_kit` (PNG 16-1024px, ICO, WebP, OG images, `BRAND.md`).
Favicons aplicados en `public/` (favicon.ico, favicon-16x16, favicon-32x32,
apple-touch-icon, android-chrome-192/512) y enlaces + `site.webmanifest` actualizados en
`src/index.html`. `npm run build` verificado en verde dos veces. `MEMORY.md` actualizado
(ADR-007) con el paso manual pendiente de Taskade.

### 2026-06-12 — [FIX]: Identidad visual corporativa — Logo maestro (corrección con diseño del usuario)

El usuario rechazó el concepto "Monograma OC" anterior y proporcionó su propio logo
maestro (`brand/OC_logo.svg`, emblema circular "OC" con motivo de circuito impreso).
Eliminados todos los archivos previos de `brand/` excepto `OC_logo.svg`. Optimizado con
`svgo` (-31.8%) y exportado el kit completo (24 archivos) a `brand/kit/` invocando
`exportBrandKit` de `@mcpware/logoloom` directamente desde `node` (el SVG de 92KB excede
el límite de parámetros MCP). `brand/isotype.svg` = copia del logo maestro.
`brand/loader.svg` nuevo (anillo + "OC" con pulso + arco cian rotatorio). Favicons en
`public/` regenerados desde `brand/kit/icon-*.png`, legibles incluso a 32px. `npm run
build` verificado en verde. `MEMORY.md` actualizado (ADR-007, nota de revisión).

### 2026-06-11 — [FEATURE]: Generar el boilerplate Angular 22 (standalone, signals, zoneless, SSR)

Generado con `npx -y @angular/cli@22 new` (Angular 22.0.0). `npm run build` y `npm start`
funcionan sin errores. Path aliases (`@core/*`, `@shared/*`, `@features/*`, `@env/*`)
configurados en `tsconfig.json` sin `baseUrl` (rutas relativas con `./`). Carpetas
`src/app/core`, `src/app/shared`, `src/app/features` y `src/environments/*` creadas.
`MEMORY.md` actualizado (§1, §2, §4, §6, §7, §9).

### 2026-06-11 — [FEATURE]: Implementar los design tokens del Design System en SCSS

Creados `src/styles/_tokens.scss` (colores y spacing de `DESIGN.md` como custom
properties), `src/styles/_typography.scss` (mixins JetBrains Mono / Inter) y actualizado
`src/styles.scss` (border-radius 0 global, fondo oscuro con textura de ruido). `npm run
build` confirma compilación correcta (CSS inicial pasó de 96 B a ~3.8 kB). `MEMORY.md`
actualizado (§2, §6, §9).

### 2026-06-12 — [FEATURE]: Shell de navegación (sidebar + topbar)

Creados los componentes standalone `Sidebar` y `Topbar` en `src/app/shared/shell/`,
integrados en `src/app/app.html` envolviendo el `<router-outlet>`. La sidebar (56px,
expandible a 220px en hover) enlaza a `/`, `/proyectos`, `/lab` y `/contacto` (PRD §5) con
`RouterLink`/`RouterLinkActive`. `npm run build` y `npm test -- --watch=false` (4/4) sin
errores; verificado visualmente con `npm start`. `MEMORY.md` actualizado (§2, §6, §9).

### 2026-06-12 — [FEATURE]: Shell de navegación responsive (sidebar → barra inferior en móvil)

En viewports `≤720px` la `Sidebar` se convierte en una barra de navegación inferior fija
(56px de alto, iconos + etiquetas apiladas); `Topbar` y `.app-content` ajustan sus
márgenes/padding. Documentado como requisito no funcional en `PRD.md` §8 y como ADR-005 en
`MEMORY.md`. `npm run build` y `npm test -- --watch=false` (4/4) sin errores.

### 2026-06-12 — [FEATURE]: CI con GitHub Actions (lint + build + test)

Creado `.github/workflows/ci.yml`, ejecutado en `push`/`pull_request` sobre `master` y
`rediseno-2026`: Node 22 + cache npm → `npm ci` → `npm run lint` → `npm run build` → `npm
test -- --watch=false`. Se instaló `@angular-eslint/schematics` (genera `eslint.config.js`
y agrega el builder `lint` a `angular.json`). Sin pasos de despliegue. `npm run lint`,
`npm run build` y `npm test -- --watch=false` verificados localmente en verde. `MEMORY.md`
actualizado (§1, §2, §3 ADR-006, §4, §6, §8, §9).

## Log del motor JIT

| Fecha | Comparación PRD vs. MEMORY | Resultado |
|---|---|---|
| 2026-06-11 | No existe código de aplicación; máxima prioridad Alta es el boilerplate Angular 22 (base para todo lo demás), seguida por los design tokens (requeridos por toda UI futura) | Se seleccionan las Tareas 1 y 2 de este archivo. Tarea 2 depende de que exista el workspace generado en la Tarea 1. |
| 2026-06-11 | Boilerplate Angular 22 completado y verificado (build + start OK). Siguiente prioridad Alta sin completar: design tokens SCSS (requeridos por toda UI), seguido por el shell de navegación (depende del boilerplate, ya listo) | Tarea 1 (boilerplate) movida al historial. Tarea 2 (design tokens) pasa a ser Tarea 1. Nueva Tarea 2: shell de navegación (sidebar + topbar) |
| 2026-06-11 | Design tokens completados y verificados (build OK). Siguiente prioridad Alta: shell de navegación (depende del boilerplate, ya listo, no de la otra tarea activa). Para la segunda tarea, se evita elegir algo que dependa del shell (aún no completado); CI con GitHub Actions ya tiene su dependencia ("build/test local") satisfecha y es de prioridad Media-Alta para mantener la calidad del repo | Tarea 1 (design tokens) movida al historial. Tarea 2 (shell de navegación) pasa a ser Tarea 1. Nueva Tarea 2: CI con GitHub Actions (build + test) |
| 2026-06-12 | Shell de navegación completado y verificado (build + test + visual OK). Siguiente prioridad: CI con GitHub Actions (ya seleccionada como Tarea 2, sin dependencias pendientes) pasa a Tarea 1. Para la nueva Tarea 2 se prioriza Home ("El Manifiesto del Fixer", prioridad Alta del roadmap), que ya puede construirse dentro del shell recién completado | Tarea 1 (shell de navegación) movida al historial. Tarea 2 (CI) pasa a ser Tarea 1. Nueva Tarea 2: Home — "El Manifiesto del Fixer" |
| 2026-06-12 | CI con GitHub Actions completado y verificado (lint + build + test en verde). Siguiente prioridad Alta: Home ("El Manifiesto del Fixer", ya seleccionada como Tarea 2, sin dependencias pendientes) pasa a Tarea 1. Para la nueva Tarea 2 se prioriza Registro de Proyectos (PRD §5.2, prioridad Alta del MVP), que no depende de Home y ya tiene contenido fuente en `docs/arquitectura/arquitectura_ocastelblanco.md` §2-3 | Tarea 1 (CI) movida al historial. Tarea 2 (Home) pasa a ser Tarea 1. Nueva Tarea 2: Registro de Proyectos (Project Registry) |
| 2026-06-12 | El usuario solicita anteponer una nueva iniciativa fuera del roadmap normal: identidad visual corporativa (logo maestro, isotipo, favicons, loader animado) vía LogoLoom (Fase 1, local/MCP) + Taskade (Fase 2, manual/externo, fuera de este motor JIT). Es insumo directo para favicons y branding de toda la UI, por lo que se antepone a las tareas en curso. Para mantener exactamente 2 tareas activas, "Registro de Proyectos" se retira temporalmente de la lista activa (no se pierde: sigue siendo prioridad Alta del roadmap, documentada en `PRD.md` §5.2, y se reincorporará como Tarea 2 en cuanto se libere un slot) | Nueva Tarea 1: Identidad visual corporativa — Logo maestro (LogoLoom). Tarea 1 anterior (Home) pasa a ser Tarea 2. "Registro de Proyectos" queda fuera de la lista activa, pendiente de reincorporación |
| 2026-06-12 | Identidad visual (Fase 1 LogoLoom) completada y verificada (`npm run build` en verde, favicons aplicados). Siguiente prioridad Alta: Home ("El Manifiesto del Fixer") ya estaba seleccionada como Tarea 2 sin dependencias pendientes, pasa a Tarea 1. "Registro de Proyectos" (retirado temporalmente en la entrada anterior) no tiene dependencias bloqueantes y recupera su lugar como Tarea 2 | Tarea 1 (Logo maestro) movida al historial. Tarea 2 (Home) pasa a ser Tarea 1. Nueva Tarea 2: Registro de Proyectos (Project Registry) |
| 2026-06-13 | El usuario solicita añadir i18n (es-CO / en-US) con cambio inmediato antes de continuar con el roadmap normal. Se descarta `@angular/localize` (builds separados, sin cambio en caliente) y librerías externas (peso innecesario para 2 idiomas). Se implementa `TranslationService` propio con Signals, `LangSwitcher` en topbar y traducciones en `Topbar` + `Sidebar`. Las tareas activas (Home y Registro de Proyectos) no se ven afectadas | Tarea completada fuera del motor JIT. Tareas 1 y 2 (Home y Registro de Proyectos) permanecen sin cambios como próximas prioridades |
| 2026-06-12 | El usuario rechazó dos veces el resultado de la identidad visual y la corrigió iterativamente con sus propios masters (`OC_logo.svg` → `OC_logo_fondo.svg` + loader animado por gradientes → variantes mono desde `OC_logo_alpha.svg`), ya documentado como historial de tareas [FIX] adicionales fuera del motor JIT. PR #4 fue aprobada, fusionada a `rediseno-2026` y la rama `feature/identidad-visual-logo` eliminada en remoto y local. Esta iniciativa queda completamente cerrada. Las Tareas 1 (Home) y 2 (Registro de Proyectos) no dependían de ella y no requieren cambios | Sin cambios en las tareas activas: Tarea 1 sigue siendo Home — "El Manifiesto del Fixer", Tarea 2 sigue siendo Registro de Proyectos (Project Registry) |
| 2026-06-17 | Home completada y verificada (build + lint + visual OK, PR #8 fusionada). Siguiente prioridad Alta: Registro de Proyectos (ya seleccionada como Tarea 2, sin dependencias pendientes) pasa a Tarea 1. Para la nueva Tarea 2 se prioriza la página de detalle del primer caso de estudio (ConectaTech), que completa el requisito del MVP "1 Caso de Estudio" y no depende de la Tarea 1 | Tarea 1 (Home) movida al historial. Tarea 2 (Registro de Proyectos) pasa a ser Tarea 1. Nueva Tarea 2: Página de detalle — Caso de Estudio ConectaTech |
| 2026-06-17 | Registro de Proyectos completado y verificado (build + lint + visual OK, PR #9 fusionada). Siguiente prioridad Alta: ConectaTech detail page (ya seleccionada como Tarea 2, sin dependencias) pasa a Tarea 1. Para la nueva Tarea 2 se prioriza Le Tiende detail page — cierra el ciclo de los dos casos de estudio del Registro y no depende de Tarea 1 | Tarea 1 (Registro de Proyectos) movida al historial. Tarea 2 (ConectaTech) pasa a ser Tarea 1. Nueva Tarea 2: Página de detalle — Le Tiende — Comandante |
| 2026-06-17 | ConectaTech detail page completada y verificada (build + lint OK, PR #10 fusionada). Siguiente prioridad Alta: Le Tiende detail page (ya seleccionada como Tarea 2, sin dependencias) pasa a Tarea 1. Para la nueva Tarea 2 se prioriza Terminal de contacto — CTA principal del portafolio, prioridad Alta del MVP, sin dependencias bloqueantes | Tarea 1 (ConectaTech) movida al historial. Tarea 2 (Le Tiende) pasa a ser Tarea 1. Nueva Tarea 2: Terminal de contacto |
| 2026-06-18 | Le Tiende detail page completada y verificada (build + lint OK, PR #11 fusionada). Siguiente prioridad Alta: Terminal de contacto (ya seleccionada como Tarea 2, sin dependencias) pasa a Tarea 1. Para la nueva Tarea 2 se prioriza The Lab — sección de autoridad técnica y SEO, prioridad Media-Alta del roadmap, sin dependencias bloqueantes | Tarea 1 (Le Tiende) movida al historial. Tarea 2 (Terminal de contacto) pasa a ser Tarea 1. Nueva Tarea 2: The Lab — Micro-blogging técnico |
| 2026-06-20 | El usuario solicita anticipar SEO técnico básico (Tarea 2) sobre el deploy de producción (Tarea 1). SEO no depende del deploy y puede completarse en el stage actual. Deploy de producción pasa a Tarea 2 sin cambios en su descripción; se añade el recordatorio de eliminar LAMBDA_URL_RE del contact handler al hacer el deploy. | Tarea 1 (Deploy producción) pasa a Tarea 2. Tarea 2 (SEO técnico) pasa a Tarea 1 |
| 2026-06-22 | SEO técnico básico completado y verificado (build verde, meta tags y JSON-LD confirmados en HTML SSR, sitemap.xml generado). Siguiente prioridad: Deploy de producción (era Tarea 2, sin dependencias bloqueantes) pasa a Tarea 1. Para la nueva Tarea 2 se activa la entrada de bitácora de proceso en `docs/proceso/` — el deploy cierra el ciclo MVP y esa entrada es insumo directo de The Lab | Tarea 1 (SEO técnico) movida al historial. Tarea 2 (Deploy producción) pasa a ser Tarea 1. Nueva Tarea 2: Bitácora de proceso — Entrada MVP |
| 2026-06-19 | Endpoint backend Terminal de contacto completado y verificado (build en verde, PR #15 abierta). Siguiente prioridad: Deploy de producción (ya seleccionada como Tarea 2, sin dependencias bloqueantes) pasa a Tarea 1. Para la nueva Tarea 2 se prioriza SEO técnico (JSON-LD + meta tags + sitemap) — objetivo de PRD §4 "SEO técnico y para IA", independiente del deploy y sin dependencias bloqueantes | Tarea 1 (endpoint backend) movida al historial. Tarea 2 (Deploy producción) pasa a ser Tarea 1. Nueva Tarea 2: SEO técnico básico |
| 2026-06-18 | El usuario solicitó anteponer el despliegue a AWS Lambda (CI/CD con preview URL por push) para poder validar avances remotamente antes de aprobar PRs. Terminal de contacto completada y movida al historial (PR #12 fusionada). Deploy Lambda implementado y en PR. Para mantener 2 tareas activas: The Lab pasa a Tarea 1 (era Tarea 2, sin cambios). Nueva Tarea 2: endpoint backend de la Terminal de contacto (OWASP A07: no desplegar sin rate limiting) | Tarea 1 (Terminal de contacto) movida al historial. Deploy Lambda (antepuesta) movida al historial. Tarea 2 (The Lab) pasa a ser Tarea 1. Nueva Tarea 2: Endpoint backend Terminal de contacto |
