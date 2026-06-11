# Tech Specs — ocastelblanco.com (Rediseño 2026)

> Nivel de detalle: referencia. Este documento describe la arquitectura **objetivo** del
> proyecto desde cero (rama `rediseno-2026`). Se actualiza a medida que se implementa cada
> pieza (ver `MEMORY.md` para el estado real vs. lo aquí descrito).

## 1. Diagrama de arquitectura

```
                                   ┌─────────────────────────────┐
                                   │        Usuarios / Bots       │
                                   │   (navegadores, crawlers,    │
                                   │    modelos de lenguaje IA)   │
                                   └───────────────┬───────────────┘
                                                    │ HTTPS
                                                    ▼
                                   ┌─────────────────────────────┐
                                   │   CloudFront (ocastelblanco  │
                                   │            .com)             │
                                   └───────┬───────────────┬─────┘
                          assets estáticos │               │ rutas SSR / app
                                            ▼               ▼
                          ┌─────────────────────┐   ┌───────────────────────────┐
                          │   AWS S3            │   │   AWS Lambda               │
                          │ cdn.ocastelblanco   │   │ (Angular SSR handler,      │
                          │ .com — imágenes,    │   │  empaquetado con           │
                          │ fuentes, build      │   │  Serverless Framework)     │
                          │ estático Angular    │   └─────────────┬─────────────┘
                          └─────────────────────┘                 │
                                                                    │ TransferState / fetch
                                                                    ▼
                                            ┌────────────────────────────────────────┐
                                            │      AWS API Gateway                    │
                                            │      api.ocastelblanco.com (futuro)     │
                                            └───────────────┬──────────────────────────┘
                                                             │
                              ┌──────────────────────────────┼──────────────────────────┐
                              ▼                              ▼                            ▼
                  ┌─────────────────────┐      ┌─────────────────────┐      ┌─────────────────────┐
                  │  AWS Lambda          │      │  Google Firebase     │      │  Cloudinary          │
                  │  (microservicios:    │      │  (auth / functions /  │      │  (transformación y   │
                  │  contacto, lab,      │      │  hosting auxiliar,    │      │  entrega de imágenes)│
                  │  proyectos, etc.)    │      │  uso a definir)        │      │                       │
                  └─────────────────────┘      └─────────────────────┘      └─────────────────────┘

                              ┌──────────────────────────────────────────────────────┐
                              │                 GitHub Actions (CI/CD)                │
                              │  build → test → lint → sam/serverless deploy → S3     │
                              └──────────────────────────────────────────────────────┘
```

**Principios de diseño:**

- Sin servidores administrados (EC2, contenedores persistentes): todo cómputo es Lambda.
- El frontend Angular se sirve en dos formas: assets estáticos (S3 + CloudFront) y
  páginas renderizadas (SSR vía Lambda).
- Arquitectura preparada desde el día 1 para crecer como **microservicios** bajo
  `api.ocastelblanco.com`, permitiendo acoplar servicios externos especializados
  (Firebase, Cloudinary, etc.) sin acoplarlos al monolito Angular.

## 2. Stack tecnológico

| Tecnología | Versión | Propósito | Referencia |
|---|---|---|---|
| Angular | 22.x (última estable) | Framework frontend, standalone + Signals + zoneless | https://angular.dev |
| Angular SSR (`@angular/ssr`) | 22.x | Server-side rendering / hidratación | https://angular.dev/guide/ssr |
| TypeScript | última compatible con Angular 22 | Lenguaje principal | https://www.typescriptlang.org |
| Serverless Framework | última estable (v4+) | Empaquetado y despliegue a AWS Lambda | https://www.serverless.com |
| AWS Lambda | — | Cómputo serverless (SSR + microservicios) | https://docs.aws.amazon.com/lambda |
| AWS API Gateway | — | Exposición de `api.ocastelblanco.com` | https://docs.aws.amazon.com/apigateway |
| AWS S3 | — | Hosting de assets estáticos (`cdn.ocastelblanco.com`) | https://docs.aws.amazon.com/s3 |
| AWS CloudFront | — | CDN para `ocastelblanco.com` y `cdn.ocastelblanco.com` | https://docs.aws.amazon.com/cloudfront |
| Google Firebase | — | Servicios complementarios (uso a definir) | https://firebase.google.com/docs |
| Cloudinary | — | Gestión y entrega de imágenes/video | https://cloudinary.com/documentation |
| GitHub Actions | — | CI/CD | https://docs.github.com/actions |
| SCSS | — | Estilos, design tokens de `DESIGN.md` | — |

## 3. Estructura del repositorio

```
www.olivercastelblanco.com/
├── docs/
│   ├── arquitectura/            # Especificación de contenido y narrativa
│   └── proceso/                 # Bitácora del proceso de diseño con IA
├── src/
│   ├── app/
│   │   ├── core/                 # Servicios singleton, interceptors, config global
│   │   ├── shared/                # UI kit: componentes/pipes/directivas reutilizables
│   │   ├── features/              # Secciones del sitio (ver §4.2)
│   │   ├── app.config.ts          # Providers (router, SSR, zoneless, http)
│   │   ├── app.config.server.ts   # Providers específicos de servidor
│   │   ├── app.routes.ts          # Rutas de la app
│   │   └── app.ts                 # Componente raíz
│   ├── assets/
│   ├── styles/                    # Design tokens (colores, tipografía, spacing) de DESIGN.md
│   ├── main.ts                    # Bootstrap cliente
│   └── main.server.ts             # Bootstrap servidor
├── server.ts                      # Entry point Express/handler para SSR en Lambda
├── serverless.yml                 # Definición de infraestructura (Lambda, API Gateway, S3)
├── angular.json
├── package.json
├── tsconfig*.json
├── CLAUDE.md / PRD.md / tech-specs.md / MEMORY.md / TODO.md / DESIGN.md
```

### Path aliases (propuestos en `tsconfig.json`)

| Alias | Apunta a | Uso |
|---|---|---|
| `@core/*` | `src/app/core/*` | Servicios, guards, interceptors |
| `@shared/*` | `src/app/shared/*` | Componentes/UI kit reutilizable |
| `@features/*` | `src/app/features/*` | Módulos de sección |
| `@env/*` | `src/environments/*` | Variables de entorno |

## 4. Frontend / cliente

### 4.1 Patrones arquitectónicos

| Patrón | Cuándo aplicarlo |
|---|---|
| Componentes standalone | Siempre (sin `NgModule`, salvo requerido por una librería) |
| Signals (`signal`, `computed`, `effect`) | Estado local/derivado de componentes y servicios |
| `provideZonelessChangeDetection()` | Configuración global en `app.config.ts` |
| Lazy loading por ruta (`loadComponent`) | Cada feature/sección bajo `features/` |
| TransferState | Datos obtenidos en SSR que el cliente no debe re-pedir (ej. contenido de proyectos) |
| Resolvers / `input()` de ruta | Carga de datos antes de renderizar una vista de detalle |

### 4.2 Rutas y navegación

| Ruta | Sección | Guard | Carga | Notas |
|---|---|---|---|---|
| `/` | Home (Manifiesto + Pilares) | — | Eager | Página principal, crítica para SEO |
| `/proyectos` | Registro de Proyectos | — | Lazy | Grid Metric-First |
| `/proyectos/:slug` | Caso de estudio | — | Lazy | SSR con `TransferState`, meta tags dinámicos |
| `/lab` | The Lab (bitácora técnica) | — | Lazy | Listado de entradas |
| `/lab/:slug` | Entrada de bitácora | — | Lazy | JSON-LD tipo `Article` |
| `/contacto` (Terminal) | Terminal de contacto | — | Lazy | Formulario vía API |
| `**` | 404 | — | Eager | Página de error con navegación de vuelta |

> No se prevén rutas autenticadas en el MVP; por lo tanto no hay guards de auth iniciales.
> Si se agrega un panel de administración (roadmap), se documentará el guard correspondiente.

### 4.3 Modelos de datos principales

```ts
interface ProjectCase {
  slug: string;
  title: string;
  metric: string;          // ej. "OPEX: $0.50/mes"
  problem: string;
  solution: string;
  stack: string[];
  repoUrl?: string;
}

interface LabEntry {
  slug: string;
  title: string;
  publishedAt: string;     // ISO date
  tags: string[];
  body: string;            // markdown/HTML
}

interface ContactMessage {
  name: string;
  email: string;
  message: string;
}
```

### 4.4 Sistema de estilos / temas

- Design tokens (color, tipografía, spacing) definidos en `DESIGN.md` y materializados en
  `src/styles/_tokens.scss` (variables CSS / SCSS).
- Tema único (dark, "Technical Industrial Minimalism"); no se planea modo claro en el MVP.
- Tipografía: JetBrains Mono (encabezados/datos técnicos) + Inter (cuerpo).
- Radios de borde: `0px` en todos los componentes (estética brutalista/industrial).

### 4.5 SEO y SSR

- SSR habilitado para todas las rutas públicas (`/`, `/proyectos/**`, `/lab/**`).
- Meta tags dinámicos por ruta vía `Meta`/`Title` services de Angular.
- Datos estructurados JSON-LD: `Person` (home), `CreativeWork`/`SoftwareSourceCode`
  (casos de estudio), `Article` (entradas de The Lab).
- `sitemap.xml` y `robots.txt` generados/servidos como parte del build o de una función Lambda.

## 5. Backend y APIs externas

> En el MVP, el "backend" es principalmente la función Lambda de SSR. Los endpoints de
> `api.ocastelblanco.com` se implementan de forma incremental según el roadmap técnico (§11).

| Endpoint | Método | Llamado por | Descripción | Payload |
|---|---|---|---|---|
| `/` … `/lab/:slug` (SSR) | GET | CloudFront → Lambda | Renderiza la app Angular en servidor | — |
| `api.ocastelblanco.com/contact` | POST | Terminal de contacto (cliente) | Recibe mensajes de contacto y los reenvía (email/notificación) | `ContactMessage` |
| `api.ocastelblanco.com/projects` | GET | Frontend (build-time o runtime) | Lista de casos de estudio (si se externaliza el contenido) | — |
| `api.ocastelblanco.com/lab` | GET | Frontend | Lista de entradas de bitácora (si se externaliza el contenido) | — |

### Servicios externos

| Servicio | Estado | Uso actual | Uso futuro |
|---|---|---|---|
| AWS S3 / CloudFront | Planeado | Hosting de assets y build estático | CDN para imágenes de alta resolución |
| AWS Lambda + API Gateway | Planeado | SSR | Microservicios bajo `api.ocastelblanco.com` |
| Google Firebase | Planeado | Ninguno | Auth, Functions o Hosting auxiliar (a definir) |
| Cloudinary | Planeado | Ninguno | Transformación y entrega optimizada de imágenes del portafolio |
| GitHub Actions | Planeado | Ninguno | CI: build, lint, test, deploy automático a AWS |

## 6. Gestión de contenido

En el MVP, el contenido de **Casos de Estudio** y **The Lab** se gestiona como datos
estáticos versionados en el repo (JSON/Markdown bajo `src/assets/data/` o similar),
consumidos en build-time/SSR. Si el volumen crece, se evalúa moverlo a un endpoint de
`api.ocastelblanco.com` respaldado por una base de datos gestionada (ej. DynamoDB) —
decisión pendiente, registrar como ADR cuando se tome.

```
[Markdown/JSON en docs/ o src/assets/data/]
            │
            ▼
  [Build Angular / SSR lee el contenido]
            │
            ▼
  [Render de página con TransferState]
```

## 7. Infraestructura y despliegue

```
Desarrollador ──push──▶ GitHub ──▶ GitHub Actions
                                        │
                                        ├─ npm ci / build / lint / test
                                        │
                                        ├─ serverless deploy (Lambda SSR + API Gateway)
                                        │
                                        └─ sync build estático → S3 (cdn.ocastelblanco.com)
                                                        │
                                                        ▼
                                              CloudFront invalidation
```

### Multi-entorno

| Stage | URL | Variables clave | Comando |
|---|---|---|---|
| `dev` | `dev.ocastelblanco.com` (o subdominio temporal) | `STAGE=dev` | `npm run deploy:dev` |
| `prod` | `ocastelblanco.com` | `STAGE=prod` | `npm run deploy:prod` |

> Los nombres exactos de comandos/variables se confirman al crear `serverless.yml` (ver `TODO.md`).

### Proceso de build y deploy (resumen)

1. `npm ci`
2. `npm run build` (build cliente + servidor Angular SSR)
3. `npm run lint` / `npm test`
4. `serverless deploy --stage <stage>` (despliega Lambda + API Gateway)
5. Sync de `dist/<browser>` a S3 (`cdn.ocastelblanco.com`)
6. Invalidar caché de CloudFront

## 8. Autenticación y seguridad

- El MVP **no tiene autenticación de usuarios** (sitio público, sin login).
- Si se agrega un panel admin (roadmap), usar Firebase Auth o AWS Cognito — decisión a
  registrar como ADR antes de implementar.
- Todas las validaciones de formularios (ej. contacto) deben repetirse **server-side**
  (en la función Lambda del endpoint), nunca confiar solo en validación de cliente.
- Headers de seguridad HTTP (CSP, `X-Content-Type-Options`, `Referrer-Policy`, etc.)
  configurados en CloudFront/Lambda response.

## 9. Gestión de secretos

| Variable | Propósito | Contexto |
|---|---|---|
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | Credenciales de despliegue | GitHub Actions secrets, nunca en el repo |
| `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Acceso a Cloudinary | Variables de entorno Lambda, nunca en el cliente |
| `FIREBASE_*` | Configuración de Firebase (si aplica) | Solo claves públicas en cliente; claves privadas en Lambda |
| `CONTACT_NOTIFICATION_TARGET` | Destino de notificaciones del formulario de contacto (email/webhook) | Variable de entorno Lambda |

**Regla absoluta**: ningún secreto se commitea en el repositorio. `src/secrets/` está en
`.gitignore`. Variables sensibles viven en GitHub Actions Secrets / AWS Parameter Store
o Secrets Manager.

## 10. Convenciones de código y flujo de trabajo

Ver `CLAUDE.md` §4 para convenciones de código. Para git flow, ver la sección
`## Git Flow para Agentes IA` en `CLAUDE.md` (agregada en el paso siguiente de bootstrap).

## 11. Roadmap técnico

| Feature | Archivos a crear | Dependencias técnicas |
|---|---|---|
| Boilerplate Angular 22 SSR (zoneless) | `angular.json`, `src/app/app.config.ts`, `src/app/app.config.server.ts`, `src/main.ts`, `src/main.server.ts`, `server.ts` | Angular CLI 22 |
| Design tokens del sistema visual | `src/styles/_tokens.scss`, `src/styles/_typography.scss` | `DESIGN.md` |
| Shell de navegación (sidebar + topbar) | `src/app/shared/shell/*` | Boilerplate listo |
| Home (Manifiesto + Pilares) | `src/app/features/home/*` | Shell listo |
| Registro de Proyectos + Caso de estudio | `src/app/features/projects/*`, datos en `src/assets/data/projects.json` | Modelo `ProjectCase` |
| Terminal de contacto + endpoint | `src/app/features/contact/*`, `serverless.yml` (función `contact`) | API Gateway configurado |
| Despliegue serverless inicial (`serverless.yml`) | `serverless.yml`, `server.ts` | Cuenta AWS configurada |
| CI con GitHub Actions | `.github/workflows/ci.yml` | Build/test funcionando localmente |
| The Lab (bitácora) | `src/app/features/lab/*`, datos en `src/assets/data/lab/*.md` | Modelo `LabEntry` |
| Internacionalización (ES/EN) | `src/locale/*`, configuración `@angular/localize` | Contenido base estable |
