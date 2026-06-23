import { Component, OnInit, inject } from '@angular/core';
import { TranslationService } from '@core/i18n/translation.service';
import { SeoService } from '@core/seo/seo.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  protected readonly trans = inject(TranslationService);
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.update(
      'Oliver Castelblanco — Solutions Architect & AI Orchestrator',
      'Solutions Architect & AI Orchestrator. Oliver Castelblanco construye soluciones que conectan arquitectura, diseño e inteligencia artificial para generar impacto real.',
    );
  }
}
