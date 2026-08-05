# docs/proceso/ — Bitácora del proceso de construcción

Esta carpeta documenta, de forma narrativa, **cómo se construye este sitio usando
orquestación de IA**. Es uno de los insumos principales de "The Lab" (ver `PRD.md` §5.4) y
sirve como caso de estudio para audiencias que evalúan la capacidad de Oliver Castelblanco
en arquitectura, diseño de producto y gestión de equipos (humanos o de agentes IA).

## Contenido

| Documento | Qué cubre |
|---|---|
| [`2026-06-fundacion-arquitectura-y-orquestacion-ia.md`](./2026-06-fundacion-arquitectura-y-orquestacion-ia.md) | Iteración fundacional del rediseño 2026: decisiones de arquitectura (ADRs), el sistema de documentación como "playbook" para agentes IA, seguridad desde el diseño, y la ejecución del boilerplate Angular 22 + design tokens. |
| [`2026-06-shell-identidad-visual-i18n.md`](./2026-06-shell-identidad-visual-i18n.md) | Shell de navegación (sidebar + topbar), identidad visual corporativa (logo y kit de assets), soporte multilengua ES/EN con cambio inmediato (`TranslationService` + `LangSwitcher`), y pipeline de CI con GitHub Actions. |
| [`2026-06-the-lab-y-deploy-ci-cd-lambda.md`](./2026-06-the-lab-y-deploy-ci-cd-lambda.md) | Despliegue CI/CD a AWS Lambda con stage `preview` automático por push (5 ciclos de diagnóstico: SF v4 license, esbuild nativo, CJS/ESM interop, `NG_ALLOWED_HOSTS`). The Lab: micro-blogging técnico con 3 entradas estáticas y diseño de tarjeta en Electric Cyan. |
| [`2026-08-mvp-en-produccion.md`](./2026-08-mvp-en-produccion.md) | Cierre del MVP: backend de contacto vía SES, arquitectura de contenido, SEO técnico, infraestructura multi-stage, CI/CD por ambientes y el switch de producción. Incluye la auditoría que encontró tres bugs latentes antes del corte, y el incidente del header `Host` (403 por `AllViewer`) con su diagnóstico. |
| [`Stitch.md`](./Stitch.md) | Bitácora del proceso de diseño visual con Google Stitch (prompts e iteraciones que dieron origen al design system "Technical Industrial Minimalism", ver `DESIGN.md`). |
| `*.zip` | Exports de pantallas generadas durante el proceso de diseño con Stitch, referenciados desde `Stitch.md`. |

### Guías operativas (how-to, no narrativas)

A diferencia de la bitácora narrativa de arriba, estos documentos son instructivos
prácticos para tareas operativas recurrentes — no siguen la convención de "iteración
mayor" de abajo, pero viven en esta carpeta por estar directamente atados al proceso de
publicación de contenido del sitio (ver ADR-011 en `MEMORY.md`).

| Documento | Qué cubre |
|---|---|
| [`apps-script-lab.md`](./apps-script-lab.md) | Cómo publicar una entrada de "The Lab" desde Google Sheets vía Apps Script (`POST /lab`, token secreto, subset de Markdown soportado). |
| [`publicar-casos-de-estudio.md`](./publicar-casos-de-estudio.md) | Cómo agregar un nuevo "Caso de Estudio" al repo (JSON tipado + registro en `ContentService` + ruta/componente de detalle + PR). |

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
