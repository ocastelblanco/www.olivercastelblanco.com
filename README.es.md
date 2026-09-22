<div align="center">

# Oliver Castelblanco

**Principal Solutions Architect & AI Orchestrator. Diseño sistemas, codifico sus restricciones y dirijo agentes de IA a lo largo de todo el ciclo de vida hasta ponerlos en producción.**

[![Live](https://img.shields.io/badge/en_vivo-ocastelblanco.com-C6FF00?style=flat-square&labelColor=111111)](https://ocastelblanco.com)
[![Productos en producción](https://img.shields.io/badge/productos_en_producción-6-00E5FF?style=flat-square&labelColor=111111)](#portafolio)
[![Angular](https://img.shields.io/badge/Angular-22-DD0031?style=flat-square&logo=angular&logoColor=white)](https://angular.dev)
[![AWS](https://img.shields.io/badge/AWS-Lambda_·_CloudFront_·_S3_·_SES-232F3E?style=flat-square&logo=amazonaws&logoColor=white)](https://aws.amazon.com)
[![Serverless](https://img.shields.io/badge/IaC-Serverless_Framework_4-FD5750?style=flat-square&logo=serverless&logoColor=white)](https://serverless.com)
[![AI-generated: producido principalmente por un modelo de IA](https://img.shields.io/static/v1?label=&message=AI-generated&color=red&style=flat-square)](https://nasa-ammos.github.io/slim/?search=Badges)
[![SLIM](https://img.shields.io/badge/Best%20Practices%20from-SLIM-blue?style=flat-square)](https://nasa-ammos.github.io/slim/)
[![English](https://img.shields.io/badge/read_in-English-C6FF00?style=flat-square&labelColor=111111)](./README.md)

</div>

---

## Resumen ejecutivo

> **Seis sistemas en producción en siete meses. Todos especificados por un humano, construidos por agentes orquestados y fusionados solo tras revisión humana.**

Este repositorio es el código fuente de [**ocastelblanco.com**](https://ocastelblanco.com), mi sitio personal. También es el índice de mi trabajo reciente: una plataforma educativa, una familia de sistemas para un centro cultural en Bogotá y este mismo sitio, que documenté mientras lo construía como caso de estudio.

El hilo común no es que "la IA escribió el código". Un **arquitecto de soluciones que orquesta agentes** puede comprimir el ciclo de vida completo (requisitos, arquitectura, especificación, implementación, revisión de seguridad, despliegue y respuesta a incidentes) en una fracción del tiempo de entrega convencional, **sin renunciar a la disciplina de revisión, a la seguridad ni al control de costos**.

| | |
| :-- | :-- |
| **Rol** | Principal Solutions Architect · AI Orchestrator · Bogotá, Colombia |
| **Método** | SDLC aumentado con IA: la orquestación de agentes como método *principal* de producción, no como autocompletado |
| **Entrega más rápida** | **6 días calendario** del primer commit a producción ([Comandante](#comandante--punto-de-venta)) |
| **Reparto medido** | **20,8% humano · 79,2% agente** en 149 tareas instrumentadas ([Babel](#babel--inventario-y-punto-de-venta)) |
| **Superficie de orquestación** | Hasta **~60% dirigido desde un celular**: despachar, revisar y fusionar lejos del escritorio |
| **Postura de costos** | Entre **$0 y menos de $1 USD/mes** de costo variable por producto serverless |
| **Humano en el ciclo** | El 100% de las fusiones a `main`, en todos los repositorios, aprobadas por un humano |

---

## Portafolio

| Producto | Qué es | Stack | Estado |
| :--- | :--- | :--- | :--- |
| [**ConectaTech**](#conectatech--plataforma-educativa-b2b) | Plataforma educativa B2B para colegios colombianos, sobre Moodle | AWS EC2 · RDS · Terraform · Angular · PHP | Producción · desde feb. 2026 |
| [**Comandante**](#comandante--punto-de-venta) | Punto de venta en tiempo real para un café bar | Angular · Ionic · Firebase | Producción · $0/mes |
| [**Babel**](#babel--inventario-y-punto-de-venta) | Inventario, ubicación y venta de una librería | Angular 22 SSR · Lambda · DynamoDB | Producción · 19 días al lanzamiento |
| [**Ágora**](#ágora--taquilla-y-boletería) | Taquilla de teatro con boletas QR y pagos en línea | Angular 22 SSR · Lambda · DynamoDB · SES | Producción · desde ago. 2026 |
| [**letiende.co**](#letiendeco--la-fachada) | Un solo dominio frente a todos los servicios de Le Tiende | Angular 22 SSR · proxy de rutas en CloudFront | Producción · desde sep. 2026 |
| [**ocastelblanco.com**](#ocastelblancocom--este-repositorio) | Este sitio: portafolio + bitácora pública de cómo se construyó | Angular 22 zoneless SSR · Lambda · S3 · CloudFront | Producción · desde ago. 2026 |

### ConectaTech — plataforma educativa B2B

[![Repo](https://img.shields.io/badge/repo-conectatech.co-181717?style=flat-square&logo=github)](https://github.com/ocastelblanco/conectatech.co)
[![Live](https://img.shields.io/badge/en_vivo-conectatech.co-E8630A?style=flat-square)](https://conectatech.co)

Los colegios colombianos no tienen infraestructura para ofrecer educación digital estructurada. ConectaTech les vende **paquetes de cursos** que distribuyen a sus estudiantes mediante **pines de activación**. Un representante del colegio los gestiona desde un portal propio, sin necesidad de conocimientos técnicos.

- **Infraestructura como código** para Moodle 5.2 en AWS (EC2 Graviton, RDS MariaDB, EBS cifrado, CloudFront, alarmas de CloudWatch, snapshots automáticos) con Terraform y scripts de aprovisionamiento idempotentes. Está dimensionada para costar entre ~$34 y ~$89 USD/mes.
- **Pipeline de contenido Markdown → Moodle**: un solo archivo Markdown anotado se convierte en secciones, subsecciones delegadas, bloques de contenido, cuestionarios GIFT y actividades de diagnóstico interactivas.
- **Panel de administración propio** (Angular + API REST en PHP sobre la API interna de Moodle) para árboles curriculares, matrícula masiva por CSV, organizaciones, pines y reportes, algo que Moodle no ofrece de forma nativa.

### Comandante — punto de venta

[![Repo](https://img.shields.io/badge/repo-comandante--letiende-181717?style=flat-square&logo=github)](https://github.com/ocastelblanco/comandante-letiende)
[![Live](https://img.shields.io/badge/en_vivo-comandante.letiende.co-E8630A?style=flat-square)](https://comandante.letiende.co)

Reemplazó las comandas en papel del café bar de Le Tiende. Los meseros toman el pedido en el celular y el barista lo recibe en una tablet en tiempo real. El sistema además separa el consumo gravado de la propina exenta de IVA, para digitarlos directamente en el datáfono.

- **6 días** del primer commit a producción · **$0 USD/mes** dentro del plan gratuito de Firebase.
- **Sin capa de backend**: la autorización vive en las Security Rules de Firestore, evaluadas del lado del servidor. Esa sola decisión eliminó una superficie de ataque, una factura de hosting y un pipeline de despliegue.
- **~60% del sistema se dirigió desde un celular Android**. Cada PR se despliega en una URL de preview, así que verificar un cambio es abrir un enlace.

### Babel — inventario y punto de venta

[![Repo](https://img.shields.io/badge/repo-babel--letiende-181717?style=flat-square&logo=github)](https://github.com/ocastelblanco/babel-letiende)
[![Live](https://img.shields.io/badge/en_vivo-babel.letiende.co-E8630A?style=flat-square)](https://babel.letiende.co)

Una librería con más de 3.000 libros y ningún sistema. Babel escanea el ISBN, enriquece sus metadatos y registra la ubicación física hasta el estante. También resuelve la venta en tienda, un catálogo público con SSR y reportería financiera en XLSX.

- **19 días calendario, 43 h de trabajo medido, el 20,8% humano.** Cada tarea es una fila en un CSV commiteado, y cada agregado de su README se puede auditar contra el historial de git.
- **Casi la mitad del esfuerzo humano se fue en especificación.** Ahí está la palanca del arquitecto, y es lo que permite revisar el trabajo de un agente en minutos.
- **Post-mortem público de un incidente de facturación de $94**: un supuesto no verificado de que DynamoDB "era gratis". De ahí salió un pre-vuelo de costos obligatorio para todos los proyectos posteriores.

### Ágora — taquilla y boletería

[![Repo](https://img.shields.io/badge/repo-agora--letiende-181717?style=flat-square&logo=github)](https://github.com/ocastelblanco/agora-letiende)
[![Live](https://img.shields.io/badge/en_vivo-agora.letiende.co-E8630A?style=flat-square)](https://agora.letiende.co)

Reemplazó las conversaciones por WhatsApp, los comprobantes revisados a mano y las listas en papel del teatro de Le Tiende por un flujo digital de punta a punta: **comprar → pagar → emitir boleta QR → validar en la puerta**.

- Reservas temporales de cupo para evitar la sobreventa. Las etapas de boletería se cierran solas por fecha. La validación en puerta da un veredicto claro: válida, ya usada, inexistente o de otro evento.
- **Pagos en línea con tarjeta o PSE vía Bold**, confirmados solo por un webhook firmado y conciliado, nunca por lo que reporte el navegador del cliente.
- **Menos de $1 USD/mes por diseño.** Fue el primer proyecto que nació con las reglas de costos escritas tras el incidente de Babel.

### letiende.co — la fachada

[![Repo](https://img.shields.io/badge/repo-letiende.co-181717?style=flat-square&logo=github)](https://github.com/ocastelblanco/letiende.co)
[![Live](https://img.shields.io/badge/en_vivo-letiende.co-E8630A?style=flat-square)](https://letiende.co)

Cada servicio de Le Tiende vivía en una dirección distinta. Esto **no es un cuarto sistema**: es un contenedor que pone la taquilla y el catálogo de la librería bajo un solo dominio y un solo menú **sin reimplementar ninguno de los dos**. Un proxy de rutas en CloudFront sirve `/cartelera` y `/libros` directamente desde los stacks de Ágora y Babel. El repositorio solo es dueño del home, las páginas institucionales, la navegación compartida y la capa de SEO/AEO.

### ocastelblanco.com — este repositorio

Un rediseño 2026 hecho desde cero bajo el design system "Industrial Minimalism / Technical Dark Mode". La construcción se documenta a medida que ocurre, como caso de estudio de desarrollo apoyado en LLM.

- **Angular 22 zoneless**: componentes standalone y Signals, sin Zone.js. El SSR corre en AWS Lambda y los activos estáticos se sirven desde S3 detrás de CloudFront.
- **Dos velocidades de publicación, dos soluciones deliberadas.** Los *Casos de Estudio* son JSON tipado versionado en git. *The Lab* es un microblog que se publica desde Google Sheets sin tocar código.
- **Bilingüe es-CO / en-US** con un servicio de traducción basado en Signals, sin librerías externas de i18n. El SEO técnico usa JSON-LD pensado tanto para buscadores como para LLM.
- **Formulario de contacto sobre Amazon SES**, con controles anti-abuso y respuesta automática.
- **Todo cambio pasa por un ambiente**: un PR despliega a `preview` y una fusión humana despliega a `production`. Un hook de pre-commit bloquea secretos hardcodeados, tras dos casi-incidentes reales.
- **14 ADR** en [`MEMORY.md`](./MEMORY.md) registran cada decisión no trivial, incluido el paso a producción sobre una distribución de CloudFront en vivo.

---

## Cómo trabajo

El mismo método atraviesa todos los repositorios anteriores. Está **codificado en cada repo**, así que cada sesión y cada modelo lo heredan; nadie tiene que acordarse de él.

| Fase del ciclo de vida | Cómo se ejecuta |
| :--- | :--- |
| **Requisitos** | Entrevista estructurada contra las restricciones reales del dueño del negocio, antes de cualquier arquitectura |
| **Arquitectura** | Diseñada contra límites duros de costo y seguridad, y registrada como ADR |
| **Especificación** | `PRD.md` y `tech-specs.md` como documentos vivos. Aquí se invierte el 20% humano |
| **Planeación** | Backlog JIT (`TODO.md`) con límite estricto de **2 tareas atómicas** en curso: sin planes obsoletos ni estimaciones vencidas |
| **Implementación** | Delegada a agentes ejecutores: una tarea, una rama, un pull request |
| **Verificación** | Agentes revisores independientes. **El agente que escribe el código nunca lo aprueba** |
| **Seguridad** | OWASP Top 10 mapeado contra la superficie de ataque *real* de cada sistema y escrito en `CLAUDE.md` como restricción permanente |
| **Git flow** | Los agentes tienen prohibido por estructura hacer push a `main`, hacer force-push o fusionar cualquier PR |
| **Memoria** | `MEMORY.md` reúne los gotchas no obvios que aparecen en el camino. Cada uno se depura una vez y no se vuelve a discutir |

**Por qué el computador dejó de ser indispensable.** Cuando el CI/CD se encarga de compilar, desplegar y publicar una URL verificable, al humano le queda **despachar, juzgar y aprobar**. Las tres cosas caben en la pantalla de un celular. Lo que el humano sigue aportando es el criterio.

**El costo es una decisión de arquitectura.** Todo proyecto usa por defecto servicios de pago por uso sin capacidad aprovisionada, y la alarma de presupuesto se configura antes de crear el primer recurso. Así, un incidente de costos se manifiesta como un incidente de servicio, nunca como una factura sorpresa.

---

## Este repositorio

### Stack tecnológico

| Capa | Tecnología |
| :--- | :--- |
| Framework | Angular 22: componentes standalone, Signals, zoneless (`provideZonelessChangeDetection()`) |
| Renderizado | `@angular/ssr` con hidratación del cliente, handler Express 5 en AWS Lambda |
| Lenguaje | TypeScript 6, `strict` |
| Estilos | Design tokens SCSS de [`DESIGN.md`](./DESIGN.md): JetBrains Mono + Inter, radios de 0px, baseline de 4px |
| Hosting | AWS Lambda (SSR) · S3 + CloudFront (activos estáticos) · API Gateway |
| Correo | Amazon SES (formulario de contacto + respuesta automática) |
| IaC | Serverless Framework 4 |
| CI/CD | GitHub Actions: PR → `preview`, fusión a `main` → `production` |
| Pruebas | Vitest vía `@angular/build:unit-test` · `node --test` para los handlers Lambda |

### Inicio rápido

**Requisitos:** Node.js ≥ 24.15.0 (ver `.nvmrc`) y npm. El repo usa solo npm; no mezcles gestores de paquetes.

```bash
git clone https://github.com/ocastelblanco/www.olivercastelblanco.com.git
cd www.olivercastelblanco.com
npm ci
npm start                          # servidor de desarrollo en localhost:4200
```

```bash
npm run build                      # build de producción (navegador + servidor SSR)
npm run serve:ssr:ocastelblanco    # sirve el build SSR localmente en :4000
npm test                           # pruebas unitarias (Vitest)
npm run test:lambda                # pruebas de los handlers Lambda
npm run lint                       # ESLint
```

No se necesita ningún secreto para correr el sitio en local. Las credenciales de AWS y los tokens existen solo como secretos de GitHub Actions y nunca se commitean.

### Cómo contribuir

Todo cambio llega a `main` únicamente mediante un pull request revisado por un humano ([`CLAUDE.md`](./CLAUDE.md)):

1. Crea una rama desde `main` con prefijo `feature/*`, `fix/*`, `hotfix/*`, `docs/*` o `refactor/*`.
2. Haz el cambio y confirma que `npm run build` pasa.
3. Agrega archivos específicos. Nunca `git add .`.
4. Abre un pull request hacia `main`. Se despliega a `preview` para revisión.

Los commits siguen Conventional Commits en **español colombiano**. Los identificadores de código van en inglés, y el contenido del sitio en español e inglés.

### Documentación del proyecto

| Documento | Contenido |
| :--- | :--- |
| [`CLAUDE.md`](./CLAUDE.md) | Instrucciones permanentes para agentes: stack, convenciones, reglas OWASP, git flow |
| [`PRD.md`](./PRD.md) | Requisitos de producto, audiencia y roadmap |
| [`tech-specs.md`](./tech-specs.md) | Arquitectura técnica |
| [`MEMORY.md`](./MEMORY.md) | Estado actual, ADR y gotchas. **Leer primero** |
| [`TODO.md`](./TODO.md) | Motor JIT: exactamente dos tareas atómicas activas |
| [`DESIGN.md`](./DESIGN.md) | Design system "Technical Industrial Minimalism" |
| [`docs/arquitectura/`](./docs/arquitectura/) | Especificaciones de contenido y narrativa del sitio |
| [`docs/proceso/`](./docs/proceso/) | Bitácora del proceso de diseño con IA y guías de publicación |

---

## Licencia

© Oliver Castelblanco. El código fuente es público como referencia. No se otorga licencia de código abierto sobre el código ni sobre el contenido del sitio.

## Contacto

[ocastelblanco.com/contacto](https://ocastelblanco.com/contacto) · [@ocastelblanco](https://github.com/ocastelblanco)

---

<div align="center">
<sub>Construido en Bogotá, Colombia, por un arquitecto y un equipo de agentes. El arquitecto especificó cada sistema de esta página y revisó cada fusión.</sub>
</div>
