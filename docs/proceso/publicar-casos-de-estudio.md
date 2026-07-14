# Publicar un nuevo Caso de Estudio

A diferencia de "The Lab" (microblog frecuente, publicado vía Google Sheets — ver
[`apps-script-lab.md`](./apps-script-lab.md)), "Casos de estudio" tiene baja frecuencia de
publicación (no más de 2 al año, ver ADR-011 en `MEMORY.md`) y una estructura de contenido
muy bien definida. Por eso vive como archivos JSON tipados en el repo, versionados junto
con el código, y se publica vía Pull Request normal — no requiere infraestructura externa.

## 1. Estructura del contenido

Cada caso de estudio es un archivo JSON en `src/assets/content/casos/`, tipado contra la
interfaz `CasoDeEstudio` (`src/app/core/content/casos.types.ts`):

```ts
export interface Bilingue {
  es: string;
  en: string;
}

export interface CasoDeEstudio {
  slug: string;          // usado en la URL: /proyectos/{slug}
  tag: Bilingue;          // ej. "El Orquestador" / "The Orchestrator"
  metric: Bilingue;       // ej. "-80%" (puede diferir levemente entre es/en, ej. "/mes" vs "/mo")
  metricLabel: Bilingue;
  title: string;          // no bilingüe — el nombre del proyecto/cliente
  narrative: Bilingue;
  challenge: Bilingue;
  approach: Bilingue;
  impact: { es: string[]; en: string[] }; // lista de puntos de impacto
  stack: Bilingue;
  repoUrl?: string;       // opcional — normalmente la URL del repositorio en GitHub
  accent?: string;        // opcional — 'primary' (Cyber Lime, default) o 'secondary' (Electric Cyan)
  seoDescription?: Bilingue; // opcional — meta description; si falta se usa narrative sin marcado
}
```

Ver `src/assets/content/casos/conectatech.json` y `le-tiende.json` como referencia completa.

### Formato de texto (Markdown)

Los campos bilingües de texto (`narrative`, `challenge`, `approach`, `impact`, `stack`)
soportan el mismo subset seguro de Markdown que "The Lab" — `**negrita**`, `*itálica*`,
`~~tachado~~` y `[texto](url)` — interpretado por `renderMarkdownLite()` vía
`ContentService.resolveMarkdown()` / `resolveMarkdownList()`. Los campos `tag`, `metric`,
`metricLabel` y `title` se renderizan como texto plano (son etiquetas cortas, no prosa).

### Enlace al repositorio (`repoUrl`)

Campo opcional. Si está presente, la página de detalle agrega una ficha "REPO" propia,
después de IMPACTO y antes de STACK, con un enlace ("Ver repositorio →" / "View
repository →"). El borde izquierdo de esa ficha y el color del enlace usan
`--case-accent` (la misma variable del `<header>`), para que no se confunda visualmente
con el color fijo de STACK. Se enlaza con `[href]` (Angular sanitiza automáticamente los
esquemas peligrosos como `javascript:` en bindings de `href`), con
`target="_blank" rel="noopener noreferrer"`.

## 2. Pasos para agregar un caso nuevo

Todos los casos comparten un único componente dinámico de detalle
(`src/app/features/proyectos/caso-detalle/`) servido en la ruta `proyectos/:slug` — no se
duplican componentes ni se registran rutas por caso. Los pasos son solo dos:

1. **Crear el JSON**: `src/assets/content/casos/{slug}.json`, siguiendo la interfaz de
   arriba. Completar ambos idiomas (`es`/`en`) en cada campo bilingüe.
2. **Registrarlo en `CASOS`** (`src/app/core/content/casos.data.ts`): agregar el `import`
   del nuevo JSON y añadirlo al array. De ese registro se derivan automáticamente:
   - el listado en `/proyectos` (con su enlace "Ver caso →"),
   - la página de detalle en `/proyectos/{slug}` (SEO incluido, desde `seoDescription`
     o `narrative`),
   - y el prerender SSR de esa ruta (`getPrerenderParams` en `app.routes.server.ts`).
3. **Actualizar `public/sitemap.xml`** con la URL del nuevo caso (`<loc>` + `<lastmod>`).
4. **Verificar**: `npm run build` y `npm run lint` en verde; confirmar que la nueva ruta
   aparece entre las prerenderizadas del build y que el detalle renderiza correctamente en
   ambos idiomas.

## 3. Flujo de publicación (Git Flow del repo)

Sigue el mismo flujo que cualquier feature (ver `CLAUDE.md` §"Git Flow para Agentes IA"):

```bash
git checkout rediseno-2026 && git pull origin rediseno-2026
git checkout -b feature/caso-{slug}
# ... crear JSON y registrarlo en casos.data.ts ...
npm run build && npm run lint
git add <archivos específicos>
git commit -m "feat(proyectos): agregar caso de estudio {Nombre}"
git push -u origin HEAD
gh pr create --base rediseno-2026 --title "feat(proyectos): agregar caso de estudio {Nombre}" --body "..."
```

Un humano revisa y fusiona el PR — el agente nunca fusiona sus propios cambios.

## 4. Por qué no un pipeline externo (contraste con The Lab)

Con ~2 publicaciones al año, un pipeline Google Sheets/Docs → API → S3 sería
sobre-ingeniería: el repo ya da tipado fuerte (`CasoDeEstudio`), versionado en git, y
build-time rendering (el contenido entra al SSR sin fetch en runtime, sin necesidad de
invalidar CloudFront). Ver ADR-011 en `MEMORY.md` para el análisis completo de la decisión
híbrida.
