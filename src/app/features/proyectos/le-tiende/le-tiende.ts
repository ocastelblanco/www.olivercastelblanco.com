import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '@core/i18n/translation.service';
import { SeoService } from '@core/seo/seo.service';

@Component({
  selector: 'app-le-tiende',
  imports: [RouterLink],
  templateUrl: './le-tiende.html',
  styleUrl: './le-tiende.scss',
})
export class LeTiende implements OnInit {
  protected readonly trans = inject(TranslationService);
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.update(
      'Le Tiende — Comandante — Oliver Castelblanco',
      'Le Tiende — Comandante: plataforma e-commerce serverless con OPEX de $0.50/mes, diseñada y construida por Oliver Castelblanco.',
    );
  }
}
