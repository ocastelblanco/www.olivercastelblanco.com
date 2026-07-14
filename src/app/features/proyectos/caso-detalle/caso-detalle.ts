import { Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslationService } from '@core/i18n/translation.service';
import { SeoService } from '@core/seo/seo.service';
import { ContentService } from '@core/content/content.service';
import { stripMarkdownLite } from '@core/content/markdown-lite';

@Component({
  selector: 'app-caso-detalle',
  imports: [RouterLink],
  templateUrl: './caso-detalle.html',
  styleUrl: './caso-detalle.scss',
})
export class CasoDetalle {
  protected readonly trans = inject(TranslationService);
  protected readonly content = inject(ContentService);
  private readonly seo = inject(SeoService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly paramMap = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });

  protected readonly caso = computed(() =>
    this.content.getCaso(this.paramMap().get('slug') ?? ''),
  );

  constructor() {
    effect(() => {
      const caso = this.caso();
      if (!caso) {
        // Slug desconocido: de vuelta al listado. No se prerenderiza (los params del
        // prerender salen de CASOS, ver app.routes.server.ts).
        void this.router.navigate(['/proyectos']);
        return;
      }
      const description = caso.seoDescription
        ? this.content.resolve(caso.seoDescription)
        : stripMarkdownLite(this.content.resolve(caso.narrative));
      this.seo.update(`${caso.title} — Oliver Castelblanco`, description);
    });
  }
}
