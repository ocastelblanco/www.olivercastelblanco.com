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

## Tarea 1 — [FEATURE]: Página de detalle — Caso de Estudio ConectaTech

**Origen:** `PRD.md` §5.2 y §6 (Roadmap, prioridad Alta: "1 Caso de Estudio" como parte
del MVP. Registro de Proyectos ya completado).

**Archivos:** `src/app/features/proyectos/conectatech/*` (componente standalone `Conectatech`),
`src/app/app.routes.ts` (ruta `proyectos/conectatech`).

**Qué hacer:**
1. Crear el componente standalone `Conectatech` en
   `src/app/features/proyectos/conectatech/`.
2. Implementar la página de detalle del caso de estudio usando el contenido de
   `docs/arquitectura/arquitectura_ocastelblanco.md` §2: narrativa "The Orchestrator",
   problema, solución, métrica de impacto ("MVP en 4 semanas; -80% requerimientos de staff")
   y stack (Angular 21, Moodle 5.1, AWS, IA-Augmented Code).
3. Registrar la ruta `proyectos/conectatech` en `src/app/app.routes.ts` con `loadComponent`.
4. Desde la card de ConectaTech en el Registro de Proyectos (Tarea 1), agregar un enlace a
   esta ruta.
5. Verificar visualmente con `npm start` dentro del shell, en desktop y móvil.

**Definition of done:**
- [ ] Existe `src/app/features/proyectos/conectatech` como componente standalone con la
      narrativa, métricas y stack del caso
- [ ] `app.routes.ts` registra la ruta `proyectos/conectatech` → `Conectatech`
- [ ] La card de ConectaTech en el Registro enlaza a la página de detalle
- [ ] El contenido coincide con `docs/arquitectura/arquitectura_ocastelblanco.md` §2
- [ ] `npm start` muestra el detalle dentro del shell con el design system aplicado

---

## Tarea 2 — [FEATURE]: Página de detalle — Caso de Estudio Le Tiende — Comandante

**Origen:** `PRD.md` §5.2 y §6 (Roadmap, prioridad Alta: cierra el ciclo de los dos casos
de estudio del Registro de Proyectos; no depende de la Tarea 1).

**Archivos:** `src/app/features/proyectos/le-tiende/*` (componente standalone `LeTiende`),
`src/app/app.routes.ts` (ruta `proyectos/le-tiende`).

**Qué hacer:**
1. Crear el componente standalone `LeTiende` en
   `src/app/features/proyectos/le-tiende/`.
2. Implementar la página de detalle usando el contenido de
   `docs/arquitectura/arquitectura_ocastelblanco.md` §3: narrativa "The Efficiency Expert",
   problema, solución, métrica de impacto ("OPEX: $0.50 USD/mes")
   y stack (Serverless, AWS Lambda, SSR, integración de APIs Discogs/Google).
3. Registrar la ruta `proyectos/le-tiende` en `src/app/app.routes.ts` con `loadComponent`.
4. Desde la card de Le Tiende en el Registro de Proyectos, agregar un enlace a esta ruta.
5. Verificar visualmente con `npm start` dentro del shell, en desktop y móvil.

**Definition of done:**
- [ ] Existe `src/app/features/proyectos/le-tiende` como componente standalone con la
      narrativa, métricas y stack del caso
- [ ] `app.routes.ts` registra la ruta `proyectos/le-tiende` → `LeTiende`
- [ ] La card de Le Tiende en el Registro enlaza a la página de detalle
- [ ] El contenido coincide con `docs/arquitectura/arquitectura_ocastelblanco.md` §3
- [ ] `npm start` muestra el detalle dentro del shell con el design system aplicado

---

## Historial de tareas completadas

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
