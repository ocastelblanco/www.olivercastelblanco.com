# Fundación del rediseño 2026: arquitectura, seguridad y orquestación IA

**Fecha:** 2026-06-11
**Iteración:** Fundación (rama `rediseno-2026`, Pre-MVP)
**Rol de Oliver Castelblanco:** Solutions Architect & AI Orchestrator — definición de
producto, arquitectura, criterios de aceptación y revisión final.
**Rol de los agentes IA:** ejecución guiada (documentación, scaffolding, implementación,
verificación) bajo el playbook descrito abajo.

---

## 1. Resumen ejecutivo

Esta iteración no entrega todavía funcionalidades de cara al usuario final: entrega la
**base de operación** sobre la que se construirá el resto del producto. En una sola
sesión de trabajo se definió por completo:

- La estrategia de migración (reescritura limpia en rama huérfana, sin arrastrar deuda
  técnica del sitio anterior).
- El conjunto de documentos que actúan como **especificación viva** del proyecto y como
  *playbook* para cualquier agente de IA o desarrollador que se incorpore después.
- Tres decisiones de arquitectura de alto impacto (frontend, infraestructura, sistema de
  diseño), registradas como ADRs con su razón y sus consecuencias.
- Un análisis de seguridad OWASP Top 10 aplicado a la arquitectura concreta del proyecto,
  **antes** de escribir la primera línea de código de producto.
- El primer entregable técnico real: el boilerplate de Angular 22 (standalone, Signals,
  sin Zone.js, SSR) y la implementación completa de los design tokens del sistema visual.

El resultado es un repositorio donde **cualquier persona o agente puede retomar el trabajo
sin contexto previo**, leyendo cuatro documentos (`CLAUDE.md`, `PRD.md`, `tech-specs.md`,
`MEMORY.md`) y una lista de exactamente dos tareas activas (`TODO.md`).

## 2. Contexto y objetivo del proyecto

`ocastelblanco.com` cumple un doble propósito (ver `docs/objetivos-alcances.md` y `PRD.md`
§2): es el portafolio profesional de Oliver Castelblanco **y**, al mismo tiempo, un caso de
estudio público sobre cómo construir software apoyándose en orquestación de IA. Es decir,
el proceso documentado en esta carpeta es, en sí mismo, parte del producto.

La decisión de partida fue reescribir el sitio **completamente desde cero**, en una rama
huérfana (`rediseno-2026`, ADR-001), dejando `master` como referencia histórica del sitio
anterior (Angular Universal + Serverless). Esto permitió adoptar de inmediato las
decisiones de arquitectura descritas a continuación sin compromisos de compatibilidad.

## 3. Decisiones de arquitectura (ADRs)

Todas las decisiones quedan registradas con fecha, estado, razón y consecuencias en
`MEMORY.md` §3. Resumen orientado a audiencia no técnica:

| ADR | Decisión | Por qué importa para el negocio |
|---|---|---|
| **ADR-001** | Reescritura completa en rama huérfana `rediseno-2026` | Permite modernizar sin arrastrar riesgos ni configuración heredada; `master` queda intacto como respaldo/producción mientras se construye la nueva versión |
| **ADR-002** | Angular 22 (última estable), componentes standalone, **Signals** y **sin Zone.js** | Adopta el modelo de reactividad más moderno y eficiente de Angular, reduciendo overhead de runtime y simplificando el código — refleja el criterio de "adoptar siempre la versión estable más reciente" |
| **ADR-003** | Arquitectura **serverless multi-proveedor orientada a microservicios** (AWS Lambda + API Gateway + S3/CloudFront vía Serverless Framework, con `api.ocastelblanco.com` como puerta de entrada a servicios independientes que pueden integrar Firebase, Cloudinary, etc.) | Objetivo de **costo operativo prácticamente nulo** (capa gratuita de AWS) sin sacrificar escalabilidad; cada nueva capacidad se agrega como un microservicio independiente, sin acoplar el frontend a un backend monolítico |
| **ADR-004** | Sistema de diseño "Technical Industrial Minimalism" (`DESIGN.md`), validado con Google Stitch | Identidad visual coherente que comunica precisión técnica y autoridad — ver [`Stitch.md`](./Stitch.md) para el proceso de diseño completo |

## 4. El sistema de documentación como playbook de orquestación

La parte más relevante de esta iteración, desde el punto de vista de **gestión de
proyecto**, es el sistema de documentos que actúa como interfaz entre Oliver Castelblanco
(producto/arquitectura) y los agentes de IA (ejecución). Cada documento tiene un propósito
único y una audiencia clara:

| Documento | Rol en la orquestación | Análogo en un equipo humano |
|---|---|---|
| `CLAUDE.md` | Reglas permanentes: stack, convenciones, seguridad (OWASP) y flujo de Git. Se lee al inicio de cada sesión. | Manual de onboarding / guía de ingeniería del equipo |
| `PRD.md` | Qué se está construyendo y para quién, con roadmap priorizado | Documento de producto / brief de negocio |
| `tech-specs.md` | Cómo se construye: arquitectura, modelos de datos, endpoints, convenciones técnicas | Documento de diseño técnico / RFC |
| `MEMORY.md` | Estado real del proyecto, decisiones tomadas (ADRs), dependencias, *gotchas* conocidos | Bitácora de decisiones + wiki interno del equipo |
| `TODO.md` (motor JIT) | Exactamente **2 tareas atómicas activas**, recalculadas tras completar cualquiera de ellas, comparando `PRD.md` (objetivo) vs. `MEMORY.md` (estado real) | Sprint con límite estricto de *work in progress* (WIP=2) |

### El motor JIT: priorización continua con WIP limitado

En lugar de mantener un backlog extenso (que tiende a quedar desactualizado), `TODO.md`
nunca contiene más de dos tareas, cada una:

- completable en una sola sesión de trabajo,
- acotada a un máximo de 3 archivos,
- con una *definition of done* verificable sin ambigüedad,
- independiente de la otra tarea activa.

Al completar una tarea, se mueve al historial con fecha, y se recalcula la siguiente según
una prioridad fija: (1) gaps de seguridad activos, (2) features de prioridad **Alta** del
roadmap, (3) features de prioridad **Media**. Este mecanismo evita dos fallas típicas de la
"vibe coding" sin estructura: la pérdida de contexto entre sesiones y la acumulación de
trabajo a medio terminar.

### Flujo de control de cambios (Git Flow para agentes IA)

`CLAUDE.md` define un flujo de Git estricto y no negociable para cualquier agente:

- `master` y `rediseno-2026` están protegidas — ningún agente commitea directo a ellas
  (con una única excepción documentada y ya cerrada: el bootstrap inicial de
  documentación + primer boilerplate).
- Todo cambio de código pasa por una rama `feature/`, `fix/`, `docs/`, etc., un build
  exitoso, un commit con Conventional Commits en español, y un **Pull Request** hacia
  `rediseno-2026`.
- Los agentes **nunca** aprueban ni fusionan sus propios PRs — esa decisión queda siempre
  en manos humanas.

Este documento mismo se generó siguiendo ese flujo: rama `docs/bitacora-orquestacion-y-readme`
→ commit → PR hacia `rediseno-2026`.

## 5. Seguridad desde el diseño (OWASP Top 10)

Antes de escribir código de producto, `CLAUDE.md` §6 documenta un análisis de las
categorías OWASP Top 10 (2021) relevantes para esta arquitectura específica — no un
checklist genérico. Cada categoría incluye el riesgo concreto y la regla de código que lo
mitiga. Algunos ejemplos:

- **A02 (criptografía/exposición de datos):** ninguna variable `*_SECRET`/`*_KEY` puede
  usarse en código que corra en el navegador; las operaciones con secretos viven solo en
  funciones Lambda.
- **A03 (inyección/XSS):** prohibido `[innerHTML]`/`bypassSecurityTrustHtml` con contenido
  de usuario sin sanitizar — relevante porque "The Lab" renderizará Markdown.
- **A05 (configuración):** CORS de `api.ocastelblanco.com` restringido al dominio propio
  (nunca `*`); buckets S3 sin permisos públicos de escritura/listado.
- **A07 (autenticación):** el futuro endpoint `POST /contact` no se despliega sin
  rate limiting / anti-spam.
- **A10 (SSRF):** ninguna función Lambda hace `fetch` a URLs provistas por el usuario sin
  una lista explícita de dominios permitidos.

Tratar la seguridad como una restricción de diseño desde el día uno —y no como una revisión
posterior— es deliberado: reduce el costo de corregirla más adelante y deja evidencia clara
del criterio aplicado.

## 6. Ejecución: del boilerplate a los design tokens

Con el playbook definido, la ejecución de las dos primeras tareas del motor JIT fue rápida
y verificable:

1. **Boilerplate Angular 22** — generado con `npx -y @angular/cli@22 new` (fue necesario
   forzar la versión 22 explícitamente: el binario global `ng` apuntaba a Angular CLI 20).
   Configuración resultante: componentes standalone, `provideZonelessChangeDetection()`,
   SSR vía `@angular/ssr` con hidratación y *event replay*, y path aliases (`@core/*`,
   `@shared/*`, `@features/*`, `@env/*`).

   Durante esta tarea surgió un problema real de compatibilidad: TypeScript 6 (usado por
   Angular CLI 22) deprecó `baseUrl` en `tsconfig.json` (error `TS5101`). Quitar `baseUrl`
   sin más rompió la resolución de los alias (`TS5090`, "non-relative paths require a
   leading './'"). La solución — anteponer `./` a cada ruta en `paths` — quedó documentada
   en `MEMORY.md` §7 (gotchas) para que nadie vuelva a perder tiempo en ese mismo error.

2. **Design tokens del sistema visual** — `src/styles/_tokens.scss` traduce literalmente
   la paleta y el spacing scale de `DESIGN.md` a *custom properties* CSS;
   `src/styles/_typography.scss` define los mixins tipográficos (JetBrains Mono / Inter);
   y `src/styles.scss` aplica `border-radius: 0` global, el fondo Deep Charcoal y una
   textura de ruido sutil (SVG `feTurbulence`, ~2.5% de opacidad) según la especificación
   de "Industrial Minimalism".

Ambas tareas se verificaron con `npm run build` (sin errores) y `npm start` (servidor de
desarrollo arrancando sin errores en consola) antes de marcarse como completas.

## 7. Aprendizajes para la siguiente iteración

- El patrón "rama huérfana + documentación primero" funcionó: permitió tomar decisiones de
  arquitectura sin presión de código existente, y dejó un punto de partida limpio para
  medir el progreso real (ver checklist de `PRD.md` §4, todo en estado "Pendiente" salvo
  la base técnica).
- Forzar versiones explícitas de herramientas (`npx @angular/cli@22` en vez de depender
  del binario global) evita inconsistencias silenciosas entre entornos — una práctica que
  se mantendrá para futuras dependencias críticas.
- El costo de mantener `MEMORY.md` y `TODO.md` actualizados al final de cada tarea es bajo
  comparado con el beneficio: cualquier sesión nueva (humana o de IA) arranca con contexto
  completo en minutos.

## 8. Qué sigue

Según el motor JIT (`TODO.md`), las dos tareas activas tras esta iteración son:

1. **Shell de navegación** (sidebar + topbar) — primer componente de UI visible, construido
   sobre los design tokens de esta iteración.
2. **CI con GitHub Actions** — automatiza `npm ci` + `build` + tests en cada push/PR,
   formalizando el flujo de control de cambios descrito en la sección 4.

La siguiente entrada de esta bitácora se escribirá al cerrar la próxima iteración mayor del
producto (ver convención en [`README.md`](./README.md) de esta carpeta).
