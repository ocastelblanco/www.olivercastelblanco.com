import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Locale, Translations } from './i18n.types';
import { esTranslations } from './translations/es-CO';
import { enTranslations } from './translations/en-US';

const STORAGE_KEY = 'locale';

const DICTIONARIES: Record<Locale, Translations> = {
  'es-CO': esTranslations,
  'en-US': enTranslations,
};

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly platformId = inject(PLATFORM_ID);

  readonly currentLocale = signal<Locale>(this.detectInitialLocale());

  t(key: string): string {
    const dict: Record<string, unknown> = DICTIONARIES[this.currentLocale()] as unknown as Record<string, unknown>;
    const parts = key.split('.');
    let value: unknown = dict;
    for (const part of parts) {
      value = (value as Record<string, unknown>)?.[part];
    }
    return typeof value === 'string' ? value : key;
  }

  setLocale(locale: Locale): void {
    this.currentLocale.set(locale);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(STORAGE_KEY, locale);
      document.documentElement.lang = locale;
    }
  }

  private detectInitialLocale(): Locale {
    if (!isPlatformBrowser(this.platformId)) return 'en-US';
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'es-CO' || saved === 'en-US') return saved;
    return navigator.language.startsWith('es') ? 'es-CO' : 'en-US';
  }
}
