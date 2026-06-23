import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '@core/i18n/translation.service';
import { SeoService } from '@core/seo/seo.service';

@Component({
  selector: 'app-conectatech',
  imports: [RouterLink],
  templateUrl: './conectatech.html',
  styleUrl: './conectatech.scss',
})
export class Conectatech implements OnInit {
  protected readonly trans = inject(TranslationService);
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.update(
      'ConectaTech — Oliver Castelblanco',
      'Cómo ConectaTech redujo en un 80% sus requerimientos de personal con una plataforma de automatización diseñada por Oliver Castelblanco.',
    );
  }
}
