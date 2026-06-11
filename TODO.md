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

## Tarea 1 — [FEATURE]: Implementar los design tokens del Design System en SCSS

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

## Tarea 2 — [FEATURE]: Shell de navegación (sidebar + topbar)

**Origen:** `PRD.md` §6 (Roadmap, prioridad Alta) y `tech-specs.md` §11 (tercera fila del
roadmap técnico, dependencia: "Boilerplate listo").

**Archivos:** `src/app/shared/shell/*` (componentes standalone para sidebar y topbar),
`src/app/app.ts` / `src/app/app.html` (integración del shell en el layout raíz).

**Qué hacer:**
1. Crear componentes standalone `Sidebar` y `Topbar` en `src/app/shared/shell/` usando los
   tokens de `src/styles/_tokens.scss` y `_typography.scss` (Tarea 1).
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

## Historial de tareas completadas

### 2026-06-11 — [FEATURE]: Generar el boilerplate Angular 22 (standalone, signals, zoneless, SSR)

Generado con `npx -y @angular/cli@22 new` (Angular 22.0.0). `npm run build` y `npm start`
funcionan sin errores. Path aliases (`@core/*`, `@shared/*`, `@features/*`, `@env/*`)
configurados en `tsconfig.json` sin `baseUrl` (rutas relativas con `./`). Carpetas
`src/app/core`, `src/app/shared`, `src/app/features` y `src/environments/*` creadas.
`MEMORY.md` actualizado (§1, §2, §4, §6, §7, §9).

## Log del motor JIT

| Fecha | Comparación PRD vs. MEMORY | Resultado |
|---|---|---|
| 2026-06-11 | No existe código de aplicación; máxima prioridad Alta es el boilerplate Angular 22 (base para todo lo demás), seguida por los design tokens (requeridos por toda UI futura) | Se seleccionan las Tareas 1 y 2 de este archivo. Tarea 2 depende de que exista el workspace generado en la Tarea 1. |
| 2026-06-11 | Boilerplate Angular 22 completado y verificado (build + start OK). Siguiente prioridad Alta sin completar: design tokens SCSS (requeridos por toda UI), seguido por el shell de navegación (depende del boilerplate, ya listo) | Tarea 1 (boilerplate) movida al historial. Tarea 2 (design tokens) pasa a ser Tarea 1. Nueva Tarea 2: shell de navegación (sidebar + topbar) |
