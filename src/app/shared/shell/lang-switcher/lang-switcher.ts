import { Component, ElementRef, inject, signal } from '@angular/core';
import { TranslationService } from '@core/i18n/translation.service';
import { Locale } from '@core/i18n/i18n.types';

interface LangOption {
  locale: Locale;
  code: string;
}

@Component({
  selector: 'app-lang-switcher',
  templateUrl: './lang-switcher.html',
  styleUrl: './lang-switcher.scss',
  host: { '(document:click)': 'onDocumentClick($event)' },
})
export class LangSwitcher {
  protected readonly trans = inject(TranslationService);
  private readonly el = inject(ElementRef);

  protected readonly isOpen = signal(false);

  protected readonly options: LangOption[] = [
    { locale: 'es-CO', code: 'ES' },
    { locale: 'en-US', code: 'EN' },
  ];

  protected currentCode(): string {
    return this.trans.currentLocale() === 'es-CO' ? 'ES' : 'EN';
  }

  protected toggle(event: MouseEvent): void {
    event.stopPropagation();
    this.isOpen.update(v => !v);
  }

  protected select(locale: Locale): void {
    this.trans.setLocale(locale);
    this.isOpen.set(false);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') this.isOpen.set(false);
  }

  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target as Node)) {
      this.isOpen.set(false);
    }
  }
}
