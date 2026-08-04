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

## Tarea 1 — [INFRA]: Nuevo flujo CI/CD — PR abre `preview`, merge a `main` despliega `production`

**Origen:** paso 6 de la secuencia hacia el switch (`MEMORY.md` §2, ADR-013). El workflow
actual (`deploy.yml`) dispara el deploy a `preview` en cada `push` a `rediseno-2026` y a
ramas `feature/**` — no existe todavía ningún job que despliegue a `production`. El flujo
que el usuario definió (PR abierto → `preview`; PR fusionado a `main` → `production`)
requiere cambiar el trigger de `push` a `pull_request` y agregar el job de producción.

**Archivos:** `.github/workflows/deploy.yml`.

**Qué hacer:**
1. Cambiar el trigger del job de `preview` de `push` (sobre ramas `feature/**` etc.) a
   `pull_request` (`opened`, `synchronize`, `reopened`) contra la rama base vigente —
   `rediseno-2026` hoy, `main` tras el renombrado (Tarea pendiente, paso 7).
2. Agregar un job `deploy-production` disparado por `push` a la rama de producción
   (equivalente a "merge de PR" en GitHub Actions — un merge de PR genera un push a la
   rama base).
3. El job de `production` usa `npm run build` (configuración `production` por defecto,
   ya correcto desde la tarea de base multi-stage) y
   `npx serverless deploy --stage production`.
4. `LAB_PUBLISH_TOKEN` de producción sigue vacío hoy (se desplegó así manualmente, ver
   historial de "Base multi-stage") — este job por fin lo resuelve inyectando el secret
   real de GitHub Actions también para `production`.
5. Mantener el job de `preview` funcionando igual (mismo secret, misma lógica de
   impresión de URL en el Step Summary).

**Definition of done:**
- [ ] Abrir un PR contra la rama base dispara **solo** el deploy a `preview` (no a `production`)
- [ ] Un merge a la rama de producción dispara **solo** el deploy a `production`
- [ ] El Lambda de `production` queda con `LAB_PUBLISH_TOKEN` real tras el primer deploy vía este workflow
- [ ] `npm run lint` y `npm run build` siguen corriendo antes del deploy en ambos jobs
- [ ] Documentado en `MEMORY.md` ADR-013 el estado final del workflow

---

## Tarea 2 — [INFRA]: Renombrar `master` → `main` y reemplazar su contenido con `rediseno-2026`

**Origen:** paso 7 de la secuencia hacia el switch (`MEMORY.md` §2, ADR-013). Objetivo del
día definido por el usuario: `rediseno-2026` reemplaza completamente a la rama de
producción, que además pasa a llamarse `main`. Depende de la Tarea 1 (el nuevo flujo
CI/CD debe apuntar a `main` antes de que `main` exista con el contenido correcto, para
evitar una ventana sin CI funcionando).

**Archivos:** ninguno de código — operación de Git/GitHub (ramas, default branch,
protecciones), más `CLAUDE.md` (referencias a `master`/`rediseno-2026` en el git flow).

**Qué hacer:**
1. Confirmar con el usuario el momento exacto de ejecutar esto — es una operación sobre
   la estructura del repo, no reversible con un simple revert (ver Prohibiciones de
   `CLAUDE.md`: ningún push directo a ramas protegidas, y esto redefine cuál es la rama
   protegida).
2. Crear `main` a partir del contenido actual de `rediseno-2026` (`git push origin
   rediseno-2026:main` o equivalente) — **no** un rename de `rediseno-2026` en sí, para no
   perder la trazabilidad de las 40+ tareas ya documentadas contra ese nombre de rama.
3. Cambiar el default branch del repositorio en GitHub de `master` a `main`
   (`gh repo edit --default-branch main`).
4. Actualizar las reglas de protección de rama: `main` protegida (regla que hoy tiene
   `master`), `rediseno-2026` deja de ser rama protegida de larga vida.
5. Actualizar `CLAUDE.md` §"Git Flow para Agentes IA": reemplazar las referencias a
   `master`/`rediseno-2026` como ramas protegidas por `main` únicamente; quitar las notas
   condicionales ("hoy `rediseno-2026`, tras el renombrado `main`") que ya no aplican.
6. `master` (el sitio anterior) **no se borra** — queda como referencia histórica/rollback,
   ya no como default branch ni protegida activamente.
7. Verificar que el workflow de CI/CD (Tarea 1, ya fusionada) funciona correctamente
   contra `main` antes de dar la tarea por cerrada.

**Definition of done:**
- [ ] `main` existe en GitHub con el contenido de `rediseno-2026`, es el default branch y la rama protegida
- [ ] `rediseno-2026` deja de ser la rama base de nuevos PRs
- [ ] `master` sigue existiendo (rollback), pero no es default ni recibe nuevos PRs
- [ ] `CLAUDE.md` actualizado sin referencias condicionales a `master`/`rediseno-2026`
- [ ] Un PR de prueba contra `main` dispara el deploy a `preview` correctamente (Tarea 1 ya fusionada)

---

## Historial de tareas completadas

### 2026-08-04 — [INFRA]: CloudFront Function de 301 — `olivercastelblanco.com` → dominio canónico

Implementado el paso 5 de la secuencia hacia el switch (ADR-012). CloudFront Function
`olivercastelblanco-redirect` (`cloudfront-js-2.0`, evento `viewer-request`): si `Host` es
`olivercastelblanco.com` o `www.olivercastelblanco.com`, responde `301` hacia el mismo
host equivalente bajo `ocastelblanco.com` preservando path y querystring; cualquier otro
host pasa sin modificarse. Probada con `aws cloudfront test-function` (3 casos) antes de
publicarla y asociarla — solo al behavior por defecto de `E1MX0LNEKZOG8H`, sin tocar
`/content/*`, el origen ni los 4 alias. Verificado en vivo: los 4 hostnames responden
correctamente, sitio anterior sin cambios. Hallazgo durante la verificación (no es
regresión de esta tarea): la distribución ya tenía `CustomErrorResponses` (403/404 →
`/index.html`, `200`) desde el sitio anterior — un objeto faltante en `/content/*`
devuelve el `index.html` del sitio viejo en vez de un `404` limpio, documentado como
gotcha en `MEMORY.md` §7. Sin cambios en `serverless.yml` ni código de aplicación.

### 2026-08-04 — [INFRA]: CloudFront sirve `/content/*` (OAC + behavior, acotado)

Implementado el paso 4 de la secuencia hacia el switch, **con alcance reducido** respecto
al plan original (ver ADR-012, revisión 2026-08-04): se detectó que el sitio anterior
sirve `main.*.js`/`styles.*.css`/etc. en la raíz con el mismo patrón de hash que usa
Angular — un behavior amplio `*.js`/`*.css` en la distribución en vivo habría roto esos
assets de inmediato. Se acotó a `/content/*` únicamente (path que el sitio anterior no
usa) tras validar el hallazgo con el usuario. Creada la Origin Access Control
`ocastelblanco-cdn-production-oac` (`E31BG8XJQBYR7A`); agregado un origen nuevo
(`S3-ocastelblanco-cdn-production`, vía OAC) y un behavior nuevo (`/content/*`,
`CachePolicyId` managed `CachingDisabled`) a la distribución `E1MX0LNEKZOG8H` sin tocar el
origen original, el behavior por defecto ni los 4 alias. Bucket policy en
`ocastelblanco-cdn-production` con `s3:GetObject` para `cloudfront.amazonaws.com`
condicionado a `AWS:SourceArn` — verificado que los 4 flags de
`PublicAccessBlockConfiguration` siguen en `true` (no cuenta como política pública).
Verificado en vivo: `/content/lab.json` responde `200` vía CloudFront con un objeto de
prueba; acceso directo al bucket devuelve `403`; el sitio anterior respondió exactamente
igual antes y después del cambio (`curl` sobre home, `main.js`, `styles.css`). Sin cambios
en `serverless.yml` ni código de aplicación — toda la configuración vive en la
distribución, gestionada manualmente (ADR-012).

### 2026-08-04 — [FEATURE]: The Lab → S3 real (cierra el gap de ADR-011)

Implementado el paso 3 de la secuencia hacia el switch. `lab-handler.mjs`: escritura real
a `CONTENT_BUCKET/content/lab.json` con `@aws-sdk/client-s3` (`PutObjectCommand`),
reemplazando el stub. Invalidación de CloudFront condicional
(`@aws-sdk/client-cloudfront`, `CreateInvalidationCommand`) — se omite sin fallar si
`CLOUDFRONT_DISTRIBUTION_ID` está vacío (el caso hoy, para ambos stages); un fallo de
invalidación tampoco hace fallar el request, ya que la escritura a S3 se confirma antes.
Rol IAM dedicado `LabLambdaRole` (mismo patrón que `ContactLambdaRole`): solo logs +
`s3:PutObject` acotado a `/content/*` del bucket del propio stage + `cloudfront:CreateInvalidation`
acotado a la distribución conocida (`E1MX0LNEKZOG8H`). Desplegado a `preview` vía el
workflow existente y verificado en vivo contra `preview-api.ocastelblanco.com`: token
inválido/ausente → `401` sin escribir; payload inválido con token válido → `400` sin
sobrescribir (`ETag` verificado antes/después); payload válido con token real →
`200 {"ok":true,"received":1}` con el objeto confirmado en S3 (contenido y `ContentType`
correctos, `aws s3api get-object`). Objeto de prueba borrado al terminar. `npm run build`
y `npm run lint` en verde.

### 2026-08-04 — [FEATURE]: Terminal de contacto funcional (SES) + rate limiting

Implementado ADR-014. `contact-handler.mjs` entrega el mensaje vía `@aws-sdk/client-sesv2`
(`SendEmailCommand`): `contacto@ocastelblanco.com` → `ocastelblanco@gmail.com`, `Reply-To`
al email del visitante (ya validado contra `EMAIL_RE`, sin riesgo de inyección de headers).
Cuerpo en texto plano (A03); el `Subject` sanea saltos de línea del campo `name` porque
viaja como header de correo. Rol IAM dedicado `ContactLambdaRole` (solo logs +
`ses:SendEmail` acotado a `arn:aws:ses:${aws:region}:${aws:accountId}:identity/ocastelblanco.com`,
A01) reemplazando el rol compartido del servicio solo para esta función. Rate limiting
(A07): `provider.httpApi.throttle` (`burstLimit: 10`, `rateLimit: 5`, aplica a toda la HTTP
API compartida con `/lab`) + `reservedConcurrency: 5` en `contact`. Honeypot existente sin
cambios. Desplegado a `preview` vía el workflow de GitHub Actions y verificado en vivo
contra `preview-api.ocastelblanco.com`: honeypot devuelve `200` sin invocar SES, payload
inválido devuelve `400`, mensaje válido de prueba devolvió `200 {"ok":true}` con el envío
confirmado en CloudWatch (sin `contact_send_failed`, 332ms). Rol y concurrencia reservada
verificados con `aws lambda get-function-concurrency` (gotcha nuevo:
`get-function-configuration` no expone `ReservedConcurrentExecutions`). `npm run build`,
`npm run build:preview` y `npm run lint` en verde.

### 2026-08-04 — [INFRA]: Base multi-stage — separar `preview` de `production`

Prerequisito bloqueante del switch a producción (ADR-012, ADR-013). `serverless.yml` tenía
`domainName: api.ocastelblanco.com` fijo para cualquier stage; hoy lo tenía tomado
`preview`. Resuelto con `custom.domains` por stage (`${self:custom.domains.${sls:stage}}`):
`production` → `api.ocastelblanco.com`, `preview` → `preview-api.ocastelblanco.com` (nuevo
dominio creado con `npx sls create_domain --stage preview`, certificado wildcard
`*.ocastelblanco.com` ya existente en ACM, sin emitir uno nuevo). Buckets de contenido por
stage creados vía `resources.Resources.ContentBucket` en `serverless.yml`
(`ocastelblanco-cdn-production` / `-preview`, sin puntos en el nombre, 100% privados con
`PublicAccessBlockConfiguration` y `DeletionPolicy: Retain`). CORS de `contact-handler.mjs`
y `lab-handler.mjs`: la allowlist hardcodeada pasa a `ALLOWED_ORIGINS`/
`ALLOWED_ORIGIN_REGEX` inyectadas por stage — `preview` sigue aceptando su propia Lambda
Function URL (ambiente permanente, ADR-013), corrigiendo el plan anterior que mandaba
eliminarla. Corregido un **bug latente**: `angular.json` no tenía `fileReplacements`, así
que `environment.prod.ts` era código muerto y todos los builds (incluido producción) usaban
`environment.ts`; agregadas configuraciones `production` y `preview` con sus
`fileReplacements` correspondientes (verificado con `grep` sobre los bundles: cada config
compila la URL de API y el `labContentUrl` correctos). `environment.prod.ts.labContentUrl`
corregido a `/content/lab.json` (same-origin, `cdn.ocastelblanco.com` descartado por
ADR-012). `deploy.yml` usa `npm run build:preview` en vez del build de producción por
defecto.

**Desplegado y verificado en AWS:** preview vía el workflow existente (creó
`preview-api.ocastelblanco.com` + `ocastelblanco-cdn-preview`); production con
`npx sls deploy --stage production` manual (operación puntual autorizada explícitamente,
ver `CLAUDE.md` — creó `ocastelblanco-cdn-production` y el HTTP API
`production-ocastelblanco-com`). El dominio `api.ocastelblanco.com` estaba tomado por el
`ApiMapping` viejo de `preview`; se liberó (`delete-api-mapping`) y se remapeó de inmediato
a `production` (`create-api-mapping`) — swap autorizado explícitamente por el usuario, sin
downtime real (se confirmó primero que el sitio anterior, aunque llama a
`api.ocastelblanco.com/mensaje`, ya recibía 404 ahí desde antes de esta tarea — dominio
reutilizado desde ADR-009, sin relación con este cambio). Verificado: ambos dominios
responden por separado, CORS correcto en ambos stages (incluye `www.ocastelblanco.com` en
producción), ambos buckets con `PublicAccessBlockConfiguration` completo, Function URL de
`production` sirve las 4 rutas probadas (`/`, `/proyectos`, `/lab`, `/contacto`) con
`<title>` correcto. Aún sin tocar DNS ni CloudFront — el sitio en vivo sigue sirviendo
desde `E1MX0LNEKZOG8H` sin cambios. `npm run build`, `npm run build:preview` y `npm run
lint` en verde localmente. PR #22 (rama `feature/base-multi-stage`).

### 2026-07-11 — [FEATURE]: Arquitectura de contenido — separar contenido de UI (Casos de estudio + The Lab)

Implementado ADR-011 (estrategia híbrida). `ContentService` (`src/app/core/content/`,
signals) como fuente única de contenido. **Casos de estudio**: interfaz `CasoDeEstudio`
bilingüe, contenido de ConectaTech y Le Tiende migrado de los diccionarios i18n a
`src/assets/content/casos/*.json`; Registro de Proyectos y páginas de detalle ahora iteran
sobre `content.getCasos()`/`getCaso(slug)` en vez de texto hardcodeado. **The Lab**:
contrato `LabEntry`, mini-parser propio `renderMarkdownLite()` (subset seguro: negrita,
itálica, tachado, enlaces — HTML fuente escapado antes del marcado, sin
`bypassSecurityTrustHtml`), fixture `public/content/lab.dev.json` en dev,
`environment.labContentUrl` apunta a `cdn.ocastelblanco.com/lab.json` en producción.
Endpoint `POST /lab` (`src/lambda/lab-handler.mjs`) valida token (`x-lab-token`) y esquema
del payload — stub, aún no escribe a S3 (ver Tarea 1 vigente). `LAB_PUBLISH_TOKEN` agregado
al deploy en `.github/workflows/deploy.yml`. Flujo operativo documentado en
`docs/proceso/apps-script-lab.md` (Google Sheets + Apps Script para The Lab) y
`docs/proceso/publicar-casos-de-estudio.md` (flujo de PR para un nuevo caso). Diccionarios
i18n limpiados de contenido migrado. `npm run build` y `npm run lint` en verde. PR #17
fusionada. **Gap conocido:** el fetch de Lab en `ContentService` solo corre en el
navegador — el SSR no incluye las entradas de Lab en el HTML inicial (ver ADR-011).

### 2026-06-22 — [FEATURE]: SEO técnico básico (JSON-LD + meta tags + sitemap)

`SeoService` (`providedIn: 'root'`) en `src/app/core/seo/seo.service.ts`: inyecta `Meta` y
`Title` de `@angular/platform-browser`, expone `update(title, description)` que actualiza
`<title>`, `og:title`, `og:description`, `twitter:title` y `twitter:description` por ruta.
JSON-LD `Person` (nombre, jobTitle, url, sameAs GitHub/LinkedIn) y `WebSite` (name, url)
inyectados en `<head>` vía `inject(DOCUMENT)` en el constructor de `AppComponent` — SSR-safe,
aparecen en el HTML pre-renderizado. Meta tags base Open Graph y Twitter Card añadidos a
`src/index.html` (description, og:type/url/site_name/image, twitter:card/image). `SeoService`
invocado en `ngOnInit` de los 6 componentes de página (Home, Proyectos, ConectaTech, LeTiende,
Lab, Contacto) con título y description únicos por ruta. `public/sitemap.xml` estático con
las 6 rutas pre-renderizadas y `<lastmod>2026-06-22`. `npm run build` en verde (6 rutas
pre-renderizadas); meta tags y JSON-LD verificados con `grep` en el HTML SSR.

### 2026-06-19 — [FEATURE]: Endpoint backend Terminal de contacto

Lambda handler `src/lambda/contact-handler.mjs` con validación server-side (nombre ≥2
chars, email RFC válido, mensaje ≥10 chars), honeypot anti-spam (campo `website` oculto),
log a CloudWatch. CORS dinámico en handler: permite `https://ocastelblanco.com` (producción)
y `*.lambda-url.us-east-1.on.aws` (preview). `serverless.yml`: función Lambda `contact`
con `httpApi` events (`POST` y `OPTIONS /contact`), `serverless-domain-manager` v10 con
`api.ocastelblanco.com` como dominio personalizado regional (Route 53 + ACM `*.ocastelblanco.com`).
Angular: `provideHttpClient(withFetch())` en `app.config.ts`, `ContactService`, `submit()`
usa HTTP real con signals `loading`/`sendError`. i18n: claves `sending` y `error_send`.
`environment.ts` apunta a `https://api.ocastelblanco.com`. `npm run build` en verde.
PR #15 fusionada. **Pendiente para producción:** eliminar `LAMBDA_URL_RE` del handler.

### 2026-06-19 — [FEATURE]: The Lab — Micro-blogging técnico (listado estático)

Componente standalone `src/app/features/lab/` con listado de 3 entradas estáticas
(Angular 22, Prompt Engineering, Cloud Economics — temas de `docs/arquitectura §5`).
Tarjetas con borde izquierdo Electric Cyan, tag en cyan, snippet en variante, fecha
alineada a la derecha. i18n completo en 15 claves bajo namespace `lab` en `i18n.types.ts`
y ambos diccionarios (es-CO / en-US). Títulos con `<em>` renderizados vía `[innerHTML]`
(contenido de diccionarios propios — seguro). Ruta `lab` registrada con `loadComponent`
en `app.routes.ts`. Build en verde, 6 rutas pre-renderizadas. PR #14 fusionada.

### 2026-06-18 — [FEATURE]: Despliegue CI/CD a AWS Lambda (stage `preview`)

`serverless.yml` (Serverless Framework v4, `nodejs24.x`, `us-east-1`, Lambda Function URL,
`memorySize: 512`, `timeout: 15s`). `lambda-handler.mjs` (raíz): importa `app` de Express
compilado desde `dist/ocastelblanco/server/server.mjs` y lo wrappea con
`@vendia/serverless-express`. `src/server.ts`: añadido `export { app }` para el handler.
`.github/workflows/deploy.yml`: deploy a stage `preview` en cada push a feature branches y
`rediseno-2026`; URL del Lambda impresa en Step Summary. `.gitignore`: añadidos
`.serverless/` y `.esbuild/`. `npm run build` en verde localmente. Requiere secrets
`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` y `SERVERLESS_LICENSE_KEY` en GitHub Actions
(configurados). `NG_ALLOWED_HOSTS: '*.lambda-url.us-east-1.on.aws'` añadido para que
`AngularNodeAppEngine` acepte el dominio de la Lambda Function URL (seguridad de host). PR
#13 fusionada.

### 2026-06-18 — [FEATURE]: Terminal de contacto

Componente standalone `src/app/features/contacto/` con Angular Reactive Forms, validación
client-side (campos requeridos, `Validators.email`, `Validators.minLength`), estética
terminal/CLI (inputs con `border-bottom` único, fondo transparente, JetBrains Mono, botón
de submit en `--color-primary-container`). Estado de éxito mock con `signal<boolean>` +
bloque `@if (sent())`. Ruta `contacto` registrada con `loadComponent` en `app.routes.ts`.
Claves i18n `contacto.*` (15 claves: labels, placeholders, errores, success state) en ambos
diccionarios. `npm run build` y `npm run lint` en verde. PR #12 fusionada.

### 2026-06-18 — [FEATURE]: Página de detalle — Le Tiende — Comandante

Componente standalone `src/app/features/proyectos/le-tiende/` con hero Metric-First
(`$0.50/mes` en Electric Cyan), secciones Desafío / Enfoque / Impacto y footer de stack.
Acento de borde izquierdo en Electric Cyan (diferenciado de ConectaTech en Cyber Lime).
Ruta lazy `proyectos/le-tiende` registrada en `app.routes.ts`. Enlace "Ver caso →" añadido
a la card Le Tiende en el Registro de Proyectos. Claves i18n `lt_challenge`, `lt_approach`,
`lt_impact_1/2` en tipos y diccionarios. `npm run build` y `npm run lint` en verde.
PR #11 fusionada.

### 2026-06-17 — [FEATURE]: Página de detalle — Caso de Estudio ConectaTech

Componente standalone `src/app/features/proyectos/conectatech/` con hero Metric-First
(`-80%` en Cyber Lime), secciones Desafío / Enfoque / Impacto y footer de stack (Electric
Cyan). Ruta lazy `proyectos/conectatech` registrada en `app.routes.ts`. Enlace "Ver caso →"
añadido a la card ConectaTech en el Registro de Proyectos. Claves i18n compartidas para
páginas de detalle (`back`, `view_case`, etiquetas de sección) en ambos diccionarios. `npm
run build` y `npm run lint` en verde. PR #10 fusionada.

### 2026-06-17 — [FEATURE]: Registro de Proyectos (Project Registry)

Componente standalone `src/app/features/proyectos/` con grid de dos tarjetas Metric-First:
ConectaTech (-80% staff requirements, borde Cyber Lime) y Le Tiende — Comandante
($0.50/mo OPEX). Métricas en Cyber Lime, stack en Electric Cyan, acento de borde izquierdo
por tarjeta. Layout horizontal 2 columnas en desktop, apilado en ≤720px. Diccionarios
`es-CO` y `en-US` ampliados con namespace `proyectos` (12 claves). Ruta `proyectos`
registrada con `loadComponent`. Título `index.html` corregido a "Oliver Castelblanco".
`npm run build` y `npm run lint` en verde. PR #9 fusionada.

### 2026-06-17 — [FEATURE]: Home — "El Manifiesto del Fixer"

Componente standalone `src/app/features/home/` con hero (headline en dos partes: marca
"The Fixer:" en Cyber Lime hardcodeada + resto traducido) y tres pilares de valor
(Efficiency / Architecture / Design) como cards con tokens del design system. Ruta `''`
registrada con `loadComponent` (lazy) en `app.routes.ts`. Soporte de etiquetas básicas de
formato (`<em>`, `<strong>`) en strings de traducción vía `[innerHTML]` con sanitización
automática de Angular (sin `bypassSecurityTrustHtml` — contenido proviene de nuestros
propios diccionarios TypeScript, no de input de usuario). Diccionarios `es-CO` y `en-US`
ampliados con namespace `home` (8 claves tipadas). `npm run build`, `npm run lint` y
verificación visual en verde. PR #8 fusionada.

### 2026-06-13 — [FEATURE]: Internacionalización (i18n) — es-CO / en-US con cambio inmediato

`TranslationService` propio basado en Signals (`src/app/core/i18n/`): diccionarios
TypeScript tipados para `es-CO` y `en-US`, detección inicial desde `localStorage` →
`navigator.language` → `'en-US'` (SSR-seguro). Componente standalone `LangSwitcher`
(`src/app/shared/shell/lang-switcher/`) con dropdown en esquina superior derecha del topbar,
diseñado con los tokens del design system (JetBrains Mono, `--radius: 0px`, paleta oscura
+ Cyber Lime para activo). `Topbar` y `Sidebar` inyectan `TranslationService`; sus
plantillas usan `trans.t('key')` que se re-evalúan automáticamente al cambiar el signal
`currentLocale`. Cambio de idioma es inmediato (sin recarga), persiste en `localStorage` y
actualiza `document.documentElement.lang`. `npm run build` y `npm test` en verde.
`MEMORY.md` actualizado (ADR-008).

### 2026-06-13 — [FIX]: Identidad visual corporativa — Fix de paths sin relleno y regeneración de bitmaps

El usuario corrigió por su cuenta los SVG de `brand/` (dos paths de las letras "OC" sin
`fill`). A partir de `brand/OC_logo_fondo.svg` corregido (optimizado con `svgo`, -28.1%)
se regeneraron solo los binarios del kit (`brand/kit/*.png`, `favicon.ico`,
`icon-512.webp`) sin tocar SVG/MD/HTML, y se actualizaron los favicons en `public/`.
`npm run build` verificado en verde. `MEMORY.md` actualizado (ADR-007, nueva revisión).

### 2026-06-12 — [FIX]: Identidad visual corporativa — Variantes monocromáticas (icon/logo-full mono black/white)

El usuario proporcionó `brand/OC_logo_alpha.svg` (emblema "OC" sin fondo) para regenerar
`brand/kit/icon-mono-black.svg`, `icon-mono-white.svg`, `logo-full-mono-black.svg` y
`logo-full-mono-white.svg`, que antes conservaban los colores originales. Regenerados
reemplazando todos los `fill:#XXXXXX`/`stroke:#XXXXXX` por `#000000` o `#ffffff` y
optimizando con `svgo` (-30.7%). `npm run build` verificado en verde. `MEMORY.md`
actualizado (ADR-007, nueva revisión).

### 2026-06-12 — [FIX]: Identidad visual corporativa — Logo maestro (segunda corrección: fondo + loader animado por gradientes)

El usuario tampoco aceptó el kit anterior (sin fondo) y proporcionó un nuevo master,
`brand/OC_logo_fondo.svg` (emblema "OC" + `<circle>` de fondo + 4 `<linearGradient>`
`_Linear0.._Linear3`), reemplazando a `brand/OC_logo.svg` (eliminado). Optimizado con
`svgo` (-28.3%) y regenerado el kit completo (24 archivos en `brand/kit/`) vía el mismo
script `exportBrandKit` por `node`. `brand/isotype.svg` = copia del SVG con fondo
optimizado. Favicons en `public/` regenerados y verificados legibles a 16/32px. Nuevo
`brand/loader.svg`: 4 copias del `<circle>` de fondo, cada una con un `<linearGradient>`
distinto (`_Linear0.._Linear3`) y `<animate>` de `opacity` con `calcMode="linear"` para
crossfade continuo entre los 4 gradientes (0.5s por transición, ciclo 2s,
`repeatCount="indefinite"`); el grupo "forma" queda fijo encima. `npm run build`
verificado en verde. `MEMORY.md` actualizado (ADR-007, nueva revisión).

### 2026-06-12 — [FEATURE]: Identidad visual corporativa — Logo maestro (Fase 1: LogoLoom)

MCP `logoloom` configurado en `.mcp.json` y usado para procesar el logo. Diseñado el
monograma "OC" (anillo cuadrado blanco + bracket Cyber Lime + acento Electric Cyan) sobre
Deep Charcoal, validado con el usuario entre 3 conceptos. Generados: `brand/isotype.svg`
(+ `isotype-light.svg`), `brand/logo-full.svg` (wordmark "OLIVER CASTELBLANCO" / "THE FIXER"
convertido a paths con `text_to_path`), `brand/favicon-mark.svg` y `brand/loader.svg`
(progress loader animado con `animateMotion`). Exportado kit completo de 25 archivos a
`brand/kit/` con `export_brand_kit` (PNG 16-1024px, ICO, WebP, OG images, `BRAND.md`).
Favicons aplicados en `public/` (favicon.ico, favicon-16x16, favicon-32x32,
apple-touch-icon, android-chrome-192/512) y enlaces + `site.webmanifest` actualizados en
`src/index.html`. `npm run build` verificado en verde dos veces. `MEMORY.md` actualizado
(ADR-007) con el paso manual pendiente de Taskade.

### 2026-06-12 — [FIX]: Identidad visual corporativa — Logo maestro (corrección con diseño del usuario)

El usuario rechazó el concepto "Monograma OC" anterior y proporcionó su propio logo
maestro (`brand/OC_logo.svg`, emblema circular "OC" con motivo de circuito impreso).
Eliminados todos los archivos previos de `brand/` excepto `OC_logo.svg`. Optimizado con
`svgo` (-31.8%) y exportado el kit completo (24 archivos) a `brand/kit/` invocando
`exportBrandKit` de `@mcpware/logoloom` directamente desde `node` (el SVG de 92KB excede
el límite de parámetros MCP). `brand/isotype.svg` = copia del logo maestro.
`brand/loader.svg` nuevo (anillo + "OC" con pulso + arco cian rotatorio). Favicons en
`public/` regenerados desde `brand/kit/icon-*.png`, legibles incluso a 32px. `npm run
build` verificado en verde. `MEMORY.md` actualizado (ADR-007, nota de revisión).

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

### 2026-06-12 — [FEATURE]: Shell de navegación responsive (sidebar → barra inferior en móvil)

En viewports `≤720px` la `Sidebar` se convierte en una barra de navegación inferior fija
(56px de alto, iconos + etiquetas apiladas); `Topbar` y `.app-content` ajustan sus
márgenes/padding. Documentado como requisito no funcional en `PRD.md` §8 y como ADR-005 en
`MEMORY.md`. `npm run build` y `npm test -- --watch=false` (4/4) sin errores.

### 2026-06-12 — [FEATURE]: CI con GitHub Actions (lint + build + test)

Creado `.github/workflows/ci.yml`, ejecutado en `push`/`pull_request` sobre `master` y
`rediseno-2026`: Node 22 + cache npm → `npm ci` → `npm run lint` → `npm run build` → `npm
test -- --watch=false`. Se instaló `@angular-eslint/schematics` (genera `eslint.config.js`
y agrega el builder `lint` a `angular.json`). Sin pasos de despliegue. `npm run lint`,
`npm run build` y `npm test -- --watch=false` verificados localmente en verde. `MEMORY.md`
actualizado (§1, §2, §3 ADR-006, §4, §6, §8, §9).

## Log del motor JIT

| Fecha | Comparación PRD vs. MEMORY | Resultado |
|---|---|---|
| 2026-08-04 (6) | CloudFront Function de 301 completada y verificada en AWS real (probada con `aws cloudfront test-function` antes de asociarla, sitio anterior sin cambios). Siguiente prioridad: Nuevo flujo CI/CD (ya seleccionada como Tarea 2, sin dependencias pendientes) pasa a Tarea 1. Para la nueva Tarea 2 se prioriza "Renombrar master → main" (paso 7 de la secuencia en `MEMORY.md` §2): depende de que el nuevo flujo CI/CD ya apunte a `main` para evitar una ventana sin CI funcionando, por lo que queda en el slot 2 hasta que la Tarea 1 se complete | Tarea 1 (CloudFront Function 301) movida al historial. Tarea 2 (Nuevo flujo CI/CD) pasa a ser Tarea 1. Nueva Tarea 2: Renombrar master → main |
| 2026-08-04 (5) | Assets + behaviors de CloudFront ejecutada con alcance reducido a `/content/*` tras detectar que un behavior amplio `*.js`/`*.css` habría roto el sitio en vivo (mismo patrón de nombres con hash) — aprobado por el usuario antes de tocar la distribución. Completada y verificada en AWS real (OAC, bucket policy condicionada, sitio anterior sin cambios). Siguiente prioridad: CloudFront Function de 301 (ya seleccionada como Tarea 2, sin dependencias pendientes) pasa a Tarea 1. Para la nueva Tarea 2 se prioriza "Nuevo flujo CI/CD" (paso 6 de la secuencia en `MEMORY.md` §2): es independiente de la Tarea 1 (ambas tocan la distribución/el pipeline pero configuran cosas distintas) y resuelve un pendiente conocido (`LAB_PUBLISH_TOKEN` vacío en `production`) | Tarea 1 (Assets + behaviors CloudFront) movida al historial. Tarea 2 (CloudFront Function 301) pasa a ser Tarea 1. Nueva Tarea 2: Nuevo flujo CI/CD |
| 2026-08-04 (4) | The Lab → S3 real completada y verificada en AWS real: escritura confirmada con `aws s3api get-object`, rol IAM dedicado, invalidación condicional sin romper el flujo cuando no hay distribución (`npm run build`/`lint` en verde). Siguiente prioridad: Assets + behaviors de CloudFront (ya seleccionada como Tarea 2, su dependencia de contenido real en `/content/*` quedó satisfecha) pasa a Tarea 1. Para la nueva Tarea 2 se prioriza "CloudFront Function de 301" (paso 5 de la secuencia en `MEMORY.md` §2): resuelve el problema de contenido duplicado SEO entre `olivercastelblanco.com` y el dominio canónico, es independiente de la Tarea 1 (ambas tocan la misma distribución pero configuran cosas distintas) | Tarea 1 (The Lab → S3) movida al historial. Tarea 2 (Assets + behaviors CloudFront) pasa a ser Tarea 1. Nueva Tarea 2: CloudFront Function de 301 |
| 2026-08-04 (3) | Terminal de contacto vía SES completada y verificada en AWS real: envío confirmado en CloudWatch, honeypot y validaciones intactos, rol IAM dedicado y throttling verificados (`npm run build`/`lint` en verde). Siguiente prioridad: The Lab → S3 (ya seleccionada como Tarea 2, sin dependencias pendientes — el bloqueo original de bucket inexistente desapareció con la Tarea de base multi-stage) pasa a Tarea 1. Para la nueva Tarea 2 se prioriza "Assets + behaviors de CloudFront" (paso 4 de la secuencia en `MEMORY.md` §2): depende de que The Lab → S3 exista para tener contenido real que servir desde `/content/*`, pero puede empezar a prepararse en paralelo (subida de assets, OAC) | Tarea 1 (Terminal de contacto) movida al historial. Tarea 2 (The Lab → S3) pasa a ser Tarea 1. Nueva Tarea 2: Assets + behaviors de CloudFront |
| 2026-08-04 (2) | Base multi-stage completada y verificada en AWS real: ambos dominios de API responden por separado, ambos buckets de contenido existen y son privados, el bug de `fileReplacements` quedó corregido, y `production` sirve el rediseño completo por su Function URL (`npm run build`/`build:preview`/`lint` en verde, PR #22). El bloqueo que impedía avanzar con el switch desapareció. Siguiente prioridad: Terminal de contacto vía SES (ya seleccionada como Tarea 2, gap OWASP A07, sin dependencias pendientes) pasa a Tarea 1. Para la nueva Tarea 2 se prioriza "The Lab → S3" (paso 3 de la secuencia en `MEMORY.md` §2): el bloqueo original (bucket inexistente) desapareció con la tarea recién completada, y es prerequisito de "Assets + behaviors CloudFront" (paso 4) | Tarea 1 (Base multi-stage) movida al historial. Tarea 2 (Contacto SES) pasa a ser Tarea 1. Nueva Tarea 2: The Lab → S3 real |
| 2026-08-04 | El usuario define el objetivo del día: reemplazar el sitio en vivo (`ocastelblanco.com` + `olivercastelblanco.com`) por el rediseño, montando todo lo posible **antes** del switch de DNS para que el corte sea rápido y reversible. Se audita el estado real en AWS y aparecen cuatro hallazgos que reordenan el plan: (1) `serverless.yml` fija `api.ocastelblanco.com` para cualquier stage y hoy lo tiene `preview` — desplegar `production` sin arreglarlo genera conflicto, así que es prerequisito bloqueante; (2) los 4 hostnames son alias de la distribución CloudFront `E1MX0LNEKZOG8H` y un alias solo puede vivir en una distribución, por lo que **no** se puede pre-construir una distribución nueva con esos alias — se decide reusar la existente cambiándole el origen (ADR-012), lo que reduce el switch a un solo `update-distribution` reversible; (3) `angular.json` no tiene `fileReplacements`, así que `environment.prod.ts` es código muerto y The Lab en producción leería el fixture de desarrollo — bug latente que se absorbe en la Tarea 1; (4) el formulario de contacto nunca entregó mensajes (solo `console.log`), y `CLAUDE.md` §6 A07 prohíbe desplegar `/contact` sin rate limiting, lo que lo vuelve prioridad 1 (gap OWASP que bloquea producción). La tarea monolítica "Deploy de producción" se descompone en la secuencia ordenada de `MEMORY.md` §2. "Bitácora de proceso — Entrada MVP" se retira temporalmente de la lista activa (sigue dependiendo del switch) | Tarea 1 anterior (Deploy de producción) descompuesta. Nueva Tarea 1: Base multi-stage (`preview`/`production`). Nueva Tarea 2: Terminal de contacto funcional vía SES + rate limiting. "Bitácora de proceso" fuera de la lista activa, pendiente de reincorporación tras el switch |
| 2026-07-11 | Arquitectura de contenido completada y verificada (build + lint en verde, PR #17 fusionada). Siguiente prioridad Alta: Deploy de producción (ya seleccionada como Tarea 2, sin dependencias bloqueantes) pasa a Tarea 1. Para la nueva Tarea 2 se reincorpora Bitácora de proceso — Entrada MVP (retirada temporalmente cuando se antepuso Arquitectura de contenido): sigue dependiendo del deploy, pero ya puede volver a ocupar el slot de Tarea 2. Se añade a la Tarea 1 (Deploy) un paso nuevo: conectar `lab-handler.mjs` a S3 real una vez exista el bucket de contenido, cerrando el gap dejado por la tarea recién completada | Tarea 1 (Arquitectura de contenido) movida al historial. Tarea 2 (Deploy producción) pasa a ser Tarea 1, con paso adicional de escritura a S3 para Lab. Nueva Tarea 2: Bitácora de proceso — Entrada MVP |
| 2026-07-11 | El usuario solicita anteponer al deploy de producción una nueva iniciativa: separar contenido de UI en "Casos de estudio" y "The Lab" (secciones acumulativas tipo blog, hoy hardcodeadas en diccionarios i18n). Se decide estrategia híbrida (ADR-011): casos de estudio como JSON tipado en el repo (2 publicaciones/año no justifican pipeline externo) y The Lab vía Google Sheets → Apps Script → `POST /lab` con token → `lab.json` en S3, con subset Markdown (negrita/itálica/tachado/links) escrito como texto plano en las celdas. Para mantener 2 tareas activas, "Bitácora de proceso — Entrada MVP" se retira temporalmente (dependía del deploy de todas formas; se reincorporará al liberarse un slot) | Nueva Tarea 1: Arquitectura de contenido (Casos de estudio + The Lab). Tarea 1 anterior (Deploy producción) pasa a Tarea 2. "Bitácora de proceso" fuera de la lista activa, pendiente de reincorporación |
| 2026-06-11 | No existe código de aplicación; máxima prioridad Alta es el boilerplate Angular 22 (base para todo lo demás), seguida por los design tokens (requeridos por toda UI futura) | Se seleccionan las Tareas 1 y 2 de este archivo. Tarea 2 depende de que exista el workspace generado en la Tarea 1. |
| 2026-06-11 | Boilerplate Angular 22 completado y verificado (build + start OK). Siguiente prioridad Alta sin completar: design tokens SCSS (requeridos por toda UI), seguido por el shell de navegación (depende del boilerplate, ya listo) | Tarea 1 (boilerplate) movida al historial. Tarea 2 (design tokens) pasa a ser Tarea 1. Nueva Tarea 2: shell de navegación (sidebar + topbar) |
| 2026-06-11 | Design tokens completados y verificados (build OK). Siguiente prioridad Alta: shell de navegación (depende del boilerplate, ya listo, no de la otra tarea activa). Para la segunda tarea, se evita elegir algo que dependa del shell (aún no completado); CI con GitHub Actions ya tiene su dependencia ("build/test local") satisfecha y es de prioridad Media-Alta para mantener la calidad del repo | Tarea 1 (design tokens) movida al historial. Tarea 2 (shell de navegación) pasa a ser Tarea 1. Nueva Tarea 2: CI con GitHub Actions (build + test) |
| 2026-06-12 | Shell de navegación completado y verificado (build + test + visual OK). Siguiente prioridad: CI con GitHub Actions (ya seleccionada como Tarea 2, sin dependencias pendientes) pasa a Tarea 1. Para la nueva Tarea 2 se prioriza Home ("El Manifiesto del Fixer", prioridad Alta del roadmap), que ya puede construirse dentro del shell recién completado | Tarea 1 (shell de navegación) movida al historial. Tarea 2 (CI) pasa a ser Tarea 1. Nueva Tarea 2: Home — "El Manifiesto del Fixer" |
| 2026-06-12 | CI con GitHub Actions completado y verificado (lint + build + test en verde). Siguiente prioridad Alta: Home ("El Manifiesto del Fixer", ya seleccionada como Tarea 2, sin dependencias pendientes) pasa a Tarea 1. Para la nueva Tarea 2 se prioriza Registro de Proyectos (PRD §5.2, prioridad Alta del MVP), que no depende de Home y ya tiene contenido fuente en `docs/arquitectura/arquitectura_ocastelblanco.md` §2-3 | Tarea 1 (CI) movida al historial. Tarea 2 (Home) pasa a ser Tarea 1. Nueva Tarea 2: Registro de Proyectos (Project Registry) |
| 2026-06-12 | El usuario solicita anteponer una nueva iniciativa fuera del roadmap normal: identidad visual corporativa (logo maestro, isotipo, favicons, loader animado) vía LogoLoom (Fase 1, local/MCP) + Taskade (Fase 2, manual/externo, fuera de este motor JIT). Es insumo directo para favicons y branding de toda la UI, por lo que se antepone a las tareas en curso. Para mantener exactamente 2 tareas activas, "Registro de Proyectos" se retira temporalmente de la lista activa (no se pierde: sigue siendo prioridad Alta del roadmap, documentada en `PRD.md` §5.2, y se reincorporará como Tarea 2 en cuanto se libere un slot) | Nueva Tarea 1: Identidad visual corporativa — Logo maestro (LogoLoom). Tarea 1 anterior (Home) pasa a ser Tarea 2. "Registro de Proyectos" queda fuera de la lista activa, pendiente de reincorporación |
| 2026-06-12 | Identidad visual (Fase 1 LogoLoom) completada y verificada (`npm run build` en verde, favicons aplicados). Siguiente prioridad Alta: Home ("El Manifiesto del Fixer") ya estaba seleccionada como Tarea 2 sin dependencias pendientes, pasa a Tarea 1. "Registro de Proyectos" (retirado temporalmente en la entrada anterior) no tiene dependencias bloqueantes y recupera su lugar como Tarea 2 | Tarea 1 (Logo maestro) movida al historial. Tarea 2 (Home) pasa a ser Tarea 1. Nueva Tarea 2: Registro de Proyectos (Project Registry) |
| 2026-06-13 | El usuario solicita añadir i18n (es-CO / en-US) con cambio inmediato antes de continuar con el roadmap normal. Se descarta `@angular/localize` (builds separados, sin cambio en caliente) y librerías externas (peso innecesario para 2 idiomas). Se implementa `TranslationService` propio con Signals, `LangSwitcher` en topbar y traducciones en `Topbar` + `Sidebar`. Las tareas activas (Home y Registro de Proyectos) no se ven afectadas | Tarea completada fuera del motor JIT. Tareas 1 y 2 (Home y Registro de Proyectos) permanecen sin cambios como próximas prioridades |
| 2026-06-12 | El usuario rechazó dos veces el resultado de la identidad visual y la corrigió iterativamente con sus propios masters (`OC_logo.svg` → `OC_logo_fondo.svg` + loader animado por gradientes → variantes mono desde `OC_logo_alpha.svg`), ya documentado como historial de tareas [FIX] adicionales fuera del motor JIT. PR #4 fue aprobada, fusionada a `rediseno-2026` y la rama `feature/identidad-visual-logo` eliminada en remoto y local. Esta iniciativa queda completamente cerrada. Las Tareas 1 (Home) y 2 (Registro de Proyectos) no dependían de ella y no requieren cambios | Sin cambios en las tareas activas: Tarea 1 sigue siendo Home — "El Manifiesto del Fixer", Tarea 2 sigue siendo Registro de Proyectos (Project Registry) |
| 2026-06-17 | Home completada y verificada (build + lint + visual OK, PR #8 fusionada). Siguiente prioridad Alta: Registro de Proyectos (ya seleccionada como Tarea 2, sin dependencias pendientes) pasa a Tarea 1. Para la nueva Tarea 2 se prioriza la página de detalle del primer caso de estudio (ConectaTech), que completa el requisito del MVP "1 Caso de Estudio" y no depende de la Tarea 1 | Tarea 1 (Home) movida al historial. Tarea 2 (Registro de Proyectos) pasa a ser Tarea 1. Nueva Tarea 2: Página de detalle — Caso de Estudio ConectaTech |
| 2026-06-17 | Registro de Proyectos completado y verificado (build + lint + visual OK, PR #9 fusionada). Siguiente prioridad Alta: ConectaTech detail page (ya seleccionada como Tarea 2, sin dependencias) pasa a Tarea 1. Para la nueva Tarea 2 se prioriza Le Tiende detail page — cierra el ciclo de los dos casos de estudio del Registro y no depende de Tarea 1 | Tarea 1 (Registro de Proyectos) movida al historial. Tarea 2 (ConectaTech) pasa a ser Tarea 1. Nueva Tarea 2: Página de detalle — Le Tiende — Comandante |
| 2026-06-17 | ConectaTech detail page completada y verificada (build + lint OK, PR #10 fusionada). Siguiente prioridad Alta: Le Tiende detail page (ya seleccionada como Tarea 2, sin dependencias) pasa a Tarea 1. Para la nueva Tarea 2 se prioriza Terminal de contacto — CTA principal del portafolio, prioridad Alta del MVP, sin dependencias bloqueantes | Tarea 1 (ConectaTech) movida al historial. Tarea 2 (Le Tiende) pasa a ser Tarea 1. Nueva Tarea 2: Terminal de contacto |
| 2026-06-18 | Le Tiende detail page completada y verificada (build + lint OK, PR #11 fusionada). Siguiente prioridad Alta: Terminal de contacto (ya seleccionada como Tarea 2, sin dependencias) pasa a Tarea 1. Para la nueva Tarea 2 se prioriza The Lab — sección de autoridad técnica y SEO, prioridad Media-Alta del roadmap, sin dependencias bloqueantes | Tarea 1 (Le Tiende) movida al historial. Tarea 2 (Terminal de contacto) pasa a ser Tarea 1. Nueva Tarea 2: The Lab — Micro-blogging técnico |
| 2026-06-20 | El usuario solicita anticipar SEO técnico básico (Tarea 2) sobre el deploy de producción (Tarea 1). SEO no depende del deploy y puede completarse en el stage actual. Deploy de producción pasa a Tarea 2 sin cambios en su descripción; se añade el recordatorio de eliminar LAMBDA_URL_RE del contact handler al hacer el deploy. | Tarea 1 (Deploy producción) pasa a Tarea 2. Tarea 2 (SEO técnico) pasa a Tarea 1 |
| 2026-06-22 | SEO técnico básico completado y verificado (build verde, meta tags y JSON-LD confirmados en HTML SSR, sitemap.xml generado). Siguiente prioridad: Deploy de producción (era Tarea 2, sin dependencias bloqueantes) pasa a Tarea 1. Para la nueva Tarea 2 se activa la entrada de bitácora de proceso en `docs/proceso/` — el deploy cierra el ciclo MVP y esa entrada es insumo directo de The Lab | Tarea 1 (SEO técnico) movida al historial. Tarea 2 (Deploy producción) pasa a ser Tarea 1. Nueva Tarea 2: Bitácora de proceso — Entrada MVP |
| 2026-06-19 | Endpoint backend Terminal de contacto completado y verificado (build en verde, PR #15 abierta). Siguiente prioridad: Deploy de producción (ya seleccionada como Tarea 2, sin dependencias bloqueantes) pasa a Tarea 1. Para la nueva Tarea 2 se prioriza SEO técnico (JSON-LD + meta tags + sitemap) — objetivo de PRD §4 "SEO técnico y para IA", independiente del deploy y sin dependencias bloqueantes | Tarea 1 (endpoint backend) movida al historial. Tarea 2 (Deploy producción) pasa a ser Tarea 1. Nueva Tarea 2: SEO técnico básico |
| 2026-06-18 | El usuario solicitó anteponer el despliegue a AWS Lambda (CI/CD con preview URL por push) para poder validar avances remotamente antes de aprobar PRs. Terminal de contacto completada y movida al historial (PR #12 fusionada). Deploy Lambda implementado y en PR. Para mantener 2 tareas activas: The Lab pasa a Tarea 1 (era Tarea 2, sin cambios). Nueva Tarea 2: endpoint backend de la Terminal de contacto (OWASP A07: no desplegar sin rate limiting) | Tarea 1 (Terminal de contacto) movida al historial. Deploy Lambda (antepuesta) movida al historial. Tarea 2 (The Lab) pasa a ser Tarea 1. Nueva Tarea 2: Endpoint backend Terminal de contacto |
