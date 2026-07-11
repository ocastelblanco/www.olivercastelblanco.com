import { Component, OnInit, inject } from '@angular/core';
import { TranslationService } from '@core/i18n/translation.service';
import { SeoService } from '@core/seo/seo.service';
import { ContentService } from '@core/content/content.service';
import { renderMarkdownLite } from '@core/content/markdown-lite';

@Component({
  selector: 'app-lab',
  templateUrl: './lab.html',
  styleUrl: './lab.scss',
})
export class Lab implements OnInit {
  protected readonly trans = inject(TranslationService);
  protected readonly content = inject(ContentService);
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.update(
      'The Lab — Oliver Castelblanco',
      'The Lab: reflexiones técnicas de Oliver Castelblanco sobre Angular, prompt engineering y cloud economics.',
    );
  }

  protected renderTexto(entry: { texto: { es: string; en: string } }): string {
    return renderMarkdownLite(this.content.resolve(entry.texto));
  }
}
