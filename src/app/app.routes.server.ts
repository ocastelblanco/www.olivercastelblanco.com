import { RenderMode, ServerRoute } from '@angular/ssr';
import { CASOS } from './core/content/casos.data';

export const serverRoutes: ServerRoute[] = [
  {
    // Los slugs a prerenderizar salen del registro central de casos de estudio:
    // agregar un caso a CASOS basta para que su página de detalle entre al build.
    path: 'proyectos/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return CASOS.map((caso) => ({ slug: caso.slug }));
    },
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
