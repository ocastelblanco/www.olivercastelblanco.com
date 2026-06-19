# The Lab y despliegue CI/CD a AWS Lambda

**Fecha:** 2026-06-18 / 2026-06-19
**Iteración:** Deploy Lambda (PR #13) + The Lab (PR #14) — MVP casi completo
**Rol de Oliver Castelblanco:** Solutions Architect — definición de requisitos, provisión
de credenciales AWS y licencia de Serverless Framework, revisión remota vía Lambda preview
URL, aprobación de PRs.
**Rol de los agentes IA:** implementación autónoma, diagnóstico iterativo de errores de CI,
verificación de build y preview.

---

## 1. Resumen ejecutivo

Esta iteración entrega dos capacidades que juntas completan la superficie visible del MVP:

1. **CI/CD con despliegue a AWS Lambda** (`feature/deploy-lambda`, PR #13): cada push a
   cualquier feature branch despliega la app automáticamente a una Lambda Function URL de
   stage `preview`, lo que permite a Oliver validar cambios remotamente sin estar frente al
   equipo de desarrollo.

2. **The Lab — Micro-blogging técnico** (`feature/the-lab`, PR #14): la cuarta sección
   de contenido del sitio, con 3 entradas estáticas de autoridad técnica sobre Angular 22,
   Prompt Engineering y Cloud Economics.

Tras esta iteración, el sitio tiene todas las secciones de contenido activas (Home,
Proyectos con 2 casos de estudio, The Lab, Contacto) y despliega automáticamente a
Lambda en cada push. Queda pendiente el único gap funcional relevante: el backend del
formulario de contacto (`POST api.ocastelblanco.com/contact`).

---

## 2. Despliegue CI/CD a AWS Lambda

### Qué se construyó

- **`serverless.yml`** (Serverless Framework v4, `nodejs24.x`, región `us-east-1`):
  - Lambda Function URL sin API Gateway — el routing Angular funciona sin el prefijo
    de stage que añade API Gateway.
  - `memorySize: 512`, `timeout: 15s`.
  - `build.esbuild` nativo de SF v4: bundle CJS, target `node24`, sin plugin externo.
  - Env `NG_ALLOWED_HOSTS: '*.lambda-url.us-east-1.on.aws'` (ver gotcha §5).

- **`lambda-handler.js`** (raíz): wrappea el `app` de Express exportado por
  `dist/ocastelblanco/server/server.mjs` con `@vendia/serverless-express`. Implementado
  en CJS (salida del bundle de esbuild), carga `server.mjs` vía `await import()`
  dinámico — Node.js 24 soporta `import()` en contexto CommonJS.

- **`.github/workflows/deploy.yml`**: se ejecuta en `push` a todas las feature branches
  y a `rediseno-2026`. Pasos: checkout → Node 24 → `npm ci` → lint → build → deploy con
  Serverless Framework. La URL del Lambda aparece en el GitHub Actions Step Summary.

### Decisión de arquitectura (ADR-009)

La Lambda Function URL fue preferida sobre API Gateway para este stage de preview porque
elimina el prefijo `/preview/` que API Gateway agrega a las rutas — el routing Angular
funciona sin cambios adicionales en `app.routes.ts`.

---

## 3. The Lab — Micro-blogging técnico

### Qué se construyó

Componente standalone `src/app/features/lab/` con:

- **Listado de 3 entradas estáticas** (temas de `docs/arquitectura/arquitectura_ocastelblanco.md` §5):
  1. *Angular 22: la herramienta secreta del Industrial Design* — Signals, zoneless, SSR
  2. *De escribir código a orquestar sistemas* — Prompt Engineering como competencia arquitectónica
  3. *OPEX al mínimo teórico: estrategias de Cloud Economics*

- **Diseño de tarjetas**: borde izquierdo `--color-secondary-container` (Electric Cyan),
  diferenciado del acento Cyber Lime usado en Proyectos. Tag de categoría en cyan,
  snippet en `--color-on-surface-variant`, fecha alineada a la derecha.

- **i18n completo** es-CO / en-US: 15 claves en el namespace `lab` (títulos con `<em>`,
  snippets, tags, fechas). Extensión del contrato TypeScript `Translations` en
  `i18n.types.ts` — el compilador verifica que ambos diccionarios estén completos.

- **Ruta `lab`** registrada con `loadComponent` (lazy) en `app.routes.ts`. Build en verde,
  6 rutas pre-renderizadas por Angular SSR.

### Decisión de diseño

Los títulos de las tarjetas incluyen `<em>` para resaltar términos técnicos en Electric
Cyan. Se renderizan vía `[innerHTML]` —aceptable aquí porque el contenido proviene de los
diccionarios TypeScript del propio proyecto, no de input de usuario. No se usa
`bypassSecurityTrustHtml` (que desactivaría el sanitizador de Angular). El sanitizador
de Angular permite `<em>` por defecto, por lo que este patrón es seguro.

---

## 4. Orquestación y flujo de trabajo IA

### CI/CD (PR #13) — 5 iteraciones hasta el deploy verde

El proceso de CI no fue lineal: requirió 5 ciclos de diagnóstico + fix entre el primer
push y el deploy verificado:

| Iteración | Error | Fix |
|---|---|---|
| 1 | Secrets vacíos en GitHub Actions | Oliver crea `AWS_ACCESS_KEY_ID` y `AWS_SECRET_ACCESS_KEY` en GitHub; re-run manual |
| 2 | SF v4 requiere licencia en CI no interactivo | Oliver obtiene licencia gratuita; agrega `SERVERLESS_LICENSE_KEY` |
| 3 | `serverless-esbuild` conflicta con el esbuild nativo de SF v4 | Remover plugin; mover config a `build.esbuild` nativo |
| 4 | `outputFileExtension` no es una opción de esbuild nativo | Cambiar `format: esm` → `format: cjs`; usar `await import()` para cargar ESM desde CJS |
| 5 | `AngularNodeAppEngine` rechaza el header `host` de la Lambda URL | Agregar `NG_ALLOWED_HOSTS: '*.lambda-url.us-east-1.on.aws'` en el environment Lambda |

El diagnóstico fue iterativo: cada error fue detectado leyendo los logs de GitHub Actions
(via `gh run view --log`) y corrigiéndolo en el archivo correspondiente antes del siguiente
push. Sin acceso directo a la consola de AWS, el ciclo de feedback fue: push → CI → log →
diagnóstico → fix → push.

### The Lab (PR #14) — Una sola iteración

El componente se entregó en un único ciclo sin errores: la estructura de i18n ya estaba
establecida por los componentes anteriores, el patrón de componente standalone era
conocido y el build fue verde en el primer intento.

---

## 5. Gotchas y aprendizajes

### Serverless Framework v4 requiere licencia para CI

SF v4 dejó de ser gratuito para uso no interactivo. Sin `SERVERLESS_LICENSE_KEY` en el
entorno de CI, el proceso termina silenciosamente con exit code 0 aparente pero sin
desplegar nada. La solución es registrarse en serverless.com para obtener una licencia
gratuita y agregarla como secret en GitHub Actions.

**Detectado:** el workflow tardaba ~3 segundos (imposiblemente rápido para un deploy real)
y no producía output de URL. Al cambiar el script de `$(npx serverless deploy ...)` a
`npx serverless deploy 2>&1 | tee /tmp/sls-output.txt` con captura de `${PIPESTATUS[0]}`,
el error de licencia fue visible en los logs.

### `serverless-esbuild` es incompatible con Serverless Framework v4

SF v4 incluye esbuild de forma nativa y lanza `ServerlessError2` al detectar el plugin
`serverless-esbuild`. La configuración correcta para v4 es bajo la clave `build.esbuild`
en `serverless.yml` (no bajo `custom.esbuild`). La opción `outputFileExtension` es
específica del plugin y no existe en la API nativa de esbuild — causa error al usarla.

### `AngularNodeAppEngine` valida el header `host` por seguridad

`@angular/ssr/node` valida que el header `host` de cada request pertenezca a una lista de
hosts permitidos (`getAllowedHostsFromEnv()`). El dominio de una Lambda Function URL
(`*.lambda-url.us-east-1.on.aws`) no está en la lista por defecto. La variable de entorno
`NG_ALLOWED_HOSTS` (comma-separated, soporta wildcards `*.dominio`) agrega dominios a
esa lista sin modificar `server.ts`.

El síntoma fue sutil: el favicon cargaba correctamente (Express sirve los assets estáticos
antes de pasar el request a Angular) pero todas las rutas HTML devolvían error. Esto
permitió aislar el problema en el handler Angular (no en la Lambda ni en Express).

### Dynamic `import()` desde CJS para cargar módulos ESM

El build de Angular SSR produce `server.mjs` en formato ESM. esbuild con `format: cjs`
no puede hacer un `require()` estático de un módulo ESM, pero sí puede ejecutar un
`await import()` dinámico — esta es una característica de Node.js (soportada desde v12,
estable en v24). El handler usa esta técnica para cachear el `app` de Express en una
variable de módulo (sin reconstruirlo en cada invocación Lambda).

---

## 6. Qué sigue

Según el motor JIT (`TODO.md`), las dos tareas activas son:

1. **Endpoint backend Terminal de contacto** (`POST api.ocastelblanco.com/contact`):
   nueva función Lambda `contact` en `serverless.yml`, validación server-side, rate
   limiting (OWASP A07), CORS restringido a `https://ocastelblanco.com`. Esta tarea
   cierra el único gap funcional del MVP.
2. **Deploy de producción** (`serverless.yml` stage `production`): configuración de
   `ocastelblanco.com` apuntando a Lambda + CloudFront + S3 para assets estáticos.
   Cierra el ciclo del MVP haciendo el sitio rediseñado accesible públicamente.

La siguiente entrada de esta bitácora se escribirá al cerrar el backend de contacto
(primer endpoint de `api.ocastelblanco.com` en producción) o el deploy de producción.
