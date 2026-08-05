# ocastelblanco.com — Rediseño 2026

Sitio web personal de **Oliver Castelblanco**, Solutions Architect & AI Orchestrator. Es la
segunda iteración (rediseño 2026) del sitio, construida desde cero en la rama
`main` con Angular 22 (standalone, Signals, zoneless) y SSR, bajo la identidad
visual "Industrial Minimalism / Technical Dark Mode" descrita en [`DESIGN.md`](./DESIGN.md).

El proyecto cumple dos objetivos:

1. **Portafolio profesional**: mostrar capacidades de arquitectura, diseño y desarrollo de
   soluciones integrales apoyadas en orquestación de IA.
2. **Bitácora técnica (meta-proyecto)**: documentar el propio proceso de construcción del
   sitio como caso de estudio de desarrollo apoyado en LLM, con SEO orientado tanto a
   buscadores tradicionales como a modelos de lenguaje.

> Estado actual: **MVP en construcción**. El boilerplate de Angular 22, los design tokens,
> el shell de navegación (sidebar + topbar con selector de idioma), la identidad visual
> corporativa y el soporte multilengua (es-CO / en-US) ya están implementados. Las features
> de negocio (Home, Proyectos, The Lab, Contacto) y la infraestructura serverless
> (`serverless.yml`) están en curso — ver [`TODO.md`](./TODO.md) y
> [`MEMORY.md`](./MEMORY.md) para el estado detallado.

## Tabla de contenidos

- [Características clave](#características-clave)
- [Stack tecnológico](#stack-tecnológico)
- [Requisitos previos](#requisitos-previos)
- [Primeros pasos (desarrollo local)](#primeros-pasos-desarrollo-local)
- [Arquitectura](#arquitectura)
- [Arquitectura de contenido: publicar sin fricción](#arquitectura-de-contenido-publicar-sin-fricción)
- [Variables de entorno](#variables-de-entorno)
- [Scripts disponibles](#scripts-disponibles)
- [Estilos y design system](#estilos-y-design-system)
- [Testing](#testing)
- [Build y despliegue](#build-y-despliegue)
- [Seguridad](#seguridad)
- [Flujo de trabajo con Git](#flujo-de-trabajo-con-git)
- [Solución de problemas](#solución-de-problemas)
- [Documentación del proyecto](#documentación-del-proyecto)

## Características clave

- **Angular 22** con componentes **standalone**, **Signals** como modelo de reactividad y
  **sin Zone.js** (`provideZonelessChangeDetection()`).
- **Server-Side Rendering (SSR)** vía `@angular/ssr` con hidratación del cliente
  (`provideClientHydration`) — pensado para desplegarse como función AWS Lambda.
- **Design system propio** ("Technical Industrial Minimalism"): tema oscuro, acentos Cyber
  Lime / Electric Cyan, tipografía JetBrains Mono + Inter, radios `0px`, grid de 12
  columnas / baseline de 4px (ver [`DESIGN.md`](./DESIGN.md)).
- **Shell de navegación** (sidebar + topbar) implementado y operativo: `Sidebar` con iconos
  SVG, `RouterLinkActive` y el sistema de rutas `/`, `/proyectos`, `/lab`, `/contacto`.
- **Identidad visual corporativa**: logotipo OC en SVG + kit de assets (PNG, WebP, ICO, SVG
  mono) generado y versionado en `public/brand/`.
- **Soporte multilengua es-CO / en-US** con cambio inmediato sin recarga: `TranslationService`
  basado en Signals (sin `@angular/localize` ni librerías externas), detección del idioma
  del navegador, persistencia en `localStorage` y selector `LangSwitcher` en el topbar.
- **CI con GitHub Actions**: pipeline automático de build + tests en cada push / PR.
- **Arquitectura objetivo serverless multi-proveedor**: AWS Lambda + API Gateway + S3 +
  CloudFront para hosting/SSR, con espacio para integrar Firebase y Cloudinary como
  microservicios independientes bajo `api.ocastelblanco.com`.
- **Path aliases** (`@core/*`, `@shared/*`, `@features/*`, `@env/*`) para una organización
  de código clara por capas (núcleo, UI compartida, features, entornos).
- **Arquitectura de contenido con dos velocidades de publicación**: "Casos de Estudio"
  (baja frecuencia, JSON tipado versionado en git) y "The Lab" (microblog frecuente,
  publicado desde Google Sheets sin tocar código) — dos problemas distintos, dos
  soluciones deliberadas, cero costo de infraestructura adicional. Ver
  [Arquitectura de contenido](#arquitectura-de-contenido-publicar-sin-fricción).
- **Testing con Vitest** (`@angular/build:unit-test`).

## Stack tecnológico

| Categoría | Tecnología | Versión | Propósito |
|---|---|---|---|
| Framework | [Angular](https://angular.dev) | ^22.0.0 | Framework principal, standalone + Signals + zoneless |
| SSR | [@angular/ssr](https://angular.dev/guide/ssr) | ^22.0.1 | Renderizado del servidor / hidratación |
| Lenguaje | TypeScript | ~6.0.2 | Lenguaje principal |
| Servidor SSR | Express | ^5.1.0 | Handler HTTP para la app SSR (`src/server.ts`) |
| Reactividad async | RxJS | ~7.8.0 | Flujos asíncronos reales (HTTP, eventos DOM) |
| Testing | [Vitest](https://vitest.dev) + jsdom | ^4.0.8 / ^28.0.0 | Unit tests (`ng test`) |
| Formato | Prettier | ^3.8.1 | Formato de código |
| Cómputo serverless (objetivo) | AWS Lambda | — | SSR + microservicios bajo `api.ocastelblanco.com` |
| Empaquetado serverless (objetivo) | Serverless Framework | v4+ | Despliegue a AWS Lambda |
| Hosting estático (objetivo) | AWS S3 + CloudFront | — | `cdn.ocastelblanco.com` |
| API Gateway (objetivo) | AWS API Gateway | — | `api.ocastelblanco.com` |
| Servicios complementarios (objetivo) | Google Firebase, Cloudinary | — | Auth/Functions, gestión de imágenes |
| CI/CD | GitHub Actions | — | Build, test, lint en cada push/PR (`.github/workflows/`) |

> Las filas marcadas como "(objetivo)" describen la arquitectura planeada en
> [`tech-specs.md`](./tech-specs.md) §1–§2, aún no implementada en este repositorio
> (no existe `serverless.yml` todavía).

## Requisitos previos

- **Node.js 22** (LTS) — requerido por Angular CLI 22. Verifica con:
  ```bash
  node -v
  ```
- **npm 11+** (el proyecto fija `packageManager: npm@11.12.1` en `package.json`).
- **Angular CLI 22** (opcional, instalable globalmente, pero `npx`/`npm run` usan la
  versión local del proyecto):
  ```bash
  npm install -g @angular/cli@22
  ```

> Nota: si tu `ng` global apunta a una versión distinta de Angular (ej. 20.x), usa siempre
> los scripts de `npm` (`npm start`, `npm run build`, etc.), que invocan la versión 22
> instalada en `node_modules` de este proyecto.

## Primeros pasos (desarrollo local)

1. **Clonar el repositorio** (la rama por defecto es `main`, la rama de producción):

   ```bash
   git clone https://github.com/<org>/www.olivercastelblanco.com.git
   cd www.olivercastelblanco.com
   ```

2. **Instalar dependencias**:

   ```bash
   npm install
   ```

   Esto instala Angular 22, Express, RxJS, Vitest y el resto de dependencias listadas en
   `package.json`/`package-lock.json` (siempre usar `npm`, nunca mezclar con `yarn`/`pnpm`).

3. **Levantar el servidor de desarrollo**:

   ```bash
   npm start
   ```

   Esto ejecuta `ng serve` con la configuración `development` (sin optimización, con
   source maps). Abre tu navegador en:

   ```
   http://localhost:4200/
   ```

   La aplicación recarga automáticamente al modificar archivos en `src/`.

4. **(Opcional) Probar el build SSR localmente**:

   ```bash
   npm run build
   node dist/ocastelblanco/server/server.mjs
   ```

   Por defecto el servidor Express de SSR escucha en `http://localhost:4000/` (configurable
   con la variable de entorno `PORT`).

## Arquitectura

### Estructura de directorios

```
www.olivercastelblanco.com/
├── docs/
│   ├── arquitectura/              # Especificación de contenido y narrativa del sitio
│   └── proceso/                   # Bitácora del proceso de diseño con IA (Stitch, prompts)
├── public/                        # Assets estáticos servidos tal cual (favicon, etc.)
├── src/
│   ├── app/
│   │   ├── core/                  # Servicios singleton, guards, interceptors, config global (@core/*)
│   │   │   └── i18n/              # TranslationService (Signals), tipos Locale/Translations, diccionarios
│   │   ├── shared/                 # UI kit reutilizable: componentes, pipes, directivas (@shared/*)
│   │   │   └── shell/             # Shell de navegación: Topbar, Sidebar, LangSwitcher
│   │   ├── features/               # Secciones del sitio: home, proyectos, lab, contacto (@features/*)
│   │   ├── app.config.ts           # Providers de la app (router, hidratación, zoneless)
│   │   ├── app.config.server.ts    # Providers adicionales para SSR (provideServerRendering)
│   │   ├── app.routes.ts           # Rutas del router de Angular
│   │   ├── app.routes.server.ts    # Modos de renderizado SSR por ruta (RenderMode)
│   │   ├── app.ts                  # Componente raíz (App)
│   │   └── app.html / app.scss     # Template y estilos del componente raíz
│   ├── environments/               # environment.ts (dev) / environment.prod.ts (@env/*)
│   ├── styles/                     # Design tokens y tipografía (DESIGN.md)
│   │   ├── _tokens.scss            # Colores, spacing, radios como custom properties CSS
│   │   └── _typography.scss        # Mixins JetBrains Mono / Inter
│   ├── styles.scss                 # Hoja de estilos global (importa los parciales anteriores)
│   ├── index.html                  # Documento HTML raíz
│   ├── main.ts                     # Bootstrap del cliente (bootstrapApplication)
│   ├── main.server.ts              # Bootstrap del servidor (SSR)
│   └── server.ts                   # Entry point Express / handler SSR (Node o Lambda)
├── dist/                           # Salida del build (ignorado en git)
├── angular.json                    # Configuración del Angular CLI / builders
├── tsconfig*.json                  # Configuración de TypeScript (con path aliases)
├── package.json
├── CLAUDE.md                       # Instrucciones permanentes para agentes IA / devs
├── PRD.md                          # Requisitos de producto, audiencia, roadmap
├── tech-specs.md                   # Arquitectura técnica de referencia (objetivo)
├── MEMORY.md                       # Estado actual del proyecto y ADRs — leer primero
├── TODO.md                         # Motor JIT (2 tareas atómicas activas)
└── DESIGN.md                       # Design system "Technical Industrial Minimalism"
```

### Path aliases

TypeScript 6 eliminó el soporte de `baseUrl`, por lo que los `paths` en `tsconfig.json`
usan rutas relativas con prefijo `./`:

```json
"paths": {
  "@core/*": ["./src/app/core/*"],
  "@shared/*": ["./src/app/shared/*"],
  "@features/*": ["./src/app/features/*"],
  "@env/*": ["./src/environments/*"]
}
```

| Alias | Apunta a | Uso |
|---|---|---|
| `@core/*` | `src/app/core/*` | Servicios singleton, guards, interceptors, configuración global |
| `@shared/*` | `src/app/shared/*` | Componentes/pipes/directivas reutilizables (UI kit) |
| `@features/*` | `src/app/features/*` | Secciones del sitio (home, proyectos, lab, contacto) |
| `@env/*` | `src/environments/*` | Variables de entorno (`environment.ts` / `.prod.ts`) |

### Renderizado y SSR

- `src/main.ts` arranca la app en el navegador con `bootstrapApplication(App, appConfig)`.
- `src/main.server.ts` exporta el bootstrap de servidor usado por Angular SSR.
- `src/app/app.config.ts` configura los providers comunes: errores globales del navegador,
  router e hidratación del cliente (`provideClientHydration`).
- `src/app/app.config.server.ts` extiende la config base con `provideServerRendering` y
  las rutas server-side definidas en `src/app/app.routes.server.ts`.
- `src/app/app.routes.server.ts` define el modo de renderizado por ruta. Actualmente
  **todas las rutas (`**`) se prerenderizan** (`RenderMode.Prerender`) en build time.
- `src/server.ts` es el entry point Express que sirve los assets de `dist/.../browser` y
  delega el resto de peticiones al `AngularNodeAppEngine` para SSR. Exporta `reqHandler`
  (creado con `createNodeRequestHandler`), pensado para usarse como handler de Lambda
  (Firebase Cloud Functions / AWS Lambda) además de como servidor Node standalone.

> El roadmap (`MEMORY.md` ADR-003) define una arquitectura serverless en AWS (Lambda +
> API Gateway + S3 + CloudFront vía Serverless Framework), pero **`serverless.yml` aún no
> existe** en este repositorio — es la pieza pendiente del roadmap técnico.

### Componente raíz y shell de navegación

`src/app/app.ts` renderiza el shell completo vía `app.html`: un layout con `Sidebar`
(navegación lateral con iconos SVG y `RouterLinkActive`) y `Topbar` (nombre, rol y selector
de idioma `LangSwitcher`). Las rutas activas son `/`, `/proyectos`, `/lab` y `/contacto`
(cargadas de forma lazy); el contenido de cada ruta está en curso (ver `TODO.md`).

El shell está completamente internacionalizado: todos los labels del `Sidebar` y el rol del
`Topbar` se leen desde `TranslationService` (Signal-based), cambiando instantáneamente al
pulsar el selector de idioma sin recargar la página.

## Arquitectura de contenido: publicar sin fricción

Este sitio no trata todo el contenido igual, y esa es una decisión de diseño deliberada,
no un accidente. "Casos de Estudio" y "The Lab" son las dos secciones acumulativas del
sitio (crecen con el tiempo, como un blog), pero tienen perfiles de publicación
opuestos — y forzarlas por el mismo pipeline habría sido sobre-ingeniería en un lado y
fricción excesiva en el otro. La arquitectura resultante (documentada en detalle como
ADR-011 en [`MEMORY.md`](./MEMORY.md)) resuelve ambas con la solución mínima correcta
para cada una:

| | Casos de Estudio | The Lab |
|---|---|---|
| **Cadencia** | ~2 publicaciones al año | Microblog frecuente, estilo X/Twitter |
| **Estructura** | Rígida y bien definida (desafío / enfoque / impacto / stack) | Libre, dos párrafos máximo |
| **Dónde vive** | JSON tipado en el repo (`src/assets/content/casos/`) | Google Sheets (cero fricción de escritura) |
| **Cómo se publica** | Pull Request normal | Menú personalizado en el Sheet → un clic |
| **Costo de infraestructura** | Cero (ya vive en el build) | Cero (Google Sheets + Apps Script + Lambda ya desplegada) |

**Casos de Estudio** se modela con una interfaz TypeScript estricta (`CasoDeEstudio`,
bilingüe `es`/`en`) y un `ContentService` basado en Signals que lo expone tipado a toda la
UI — el contenido entra al build y al HTML pre-renderizado sin ningún fetch en runtime.
Agregar un caso nuevo es un flujo de PR estándar, documentado paso a paso en
[`docs/proceso/publicar-casos-de-estudio.md`](./docs/proceso/publicar-casos-de-estudio.md).

**The Lab** resuelve un problema distinto: contenido frecuente que no debería requerir
tocar código ni esperar un deploy. La hoja de Google Sheets actúa como CMS mínimo; un menú
personalizado de Apps Script convierte las filas a JSON y las publica contra un endpoint
propio (`POST /lab` en `api.ocastelblanco.com`), protegido con un token secreto validado
server-side. El texto soporta un subset intencionalmente pequeño de Markdown (negrita,
itálica, tachado, enlaces) — suficiente expresividad para un microblog técnico, sin la
superficie de ataque de un editor enriquecido: el HTML fuente se escapa **antes** de
aplicar cualquier marcado, así que no hay vector de inyección posible ni siquiera desde el
propio Sheet. Flujo completo, incluyendo el script de Apps Script listo para copiar, en
[`docs/proceso/apps-script-lab.md`](./docs/proceso/apps-script-lab.md).

Ambas fuentes conviven detrás de la misma abstracción (`ContentService`), así que el resto
de la aplicación no necesita saber de dónde viene cada dato — solo que está tipado y
disponible como Signal.

## Variables de entorno

El proyecto usa los archivos de entorno estándar de Angular en `src/environments/`
(reemplazados en build time según la configuración):

| Archivo | `production` | `apiUrl` | Uso |
|---|---|---|---|
| `src/environments/environment.ts` | `false` | `https://dev.api.ocastelblanco.com` | Desarrollo (`ng serve`, build `development`) |
| `src/environments/environment.prod.ts` | `true` | `https://api.ocastelblanco.com` | Build de producción |

Estos archivos **no contienen secretos** — son configuración pública del cliente.

### Variables de entorno del servidor SSR

| Variable | Default | Descripción |
|---|---|---|
| `PORT` | `4000` | Puerto en el que escucha el servidor Express SSR (`src/server.ts`) cuando se ejecuta como proceso Node standalone |

### Secretos (futuro)

Según `tech-specs.md` §9, las siguientes variables de entorno se gestionarán **solo en
Lambda / GitHub Actions Secrets**, nunca en el repositorio ni en código de cliente:

| Variable | Propósito |
|---|---|
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | Credenciales de despliegue (GitHub Actions) |
| `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Acceso a Cloudinary |
| `FIREBASE_*` | Configuración de Firebase (claves privadas solo en Lambda) |
| `CONTACT_NOTIFICATION_TARGET` | Destino de notificaciones del formulario de contacto |

Cualquier archivo en `src/secrets/secrets*.ts` está excluido vía `.gitignore` y **nunca**
debe commitearse.

## Scripts disponibles

| Comando | Builder / acción | Descripción |
|---|---|---|
| `npm start` | `ng serve` (config `development`) | Levanta el servidor de desarrollo en `http://localhost:4200/` con recarga automática |
| `npm run build` | `ng build` (config `production` por defecto) | Compila cliente + servidor SSR a `dist/ocastelblanco/` |
| `npm run watch` | `ng build --watch --configuration development` | Build incremental sin optimizar, útil para depurar el bundle |
| `npm test` | `ng test` (Vitest) | Ejecuta la suite de unit tests |
| `npm run serve:ssr:ocastelblanco` | `node dist/ocastelblanco/server/server.mjs` | Levanta el servidor Express SSR compilado (requiere `npm run build` previo) |
| `npx ng generate component <nombre>` | Angular CLI schematics | Genera un componente standalone con estilo `scss` (configuración por defecto del proyecto) |

## Estilos y design system

El sistema visual "Technical Industrial Minimalism" está documentado en su totalidad en
[`DESIGN.md`](./DESIGN.md) y materializado en código en:

- **`src/styles/_tokens.scss`**: define como *custom properties* CSS bajo `:root` la
  paleta de colores (Deep Charcoal `#131313`/`#121212`, acentos Cyber Lime
  `#CCFF00`/`#c3f400` y Electric Cyan `#00F0FF`/`#00eefc`), la escala de spacing
  (`--spacing-xs` 4px → `--spacing-xxl` 128px) y `--radius: 0px`.
- **`src/styles/_typography.scss`**: importa JetBrains Mono (técnica) + Inter (cuerpo)
  desde Google Fonts y define mixins (`h1`, `h2`, `h3`, `body-lg`, `body-md`,
  `technical-label`, `data-point`).
- **`src/styles.scss`**: hoja global que importa ambos parciales con `@use`, fija
  `border-radius: var(--radius)` en `*`, aplica colores de fondo/texto desde los tokens en
  `body` y agrega una textura de ruido sutil (SVG `feTurbulence`, opacidad 2.5%) vía
  `body::before`.

Cualquier componente nuevo debe usar estos tokens; no introducir colores, tipografías o
radios fuera de este sistema sin actualizar primero `DESIGN.md`.

## Testing

El proyecto usa **Vitest** (vía `@angular/build:unit-test`) con **jsdom** como entorno DOM.

```bash
# Ejecutar toda la suite de unit tests
npm test
```

- Los archivos de spec siguen la convención `*.spec.ts` junto al archivo que prueban
  (ej. `src/app/app.spec.ts`).
- No hay configuración de **e2e** en este proyecto; Angular CLI no incluye un framework
  e2e por defecto y aún no se ha elegido uno.

## Build y despliegue

### Build local

```bash
npm run build
```

Genera `dist/ocastelblanco/` con dos subcarpetas:

- `dist/ocastelblanco/browser/` — assets estáticos del cliente (HTML, JS, CSS, favicon).
  Estos son los archivos que, según el roadmap, se sincronizarán a
  `cdn.ocastelblanco.com` (S3 + CloudFront).
- `dist/ocastelblanco/server/` — bundle del servidor SSR (`server.mjs`,
  `main.server.mjs`, manifiestos de Angular App Engine). `server.mjs` puede ejecutarse
  como proceso Node o adaptarse como handler de función serverless (Lambda /
  Firebase Functions) gracias a `reqHandler` exportado desde `src/server.ts`.

La configuración `production` (por defecto) aplica `outputHashing: all` y los siguientes
presupuestos de tamaño (`angular.json`):

| Tipo | Warning | Error |
|---|---|---|
| Bundle inicial | 500 kB | 1 MB |
| Estilos por componente | 4 kB | 8 kB |

### Ejecutar el build SSR

```bash
npm run serve:ssr:ocastelblanco
# o equivalente:
node dist/ocastelblanco/server/server.mjs
```

El servidor escucha en `http://localhost:4000/` (o el puerto definido por `PORT`).

### Despliegue en producción (estado del roadmap)

> **Importante:** a la fecha de este README, el repositorio **no incluye** `serverless.yml`
> ni workflows de GitHub Actions. La siguiente descripción corresponde a la arquitectura
> **objetivo** definida en [`tech-specs.md`](./tech-specs.md) §7, pendiente de implementación
> (ver `TODO.md` / `MEMORY.md` para el estado real).

Arquitectura de despliegue planeada:

1. `npm ci` — instalación reproducible de dependencias.
2. `npm run build` — build de cliente + servidor SSR.
3. `npm run lint` / `npm test` — calidad y pruebas.
4. `serverless deploy --stage <stage>` — despliega la función Lambda de SSR + API Gateway
   (Serverless Framework v4+).
5. Sincronizar `dist/ocastelblanco/browser/` a S3 (`cdn.ocastelblanco.com`).
6. Invalidar la caché de CloudFront.

| Stage | URL | Variables clave |
|---|---|---|
| `dev` | `dev.ocastelblanco.com` (o subdominio temporal) | `STAGE=dev` |
| `prod` | `ocastelblanco.com` | `STAGE=prod` |

Hasta que `serverless.yml` exista, el build SSR (`dist/ocastelblanco/server/server.mjs`)
puede ejecutarse en cualquier entorno Node 22 compatible con Express 5.

## Seguridad

Este proyecto sigue lineamientos OWASP Top 10 documentados en detalle en
[`CLAUDE.md`](./CLAUDE.md) §6. Resumen de reglas críticas:

- Ningún secreto (`AWS_*`, `CLOUDINARY_*`, `FIREBASE_*`, etc.) se hardcodea en el código ni
  se expone en el bundle del cliente — viven solo en funciones Lambda / GitHub Actions
  Secrets.
- Contenido dinámico (Markdown de "The Lab", formulario de contacto) debe sanearse antes de
  insertarse en el DOM; prohibido `[innerHTML]`/`bypassSecurityTrustHtml` sin sanitización.
- CORS de `api.ocastelblanco.com` restringido a `https://ocastelblanco.com` (nunca `*`).
- Buckets S3 sin permisos de escritura/listado públicos.
- El endpoint `POST /contact` (futuro) debe incluir rate limiting / anti-spam antes de
  pasar a producción.
- `npm audit` debe ejecutarse en CI; `package-lock.json` siempre commiteado; un solo gestor
  de paquetes (npm).

## Flujo de trabajo con Git

La rama `main` está **protegida** — ningún cambio se commitea
directamente sobre ella. El flujo obligatorio (humanos y agentes IA) es:

1. Crear una feature branch desde `main`:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/descripcion-corta
   ```
   Prefijos válidos: `feature/`, `fix/`, `hotfix/`, `docs/`, `refactor/`.

2. Verificar que el build pasa antes de commitear:
   ```bash
   npm run build
   ```

3. Commits siguiendo [Conventional Commits](https://www.conventionalcommits.org/) en
   español colombiano (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`).

4. Abrir un Pull Request hacia `main`. Ver [`CLAUDE.md`](./CLAUDE.md) para la
   plantilla completa de PR.

## Solución de problemas

| Problema | Causa probable | Solución |
|---|---|---|
| `ng` apunta a una versión distinta de Angular (ej. 20.x) | Angular CLI global desactualizado | Usa `npm start` / `npm run build` (invocan la versión 22 local), o reinstala la CLI global con `npm install -g @angular/cli@22` |
| Error `TS5101: Option 'baseUrl' is deprecated` | `tsconfig.json` usa `baseUrl` (no soportado en TS 6) | No definir `baseUrl`; los `paths` deben ser rutas relativas con prefijo `./` (ej. `["./src/app/core/*"]`) |
| `npm install` falla por dependencias nativas | Versión de Node incompatible | Verificar Node 22 LTS (`node -v`); reinstalar con `npm ci` para usar exactamente `package-lock.json` |
| Puerto `4200` o `4000` ocupado | Otro proceso usando el puerto | Detener el proceso o exportar `PORT=<otro-puerto>` antes de `npm run serve:ssr:ocastelblanco` |
| Cambios de estilos no se reflejan | Caché del Angular CLI | Borrar `.angular/cache` y volver a ejecutar `npm start` |
| `npm run build` falla por presupuestos de tamaño (`anyComponentStyle` 8 kB) | Estilos de un componente exceden el límite | Reducir el SCSS del componente o mover estilos comunes a `src/styles/` (tokens compartidos) |

## Documentación del proyecto

| Archivo | Propósito |
|---|---|
| [`CLAUDE.md`](./CLAUDE.md) | Instrucciones permanentes para agentes IA/devs: stack, convenciones, OWASP, git flow |
| [`PRD.md`](./PRD.md) | Requisitos de producto, audiencia, roadmap |
| [`tech-specs.md`](./tech-specs.md) | Arquitectura técnica de referencia (objetivo) |
| [`MEMORY.md`](./MEMORY.md) | Estado actual del proyecto y ADRs — **leer al inicio de cada sesión** |
| [`TODO.md`](./TODO.md) | Motor JIT — exactamente 2 tareas atómicas activas |
| [`DESIGN.md`](./DESIGN.md) | Design system "Technical Industrial Minimalism" |
| [`docs/objetivos-alcances.md`](./docs/objetivos-alcances.md) | Objetivos y alcances originales del rediseño |
| [`docs/arquitectura/`](./docs/arquitectura/) | Especificaciones de contenido y narrativa del sitio |
| [`docs/proceso/`](./docs/proceso/) | Bitácora del proceso de diseño con IA (Google Stitch, prompts, resultados) |
| [`docs/proceso/publicar-casos-de-estudio.md`](./docs/proceso/publicar-casos-de-estudio.md) | Guía operativa: cómo agregar un nuevo Caso de Estudio (JSON tipado + PR) |
| [`docs/proceso/apps-script-lab.md`](./docs/proceso/apps-script-lab.md) | Guía operativa: cómo publicar The Lab desde Google Sheets vía Apps Script |

---

Generado con [Angular CLI](https://github.com/angular/angular-cli) 22.0.1. Para más
información sobre el CLI, visita la
[referencia de comandos de Angular](https://angular.dev/tools/cli).
