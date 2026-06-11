# CLAUDE.md — ocastelblanco.com

> Instrucciones permanentes para cualquier IA (o desarrollador) que trabaje en este repositorio.
> Idioma del proyecto: **español colombiano** (código y documentación). El contenido del sitio
> puede ofrecerse en español/inglés según se defina en `PRD.md`.

## 1. Descripción del proyecto

`ocastelblanco.com` es el sitio web personal de **Oliver Castelblanco**, Solutions Architect &
AI Orchestrator. Es la segunda iteración (rediseño 2026) construida totalmente desde cero en la
rama `rediseno-2026`.

El sitio cumple dos objetivos:

1. **Portafolio profesional**: mostrar capacidades de arquitectura, diseño y desarrollo de
   soluciones integrales apoyadas en orquestación de IA, bajo la identidad visual
   "Industrial Minimalism / Technical Dark Mode" definida en [`DESIGN.md`](./DESIGN.md).
2. **Bitácora técnica (meta-proyecto)**: documentar el propio proceso de construcción del sitio
   como caso de estudio de desarrollo apoyado en LLM, con SEO orientado tanto a buscadores
   tradicionales como a modelos de lenguaje.

Ver [`docs/objetivos-alcances.md`](./docs/objetivos-alcances.md) y
[`docs/arquitectura/`](./docs/arquitectura/) para el contexto completo.

## 2. Stack tecnológico

| Tecnología | Versión | Propósito |
|---|---|---|
| Angular | 22 (última estable) | Framework principal, **standalone + Signals + zoneless** (sin Zone.js) |
| Angular SSR | 22 | Renderizado del servidor / SEO |
| TypeScript | última estable compatible con Angular 22 | Lenguaje principal |
| AWS Lambda | — | Cómputo serverless para SSR y futuras APIs |
| Serverless Framework | última estable | Empaquetado y despliegue a AWS Lambda |
| AWS S3 + CloudFront | — | Hosting de activos estáticos en `cdn.ocastelblanco.com` |
| AWS API Gateway | — | Punto de entrada para `api.ocastelblanco.com` (microservicios) |
| Google Firebase | — | Servicios complementarios (a definir: auth, hosting, functions) |
| Cloudinary | — | Gestión/optimización de imágenes y assets multimedia |
| GitHub Actions | — | CI (build, test, lint, despliegue) |

> Se prioriza siempre la **versión estable más reciente** de cada dependencia. Angular 22 se
> elige específicamente porque estabiliza Signals como modelo de reactividad por defecto y
> permite eliminar Zone.js (ver ADR en `MEMORY.md`).

## 3. Estructura de carpetas (propuesta para el boilerplate)

```
www.olivercastelblanco.com/
├── docs/                       # Documentación funcional, arquitectura y proceso
│   ├── arquitectura/
│   └── proceso/
├── src/
│   ├── app/
│   │   ├── core/               # Servicios singleton, guards, interceptors, config
│   │   ├── shared/              # Componentes, pipes y directivas reutilizables (UI kit)
│   │   ├── features/            # Secciones del sitio (home, proyectos, lab, terminal, contacto)
│   │   ├── app.config.ts
│   │   ├── app.routes.ts
│   │   └── app.ts
│   ├── assets/
│   ├── styles/                  # Design tokens / SCSS del design system (DESIGN.md)
│   ├── main.ts
│   └── main.server.ts
├── server.ts                   # Entry point SSR / handler Lambda
├── serverless.yml
├── angular.json
├── package.json
├── CLAUDE.md
├── PRD.md
├── tech-specs.md
├── MEMORY.md
└── TODO.md
```

Esta estructura se confirma/ajusta al generar el boilerplate (ver `TODO.md`).

## 4. Convenciones de código

- **Componentes standalone**, sin `NgModule` (excepto los estrictamente requeridos por SSR).
- **Signals** para estado local y derivado; evitar `RxJS` salvo para flujos async reales
  (HTTP, eventos del DOM). Sin `Zone.js` (`provideZonelessChangeDetection()`).
- **Nomenclatura**: archivos y símbolos de código en inglés (`hero.component.ts`,
  `ProjectCardComponent`), siguiendo la Angular Style Guide oficial. El **contenido/copy**
  del sitio vive en español (con soporte a inglés vía i18n si el roadmap lo define).
- **Estilos**: SCSS con los design tokens de `DESIGN.md` (paleta Industrial Minimalism,
  tipografía JetBrains Mono / Inter, radios 0px, grid de 12 columnas / 4px baseline).
- **Tests**: Karma/Jasmine (o el runner que defina `tech-specs.md`) para unidades críticas.
- **Commits**: Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`) en
  español colombiano.

## 5. Documentos del proyecto

| Archivo | Propósito |
|---|---|
| `PRD.md` | Requisitos de producto, audiencia, roadmap |
| `tech-specs.md` | Arquitectura técnica de referencia |
| `MEMORY.md` | Estado actual, ADRs, gotchas — leer al inicio de cada sesión |
| `TODO.md` | Motor JIT — exactamente 2 tareas atómicas activas |
| `DESIGN.md` | Design system (colores, tipografía, componentes) |
| `docs/arquitectura/` | Especificaciones de contenido y narrativa del sitio |
| `docs/proceso/` | Bitácora del proceso de diseño con IA (Stitch, prompts) |

## 6. Seguridad (OWASP)

Análisis de las categorías OWASP Top 10 (2021) más relevantes para esta arquitectura
(Angular SSR en Lambda + S3/CloudFront + futuras APIs en `api.ocastelblanco.com`).

### A01 — Pérdida de control de acceso

**Riesgo concreto:** el MVP no tiene usuarios autenticados, pero a futuro podría existir un
panel admin para gestionar contenido (proyectos, "The Lab"). Si se agrega sin control
server-side, cualquiera podría modificar contenido público.

**Regla:** cualquier endpoint que modifique datos (`POST`/`PUT`/`DELETE` en
`api.ocastelblanco.com`) debe verificar identidad **en la función Lambda**, nunca solo en
el cliente. No implementar rutas de escritura sin este control, aunque el frontend las
oculte.

### A02 — Fallas criptográficas / exposición de datos

**Riesgo concreto:** credenciales de AWS, Cloudinary y Firebase podrían filtrarse al bundle
del cliente si se referencian directamente en código de componente/servicio del navegador.

**Regla:** ninguna variable con sufijo `*_SECRET`, `*_KEY` (salvo claves explícitamente
públicas, ej. `FIREBASE_API_KEY` de cliente) puede usarse en código que se ejecute en el
navegador. Las operaciones que requieren secretos viven exclusivamente en funciones Lambda.
HTTPS obligatorio (forzado por CloudFront) en todo el sitio.

### A03 — Inyección / XSS

**Riesgo concreto:** el contenido de "The Lab" se renderiza desde Markdown/HTML; el
formulario de contacto recibe texto libre del usuario.

**Regla:**
- Prohibido usar `[innerHTML]` con contenido no saneado o `bypassSecurityTrustHtml` sobre
  input de usuario. El renderizado de Markdown debe pasar por un sanitizador (ej. `DOMPurify`
  o el sanitizador de Angular) antes de insertarse en el DOM.
- El payload de `ContactMessage` se valida y escapa **server-side** antes de reenviarlo
  (email/webhook) — nunca interpolar el mensaje directamente en HTML de notificación sin
  escapar.

### A05 — Configuración de seguridad incorrecta

**Riesgo concreto:** un bucket S3 mal configurado podría quedar con listado público o
permisos de escritura abiertos; CORS demasiado permisivo en `api.ocastelblanco.com`
permitiría que cualquier sitio consuma la API.

**Regla:**
- `serverless.yml` debe definir el bucket S3 de `cdn.ocastelblanco.com` con acceso de
  lectura pública **solo** para los objetos servidos vía CloudFront, nunca con permisos de
  escritura/listado públicos.
- CORS de API Gateway restringido a `https://ocastelblanco.com` (y subdominios de stage de
  desarrollo), nunca `*`.
- Headers de seguridad (`Content-Security-Policy`, `X-Content-Type-Options: nosniff`,
  `Referrer-Policy`) configurados en la respuesta de CloudFront/Lambda.

### A07 — Fallas de identificación y autenticación

**Riesgo concreto:** el endpoint de contacto es público y puede ser objetivo de spam/abuso
automatizado (bots).

**Regla:** el endpoint `POST /contact` debe incluir mitigación anti-abuso (rate limiting a
nivel de API Gateway/Lambda, y/o un mecanismo tipo honeypot/captcha) antes de pasar a
producción. No desplegar el formulario de contacto sin esta protección.

### A08 — Fallas de integridad de software/datos

**Riesgo concreto:** dependencias npm con vulnerabilidades conocidas podrían introducirse
sin detección.

**Regla:** el pipeline de GitHub Actions (`tech-specs.md` §7) debe ejecutar `npm audit`
(o equivalente) en cada build, y `package-lock.json` debe estar siempre commiteado. No
mezclar gestores de paquetes (solo npm).

### A10 — Server-Side Request Forgery (SSRF)

**Riesgo concreto:** ninguna funcionalidad actual recibe URLs del usuario para hacer fetch,
pero futuras integraciones (ej. importar imágenes externas a Cloudinary) podrían introducir
este vector.

**Regla:** ninguna función Lambda debe hacer `fetch`/`http.request` a una URL provista
directamente por el usuario sin validarla contra una lista explícita de dominios permitidos
(allowlist).

### Prohibiciones absolutas (seguridad)

| Acción prohibida | Por qué |
|---|---|
| Hardcodear API keys, secretos o ARNs en código fuente | Exposición de credenciales |
| Usar `[innerHTML]`/`bypassSecurityTrust*` con contenido de usuario sin sanitizar | XSS |
| CORS `*` en `api.ocastelblanco.com` | Abuso de API desde cualquier origen |
| Buckets S3 con permisos de escritura/listado públicos | Filtración o manipulación de datos |
| Desplegar `/contact` sin rate limiting/anti-spam | Abuso del endpoint público |
| `fetch` a URLs arbitrarias provistas por el usuario en Lambda | SSRF |

## Git Flow para Agentes IA

Las siguientes reglas son **obligatorias** para cualquier agente que opere en este
repositorio. No existe excepción, aunque el usuario lo solicite explícitamente.

### Ramas protegidas

Las ramas `master` y `rediseno-2026` están protegidas. **Ningún agente puede hacer commits
directos a ellas.**

> Nota: durante el bootstrap inicial del proyecto (documentación + primer boilerplate) se
> permitió commitear directamente a `rediseno-2026` por ser una rama huérfana recién creada
> sin flujo de PRs establecido todavía. A partir de que exista código funcional, esta regla
> aplica estrictamente.

### Protocolo obligatorio antes de cualquier cambio de código

**Paso 1 — Verificar la rama actual:**
```bash
git branch --show-current
```
Si el resultado es `master` o `rediseno-2026`, ejecutar el Paso 2. Si ya hay una feature
branch activa, continuar desde el Paso 3.

**Paso 2 — Crear feature branch:**
```bash
# Desde rediseno-2026 (nunca desde master)
git checkout rediseno-2026
git pull origin rediseno-2026
git checkout -b [PREFIJO]/descripcion-corta-en-kebab-case
```

Prefijos válidos:
- `feature/` — nueva funcionalidad
- `fix/` — corrección de bug
- `hotfix/` — corrección urgente (desde `master`)
- `docs/` — solo documentación
- `refactor/` — refactorización sin cambio funcional

**Paso 3 — Hacer los cambios y commitear:**
```bash
# Solo después de que el build pase sin errores
npm run build

# Si el build falla: NO commitear. Resolver los errores primero.
git add [archivos específicos]   # Nunca `git add .` o `git add -A`
git commit -m "tipo(alcance): descripción en español colombiano"
```

**Paso 4 — Crear el Pull Request al finalizar:**
```bash
git push -u origin HEAD
gh pr create \
  --base rediseno-2026 \
  --title "tipo(alcance): descripción breve" \
  --body "$(cat <<'EOF'
## Cambios realizados
- [bullet con cada cambio]

## Cómo probar
- [pasos verificables]

## Checklist
- [ ] Build pasa sin errores
- [ ] No hay secretos hardcodeados
- [ ] Seguí las convenciones de código del proyecto

🤖 Generado con Claude Code
EOF
)"
```

### Prohibiciones absolutas

| Acción prohibida | Por qué |
|---|---|
| `git push origin master` | Commit directo a producción |
| `git push --force` en cualquier rama | Destruye historial |
| `git merge` de cualquier PR | Solo humanos pueden aprobar y fusionar |
| `--no-verify` en commits o pushes | Omite hooks de seguridad |
| `git add .` o `git add -A` | Puede incluir secretos o archivos no deseados |
| Commitear `secrets.ts`, `.env`, `*.pem` | Exposición de credenciales |

### El agente NUNCA debe:
- Fusionar un PR (ni con `gh pr merge`, ni con `git merge`).
- Aprobar su propio PR.
- Cerrar un PR sin fusionar si el trabajo está completo — dejarlo abierto para revisión humana.
- Crear un PR hacia `master` directamente (siempre hacia `rediseno-2026` primero, excepto
  hotfixes documentados).
