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

## Tarea 1 — [FEATURE]: Generar el boilerplate Angular 22 (standalone, signals, zoneless, SSR)

**Origen:** `PRD.md` §6 (Roadmap, prioridad Alta: "MVP... + Shell de navegación") y
`tech-specs.md` §11 (primera fila del roadmap técnico).

**Archivos:** `angular.json`, `package.json`, `src/main.ts`, `src/main.server.ts`,
`src/app/app.config.ts`, `src/app/app.config.server.ts`, `src/app/app.routes.ts`,
`src/app/app.ts` (generados por el schematic de Angular CLI; no se editan manualmente más
allá de la configuración inicial).

**Qué hacer:**
1. Generar un nuevo workspace Angular 22 (última versión estable) con SSR habilitado,
   componentes standalone y `provideZonelessChangeDetection()` configurado en
   `app.config.ts` / `app.config.server.ts`.
2. Confirmar que el proyecto compila (`npm run build`) y que `npm start` levanta el
   servidor de desarrollo sin errores.
3. Ajustar `tsconfig.json` para incluir los path aliases definidos en `tech-specs.md` §3
   (`@core/*`, `@shared/*`, `@features/*`, `@env/*`) y crear las carpetas vacías
   correspondientes (`src/app/core`, `src/app/shared`, `src/app/features`).
4. Actualizar `MEMORY.md` §1 (versión), §4 (dependencias instaladas con versiones exactas)
   y §6 (primer patrón de código: configuración zoneless) al finalizar.

**Definition of done:**
- [ ] `npm run build` finaliza sin errores
- [ ] `npm start` (modo dev) levanta la app sin errores en consola
- [ ] `app.config.ts`/`app.config.server.ts` usan `provideZonelessChangeDetection()` (sin Zone.js)
- [ ] Existen las carpetas `src/app/core`, `src/app/shared`, `src/app/features` con los
      alias correspondientes en `tsconfig.json`
- [ ] `MEMORY.md` actualizado con versión exacta de Angular y dependencias instaladas

---

## Tarea 2 — [FEATURE]: Implementar los design tokens del Design System en SCSS

**Origen:** `DESIGN.md` (paleta, tipografía, spacing) y `tech-specs.md` §4.4 (Sistema de
estilos / temas).

**Archivos:** `src/styles/_tokens.scss`, `src/styles/_typography.scss`, `src/styles.scss`
(o el archivo de estilos globales generado por el boilerplate).

**Qué hacer:**
1. Crear `src/styles/_tokens.scss` con variables CSS/SCSS para todos los colores definidos
   en `DESIGN.md` (surface, primary/Cyber Lime, secondary/Electric Cyan, error, outline,
   etc.) y para el spacing scale (`xs` 4px → `xxl` 128px).
2. Crear `src/styles/_typography.scss` con las clases/mixins para `h1`, `h2`, `h3`,
   `body-lg`, `body-md`, `technical-label`, `data-point`, usando JetBrains Mono e Inter
   según `DESIGN.md`, e importar ambas fuentes (Google Fonts o self-hosted).
3. Importar `_tokens.scss` y `_typography.scss` desde `src/styles.scss`, definir
   `border-radius: 0` como valor global por defecto y aplicar el fondo `surface`
   (`#131313`) con textura de ruido sutil (2–3% opacidad) según `DESIGN.md`.
4. Verificar visualmente (`npm start`) que la página por defecto del boilerplate refleja el
   fondo oscuro, la tipografía y los colores base del design system.

**Definition of done:**
- [ ] `_tokens.scss` define todas las variables de color y spacing de `DESIGN.md`
- [ ] `_typography.scss` define los estilos para `h1`, `h2`, `h3`, `body-lg`, `body-md`,
      `technical-label`, `data-point`
- [ ] `styles.scss` importa ambos archivos, fija `border-radius: 0` global y aplica el
      fondo oscuro con textura de ruido
- [ ] La app levantada con `npm start` muestra visualmente el tema oscuro con la
      tipografía correcta

---

## Historial de tareas completadas

_(vacío — primera ejecución del motor JIT)_

## Log del motor JIT

| Fecha | Comparación PRD vs. MEMORY | Resultado |
|---|---|---|
| 2026-06-11 | No existe código de aplicación; máxima prioridad Alta es el boilerplate Angular 22 (base para todo lo demás), seguida por los design tokens (requeridos por toda UI futura) | Se seleccionan las Tareas 1 y 2 de este archivo. Tarea 2 depende de que exista el workspace generado en la Tarea 1. |
