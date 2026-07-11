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
}
```

Ver `src/assets/content/casos/conectatech.json` y `le-tiende.json` como referencia completa.

## 2. Pasos para agregar un caso nuevo

1. **Crear el JSON**: `src/assets/content/casos/{slug}.json`, siguiendo la interfaz de
   arriba. Completar ambos idiomas (`es`/`en`) en cada campo bilingüe.
2. **Registrarlo en `ContentService`** (`src/app/core/content/content.service.ts`):
   agregar el `import` del nuevo JSON y añadirlo al array `CASOS`. El Registro de
   Proyectos (`/proyectos`) lo listará automáticamente — no requiere tocar su componente.
3. **Crear la página de detalle**: hoy cada caso tiene su propio componente standalone
   (ej. `src/app/features/proyectos/conectatech/`) porque cada uno define su propio
   `SeoService.update(title, description)` con copy único para SEO. Para el nuevo caso:
   - Duplicar la carpeta de un caso existente (`.ts`, `.html`, `.scss`) como plantilla,
     renombrando el selector, el nombre de clase y las strings de SEO.
   - En el `.ts`, reemplazar `this.content.getCaso('<slug-existente>')` por
     `this.content.getCaso('<slug-nuevo>')!`.
   - El `.html` no necesita cambios si sigue la misma estructura (hero métrica,
     desafío/enfoque/impacto, stack) — ya consume `caso` y `content.resolve(...)`
     genéricamente.
4. **Registrar la ruta** en `src/app/app.routes.ts`:
   ```ts
   {
     path: 'proyectos/{slug}',
     loadComponent: () => import('./features/proyectos/{slug}/{slug}').then(m => m.{Componente}),
   },
   ```
5. **Actualizar el enlace `view_case`** — ya es automático: el listado en `proyectos.html`
   arma el link como `'/proyectos/' + caso.slug`, así que no hay que tocarlo si el `slug`
   coincide con la ruta registrada.
6. **Verificar**: `npm run build` y `npm run lint` en verde; confirmar visualmente que el
   nuevo caso aparece en `/proyectos` y que su página de detalle renderiza correctamente en
   ambos idiomas.

## 3. Flujo de publicación (Git Flow del repo)

Sigue el mismo flujo que cualquier feature (ver `CLAUDE.md` §"Git Flow para Agentes IA"):

```bash
git checkout rediseno-2026 && git pull origin rediseno-2026
git checkout -b feature/caso-{slug}
# ... crear JSON, registrar en ContentService, crear página, registrar ruta ...
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
