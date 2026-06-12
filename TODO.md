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

## Tarea 1 — [FEATURE]: CI con GitHub Actions (build + test)

**Origen:** `tech-specs.md` §11 (roadmap técnico, dependencia: "Build/test funcionando
localmente" — ya cumplida tras las tareas del historial).

**Archivos:** `.github/workflows/ci.yml`.

**Qué hacer:**
1. Crear el workflow `.github/workflows/ci.yml` que se ejecute en `push` y `pull_request`
   sobre `master` y `rediseno-2026`.
2. El job debe usar Node 22 (LTS, según `engines` de Angular CLI 22), instalar dependencias
   con `npm ci` y ejecutar `npm run build`.
3. Incluir un paso `npm test -- --watch=false` (o el comando equivalente con Vitest) para
   correr la suite de pruebas generada por el boilerplate.
4. No incluir pasos de despliegue todavía (eso corresponde a la tarea futura de
   `serverless.yml`).

**Definition of done:**
- [ ] Existe `.github/workflows/ci.yml` con triggers `push`/`pull_request` sobre `master` y
      `rediseno-2026`
- [ ] El workflow ejecuta `npm ci`, `npm run build` y la suite de pruebas
- [ ] El workflow no incluye pasos de despliegue
- [ ] `MEMORY.md` §8 referencia el nuevo workflow como documento/configuración vigente

---

## Tarea 2 — [FEATURE]: Home — "El Manifiesto del Fixer"

**Origen:** `PRD.md` §5.1 y §6 (Roadmap, prioridad Alta: "MVP: Home + Registro de Proyectos +
1 Caso de Estudio + Shell de navegación" — esta tarea cubre la pieza Home, que depende del
shell de navegación, ya completado).

**Archivos:** `src/app/features/home/*` (componente standalone `Home`),
`src/app/app.routes.ts` (registrar la ruta `''` apuntando a `Home`).

**Qué hacer:**
1. Generar el componente standalone `Home` en `src/app/features/home/` (`npx ng generate
   component features/home`).
2. Implementar el contenido de `docs/arquitectura/arquitectura_ocastelblanco.md` §1: hero con
   headline de autoridad ("The Fixer: Industrial Design Thinking meets AI Orchestration."),
   sub-headline (25 años resolviendo arquitectura sistémica mediante Cloud Economics y
   Desarrollo Aumentado por IA) y los tres pilares de valor (Efficiency, Architecture,
   Design) como bloques/cards usando los tokens de `DESIGN.md`.
3. Registrar la ruta `''` en `src/app/app.routes.ts` apuntando a `Home` (carga directa o
   `loadComponent`, consistente con zoneless/standalone).
4. Verificar visualmente con `npm start` que la Home se renderiza dentro del shell
   (sidebar + topbar) con el design system aplicado.

**Definition of done:**
- [ ] Existe `src/app/features/home` como componente standalone con hero + 3 pilares
- [ ] `app.routes.ts` registra la ruta `''` → `Home`
- [ ] El contenido coincide con `docs/arquitectura/arquitectura_ocastelblanco.md` §1
- [ ] `npm start` muestra la Home dentro del shell de navegación con los estilos del design
      system aplicados

---

## Historial de tareas completadas

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

## Log del motor JIT

| Fecha | Comparación PRD vs. MEMORY | Resultado |
|---|---|---|
| 2026-06-11 | No existe código de aplicación; máxima prioridad Alta es el boilerplate Angular 22 (base para todo lo demás), seguida por los design tokens (requeridos por toda UI futura) | Se seleccionan las Tareas 1 y 2 de este archivo. Tarea 2 depende de que exista el workspace generado en la Tarea 1. |
| 2026-06-11 | Boilerplate Angular 22 completado y verificado (build + start OK). Siguiente prioridad Alta sin completar: design tokens SCSS (requeridos por toda UI), seguido por el shell de navegación (depende del boilerplate, ya listo) | Tarea 1 (boilerplate) movida al historial. Tarea 2 (design tokens) pasa a ser Tarea 1. Nueva Tarea 2: shell de navegación (sidebar + topbar) |
| 2026-06-11 | Design tokens completados y verificados (build OK). Siguiente prioridad Alta: shell de navegación (depende del boilerplate, ya listo, no de la otra tarea activa). Para la segunda tarea, se evita elegir algo que dependa del shell (aún no completado); CI con GitHub Actions ya tiene su dependencia ("build/test local") satisfecha y es de prioridad Media-Alta para mantener la calidad del repo | Tarea 1 (design tokens) movida al historial. Tarea 2 (shell de navegación) pasa a ser Tarea 1. Nueva Tarea 2: CI con GitHub Actions (build + test) |
| 2026-06-12 | Shell de navegación completado y verificado (build + test + visual OK). Siguiente prioridad: CI con GitHub Actions (ya seleccionada como Tarea 2, sin dependencias pendientes) pasa a Tarea 1. Para la nueva Tarea 2 se prioriza Home ("El Manifiesto del Fixer", prioridad Alta del roadmap), que ya puede construirse dentro del shell recién completado | Tarea 1 (shell de navegación) movida al historial. Tarea 2 (CI) pasa a ser Tarea 1. Nueva Tarea 2: Home — "El Manifiesto del Fixer" |
