import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { TranslationService } from '../i18n/translation.service';
import { Bilingue, CasoDeEstudio } from './casos.types';
import { CASOS } from './casos.data';
import { LabEntry } from './lab.types';
import { renderMarkdownLite } from './markdown-lite';

@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly http = inject(HttpClient);
  private readonly trans = inject(TranslationService);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly labEntriesSignal = signal<LabEntry[]>([]);
  readonly labEntries = this.labEntriesSignal.asReadonly();

  constructor() {
    // El fetch de Lab solo corre en el navegador: en SSR/prerender no hay contexto de
    // request para resolver una URL relativa (dev) y no aporta valor bloquear el render
    // por contenido que se hidrata igual del lado del cliente.
    if (isPlatformBrowser(this.platformId)) {
      this.loadLabEntries();
    }
  }

  getCasos(): CasoDeEstudio[] {
    return CASOS;
  }

  getCaso(slug: string): CasoDeEstudio | undefined {
    return CASOS.find((caso) => caso.slug === slug);
  }

  /** Resuelve un campo bilingüe según el locale actual del `TranslationService`. */
  resolve(bilingue: Bilingue): string {
    return this.trans.currentLocale() === 'es-CO' ? bilingue.es : bilingue.en;
  }

  /** Igual que `resolve`, pero para campos bilingües con forma de lista (ej. impact). */
  resolveList(bilingue: { es: string[]; en: string[] }): string[] {
    return this.trans.currentLocale() === 'es-CO' ? bilingue.es : bilingue.en;
  }

  /**
   * Igual que `resolve`, pero interpreta el subset de Markdown soportado
   * (`**negrita**`, `*itálica*`, `~~tachado~~`, `[texto](url)`) y devuelve HTML seguro
   * para usar con `[innerHTML]`.
   */
  resolveMarkdown(bilingue: Bilingue): string {
    return renderMarkdownLite(this.resolve(bilingue));
  }

  /** Igual que `resolveMarkdown`, pero para campos bilingües con forma de lista. */
  resolveMarkdownList(bilingue: { es: string[]; en: string[] }): string[] {
    return this.resolveList(bilingue).map((item) => renderMarkdownLite(item));
  }

  private loadLabEntries(): void {
    this.http.get<LabEntry[]>(environment.labContentUrl).subscribe({
      next: (entries) => this.labEntriesSignal.set(entries),
      error: () => this.labEntriesSignal.set([]),
    });
  }
}
