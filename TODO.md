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

---

## Tarea 1 — [FEATURE]: Shell de navegación (sidebar + topbar)

**Origen:** `PRD.md` §6 (Roadmap, prioridad Alta) y `tech-specs.md` §11 (tercera fila del
roadmap técnico, dependencia: "Boilerplate listo").

**Archivos:** `src/app/shared/shell/*` (componentes standalone para sidebar y topbar),
`src/app/app.ts` / `src/app/app.html` (integración del shell en el layout raíz).

**Qué hacer:**
1. Crear componentes standalone `Sidebar` y `Topbar` en `src/app/shared/shell/` usando los
   tokens de `src/styles/_tokens.scss` y `_typography.scss`.
2. Integrar ambos componentes en `src/app/app.html` envolviendo el `<router-outlet>`,
   manteniendo zoneless/signals (sin `NgZone`).
3. La sidebar debe listar los enlaces principales del sitio según `PRD.md` §5 (Home, Casos
   de Estudio, The Lab, Contacto) usando `routerLink`.
4. Verificar visualmente con `npm start` que el shell se renderiza correctamente con el
   design system aplicado.

**Definition of done:**
- [ ] Existen `src/app/shared/shell/sidebar` y `src/app/shared/shell/topbar` como
      componentes standalone
- [ ] `app.html` integra sidebar + topbar alrededor del `router-outlet`
- [ ] La navegación usa `routerLink` con las rutas principales del PRD
- [ ] `npm start` muestra el shell con los estilos del design system aplicados

---

## Tarea 2 — [FEATURE]: CI con GitHub Actions (build + test)

**Origen:** `tech-specs.md` §11 (roadmap técnico, dependencia: "Build/test funcionando
localmente" — ya cumplida tras la Tarea 1 del historial).

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

## Log del motor JIT

| Fecha | Comparación PRD vs. MEMORY | Resultado |
|---|---|---|
| 2026-06-11 | No existe código de aplicación; máxima prioridad Alta es el boilerplate Angular 22 (base para todo lo demás), seguida por los design tokens (requeridos por toda UI futura) | Se seleccionan las Tareas 1 y 2 de este archivo. Tarea 2 depende de que exista el workspace generado en la Tarea 1. |
| 2026-06-11 | Boilerplate Angular 22 completado y verificado (build + start OK). Siguiente prioridad Alta sin completar: design tokens SCSS (requeridos por toda UI), seguido por el shell de navegación (depende del boilerplate, ya listo) | Tarea 1 (boilerplate) movida al historial. Tarea 2 (design tokens) pasa a ser Tarea 1. Nueva Tarea 2: shell de navegación (sidebar + topbar) |
| 2026-06-11 | Design tokens completados y verificados (build OK). Siguiente prioridad Alta: shell de navegación (depende del boilerplate, ya listo, no de la otra tarea activa). Para la segunda tarea, se evita elegir algo que dependa del shell (aún no completado); CI con GitHub Actions ya tiene su dependencia ("build/test local") satisfecha y es de prioridad Media-Alta para mantener la calidad del repo | Tarea 1 (design tokens) movida al historial. Tarea 2 (shell de navegación) pasa a ser Tarea 1. Nueva Tarea 2: CI con GitHub Actions (build + test) |
