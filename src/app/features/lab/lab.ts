import { Component, OnInit, inject } from '@angular/core';
import { TranslationService } from '@core/i18n/translation.service';
import { SeoService } from '@core/seo/seo.service';

@Component({
  selector: 'app-lab',
  templateUrl: './lab.html',
  styleUrl: './lab.scss',
})
export class Lab implements OnInit {
  protected readonly trans = inject(TranslationService);
  protected readonly entries = ['1', '2', '3'] as const;
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.update(
      'The Lab — Oliver Castelblanco',
      'The Lab: reflexiones técnicas de Oliver Castelblanco sobre Angular, prompt engineering y cloud economics.',
    );
  }
}
