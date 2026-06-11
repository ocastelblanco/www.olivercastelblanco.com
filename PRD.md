# PRD — ocastelblanco.com (Rediseño 2026)

> Audiencia: mixta (Oliver Castelblanco como stakeholder/producto + agentes IA de desarrollo).
> Idioma: español colombiano. Nivel de detalle: referencia.

## 1. Visión del producto

| Campo | Valor |
|---|---|
| Nombre | ocastelblanco.com — "ARCH_ORCH" |
| Tipo | Sitio web personal: portafolio profesional + bitácora técnica (meta-proyecto) |
| Público | Reclutadores técnicos, clientes/empresas que buscan consultoría en arquitectura cloud, comunidad de desarrolladores, motores de búsqueda y modelos de lenguaje (SEO para IA) |
| Idiomas | Español (principal, contenido inicial). Inglés (roadmap, ver §6) |
| URL principal | `https://ocastelblanco.com` |
| URLs auxiliares | `https://cdn.ocastelblanco.com` (activos digitales), `https://api.ocastelblanco.com` (servicios, futuro) |

## 2. Contexto y problema que resuelve

Oliver Castelblanco es un Solutions Architect con ~25 años de experiencia que trabaja de forma
independiente, apoyado fuertemente en orquestación de IA para diseñar y construir soluciones
completas (arquitectura, infraestructura cloud y diseño de producto) con equipos mínimos.

El sitio anterior ya no refleja este posicionamiento. Se necesita un sitio nuevo que:

- Comunique de forma directa y técnica las capacidades de arquitectura, eficiencia de costos
  (Cloud Economics) y diseño de producto.
- Sirva como **prueba de concepto en sí misma**: el sitio se documenta y construye en público,
  como caso de estudio de desarrollo acelerado con IA.
- Sea fácilmente descubierto e interpretado tanto por buscadores tradicionales como por
  modelos de lenguaje (SEO orientado a IA).

## 3. Usuarios y audiencias

| Perfil | Necesidades |
|---|---|
| Reclutador / hiring manager técnico | Entender rápidamente la experiencia, stack y casos de éxito; validar seniority |
| Empresa/cliente potencial (consultoría) | Ver evidencia de impacto medible (costos, tiempos de entrega) y forma de contacto directa |
| Desarrollador / comunidad técnica | Leer la bitácora técnica, aprender del proceso de orquestación de IA, replicar patrones |
| Motor de búsqueda / modelo de lenguaje (SEO-IA) | Contenido estructurado, semántico y citable sobre el perfil profesional y los proyectos |

## 4. Objetivos del producto

| Objetivo | Métrica de éxito | Estado |
|---|---|---|
| Comunicar el posicionamiento "Solutions Architect & AI Orchestrator" | Home con manifiesto y 3 pilares de valor (Eficiencia, Arquitectura, Diseño) visibles | Pendiente |
| Mostrar casos de estudio con métricas de impacto | Al menos 3 casos de estudio publicados con KPIs (OPEX, tiempos de entrega, % reducción de staff) | Pendiente |
| Registrar el proceso de construcción del sitio | Sección "The Lab" / bitácora con al menos 3 entradas iniciales | Pendiente |
| Habilitar contacto directo | Terminal/CLI de contacto funcional | Pendiente |
| SEO técnico y para IA | Datos estructurados (JSON-LD), SSR funcionando, sitemap, contenido citable | Pendiente |
| Infraestructura de costo mínimo | OPEX objetivo ≈ costo de un café/mes (free tier AWS donde sea posible) | Pendiente |
| CI automatizado | Pipeline de GitHub Actions con build + lint + test + deploy | Pendiente |

## 5. Funcionalidades actuales (planeadas para el MVP)

> El proyecto inicia desde cero (rama `rediseno-2026`); estas son las pantallas/funcionalidades
> que conforman el alcance inicial, basadas en `docs/arquitectura/`.

1. **Home — "El Manifiesto del Fixer"**: hero con headline de autoridad, sub-headline y los
   tres pilares de valor (Eficiencia, Arquitectura, Diseño).
2. **Registro de Proyectos (Project Registry)**: grid de tarjetas "Metric-First" — métrica
   destacada a la izquierda (ej. "OPEX: $0.50/mes"), título técnico y enlace al caso de estudio.
3. **Casos de Estudio (Deployment Logs)**: detalle de cada proyecto (problema, solución,
   métrica de impacto, stack).
4. **The Lab**: micro-blog técnico con notas cortas sobre arquitectura, prompt engineering y
   cloud economics.
5. **Terminal de contacto**: interfaz tipo línea de comandos para inquiries directas.
6. **Shell de navegación**: sidebar expandible (iconos 20px que se expanden en hover) +
   topbar, consistentes en todas las vistas.

**Flujo principal (Home → Caso de estudio → Contacto):**

```
[Visitante llega a Home]
        │
        ▼
[Lee Manifiesto + 3 Pilares]
        │
        ▼
[Navega a Registro de Proyectos]
        │
        ▼
[Selecciona una tarjeta Metric-First]
        │
        ▼
[Ve Caso de Estudio detallado: problema → solución → métrica → stack]
        │
        ▼
[Abre Terminal de contacto]
        │
        ▼
[Envía mensaje / inquiry]
```

## 6. Roadmap de funcionalidades futuras

| Funcionalidad | Prioridad |
|---|---|
| MVP: Home + Registro de Proyectos + 1 Caso de Estudio + Shell de navegación | Alta |
| Terminal de contacto funcional | Alta |
| SSR + despliegue serverless en AWS Lambda | Alta |
| SEO técnico (JSON-LD, sitemap, meta tags dinámicos) | Alta |
| Sección "The Lab" con primeras entradas de bitácora | Media |
| Pipeline de CI/CD con GitHub Actions | Media |
| Internacionalización (versión en inglés) | Media |
| Integración con Cloudinary para gestión de imágenes | Media |
| Casos de estudio adicionales (ConectaTech, Le Tiende - Comandante) | Media |
| Telemetría / dashboard de métricas en vivo (AI Orchestration Pipeline) | Baja |
| Integraciones adicionales con Firebase (auth/functions) | Baja |

## 7. Casos de uso principales

| Actor | Acción | Resultado esperado |
|---|---|---|
| Visitante (reclutador) | Entra a Home y lee los 3 pilares | Comprende el posicionamiento profesional en <30s |
| Visitante (cliente potencial) | Abre un Caso de Estudio | Ve el problema, la solución y la métrica de impacto cuantificada |
| Visitante (desarrollador) | Navega a "The Lab" | Lee una entrada técnica de la bitácora del proyecto |
| Cualquier visitante | Abre el Terminal y escribe un mensaje | El mensaje llega a Oliver (vía email/notificación) |
| Motor de búsqueda / IA | Indexa el sitio | Encuentra contenido estructurado (SSR + datos semánticos) sobre el perfil y proyectos |

## 8. Requisitos no funcionales

- **Performance**: Core Web Vitals en verde (LCP, CLS, INP); SSR para first paint rápido.
- **SEO**: meta tags dinámicos por ruta, sitemap.xml, robots.txt, datos estructurados (JSON-LD
  tipo `Person`, `CreativeWork`, `Article` para "The Lab").
- **Accesibilidad**: WCAG 2.2 AA, especialmente contraste de color (paleta de alto contraste
  definida en `DESIGN.md`).
- **Seguridad**: sin credenciales expuestas en el cliente; formulario de contacto protegido
  contra spam/abuso (ver `tech-specs.md` §8-9).
- **Costo (Cloud Economics)**: arquitectura serverless con objetivo de operar dentro de la
  capa gratuita de AWS en la mayoría de los meses.
- **Disponibilidad**: sin requerimiento de SLA estricto (sitio personal), pero se espera alta
  disponibilidad por naturaleza serverless/CDN.

## 9. Restricciones y decisiones de diseño

- El sitio se construye **completamente desde cero** en la rama `rediseno-2026`; no se reutiliza
  código del sitio anterior (rama `master`), aunque puede consultarse como referencia histórica.
- La identidad visual sigue estrictamente el design system "Technical Industrial Minimalism"
  definido en `DESIGN.md` (no introducir paletas, tipografías ni radios de borde distintos sin
  actualizar primero el design system).
- Arquitectura **serverless por decisión deliberada**: sin servidores administrados, pensada
  desde el inicio como un conjunto de microservicios desacoplados (ver ADR en `MEMORY.md`).
- Angular 22 (última estable) con Signals y sin Zone.js, también por decisión deliberada de
  adoptar siempre la versión estable más reciente del framework.
- El proceso de construcción (prompts, decisiones, iteraciones) debe quedar documentado en
  `docs/proceso/` y reflejarse en el contenido público del sitio ("The Lab").

## 10. Glosario de negocio

| Término | Significado |
|---|---|
| ARCH_ORCH | Nombre de marca técnica usado en los documentos de diseño/PRD originales para este proyecto |
| The Fixer | Posicionamiento personal de Oliver como solucionador de problemas de arquitectura sistémica |
| Cloud Economics | Disciplina de optimizar costos de infraestructura cloud sin sacrificar estabilidad |
| Metric-First Card | Componente visual donde una métrica de impacto (ej. costo, tiempo) es el elemento más destacado |
| The Lab | Sección de micro-blog técnico del sitio |
| Terminal | Interfaz de contacto con estética de línea de comandos |
| Deployment Log | Nombre narrativo para un caso de estudio detallado |
| OPEX | Costo operativo mensual de la infraestructura (gasto recurrente) |
