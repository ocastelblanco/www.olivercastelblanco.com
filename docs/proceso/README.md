# docs/proceso/ — Bitácora del proceso de construcción

Esta carpeta documenta, de forma narrativa, **cómo se construye este sitio usando
orquestación de IA**. Es uno de los insumos principales de "The Lab" (ver `PRD.md` §5.4) y
sirve como caso de estudio para audiencias que evalúan la capacidad de Oliver Castelblanco
en arquitectura, diseño de producto y gestión de equipos (humanos o de agentes IA).

## Contenido

| Documento | Qué cubre |
|---|---|
| [`2026-06-fundacion-arquitectura-y-orquestacion-ia.md`](./2026-06-fundacion-arquitectura-y-orquestacion-ia.md) | Iteración fundacional del rediseño 2026: decisiones de arquitectura (ADRs), el sistema de documentación como "playbook" para agentes IA, seguridad desde el diseño, y la ejecución del boilerplate Angular 22 + design tokens. |
| [`Stitch.md`](./Stitch.md) | Bitácora del proceso de diseño visual con Google Stitch (prompts e iteraciones que dieron origen al design system "Technical Industrial Minimalism", ver `DESIGN.md`). |
| `*.zip` | Exports de pantallas generadas durante el proceso de diseño con Stitch, referenciados desde `Stitch.md`. |

## Convención para nuevas entradas

Cada vez que el proyecto completa una **iteración mayor** (un cambio de versión "mayor" del
producto — ver `MEMORY.md` §1 "Versión" y el roadmap en `PRD.md` §6), se agrega un nuevo
documento aquí con el prefijo `AAAA-MM-` seguido de un nombre corto que describa la
iteración (ej. `2026-08-mvp-home-y-registro-de-proyectos.md`).

Esta regla está formalizada como parte del motor JIT en `TODO.md` (sección "Cómo funciona
el motor JIT").

Cada entrada debe escribirse pensando en la audiencia de `PRD.md` §3 (reclutadores,
clientes potenciales, comunidad técnica) y debe responder, como mínimo:

1. **Qué se construyó** en esta iteración (resumen ejecutivo).
2. **Qué decisiones de arquitectura/diseño se tomaron** y por qué (ADRs relevantes).
3. **Cómo se orquestó el trabajo** (roles, documentos guía, flujo de revisión/PR).
4. **Qué se aprendió** (gotchas, ajustes al proceso).
5. **Qué sigue** (próximas tareas del motor JIT).
