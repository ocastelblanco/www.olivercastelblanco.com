# MEMORY.md — ocastelblanco.com (Rediseño 2026)

> Leer este documento al inicio de cada sesión para recuperar el contexto sin necesidad de
> reexplicar el proyecto. Actualizar al cierre de cada sesión relevante.

## 1. Estado actual

| Campo | Valor |
|---|---|
| Versión | Pre-MVP — Angular 22.0.0 (boilerplate, design tokens, shell de navegación y CI listos) |
| URL producción | `https://ocastelblanco.com` (sitio anterior aún activo en `master`) |
| URL CDN | `https://cdn.ocastelblanco.com` (no provisionado en esta iteración) |
| URL API | `https://api.ocastelblanco.com` (futuro, no provisionado) |
| Rama principal (protegida) | `master` — sitio anterior (Angular Universal + Serverless) |
| Rama de desarrollo (protegida) | `rediseno-2026` — rediseño desde cero |
| Última sesión | 2026-06-12 |

## 2. Funcionalidades

### Completadas
- [x] Rama `rediseno-2026` creada como rama huérfana, limpia, sin historial previo
- [x] Documentación inicial (objetivos, arquitectura de contenido, design system, bitácora
      de proceso con Stitch) commiteada y pusheada
- [x] `CLAUDE.md`, `PRD.md`, `tech-specs.md` (con OWASP y git flow) creados

- [x] Boilerplate Angular 22 (standalone, signals, zoneless, SSR)
- [x] Design tokens en SCSS según `DESIGN.md`
- [x] Shell de navegación (sidebar + topbar)
- [x] CI con GitHub Actions (lint + build + test)

### Pendientes (ver `TODO.md` para las 2 tareas activas)
- [ ] Home (Manifiesto + 3 Pilares)
- [ ] Registro de Proyectos + Casos de Estudio
- [ ] Terminal de contacto + endpoint
- [ ] `serverless.yml` y primer despliegue
- [ ] CI con GitHub Actions
- [ ] The Lab (bitácora técnica)
- [ ] Internacionalización ES/EN

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

## 5. Configuraciones vigentes

| Configuración | Valor | Estado |
|---|---|---|
| Dominio principal | `ocastelblanco.com` | Activo (apunta al sitio anterior) |
| Subdominio CDN | `cdn.ocastelblanco.com` | No provisionado en esta iteración |
| Subdominio API | `api.ocastelblanco.com` | No provisionado |
| Buckets S3, ARNs, stacks de Serverless | — | Por definir al crear `serverless.yml` |

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

**Fecha:** 2026-06-12

**Qué se hizo hoy:**
- Se adaptó el shell de navegación para móviles: en `≤720px` la `Sidebar` se convierte en
  una barra de navegación inferior fija (ver ADR-005). Documentado el requisito en `PRD.md`
  §8. PR #2 fusionada a `rediseno-2026`, rama remota eliminada.
- Se agregó CI con GitHub Actions (`.github/workflows/ci.yml`, ver ADR-006): lint + build +
  test en cada `push`/`pull_request` a `master` y `rediseno-2026`. Se instaló
  `@angular-eslint/schematics` (`npx ng add @angular-eslint/schematics`), que generó
  `eslint.config.js` y agregó el builder `lint` a `angular.json`. `npm run lint`, `npm run
  build` y `npm test -- --watch=false` verificados localmente, todos en verde.

**Próxima tarea sugerida:** según el motor JIT (`TODO.md`), Home — "El Manifiesto del
Fixer" (`src/app/features/home`, ruta `''`), y recalcular la siguiente tarea de prioridad
Alta del roadmap (Registro de Proyectos / Casos de Estudio).
