import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '@core/i18n/translation.service';
import { SeoService } from '@core/seo/seo.service';

@Component({
  selector: 'app-proyectos',
  imports: [RouterLink],
  templateUrl: './proyectos.html',
  styleUrl: './proyectos.scss',
})
export class Proyectos implements OnInit {
  protected readonly trans = inject(TranslationService);
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.update(
      'Proyectos — Oliver Castelblanco',
      'Casos de estudio de Oliver Castelblanco: automatización con IA aplicada en ConectaTech (-80% staff) y Le Tiende ($0.50/mes OPEX).',
    );
  }
}
