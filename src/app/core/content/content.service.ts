import { Injectable, PLATFORM_ID, TransferState, inject, makeStateKey, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';
import { environment } from '@env/environment';
import { TranslationService } from '../i18n/translation.service';
import { Bilingue, CasoDeEstudio } from './casos.types';
import { CASOS } from './casos.data';
import { LabEntry } from './lab.types';
import { renderMarkdownLite } from './markdown-lite';

const LAB_ENTRIES_KEY = makeStateKey<LabEntry[]>('labEntries');

@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly http = inject(HttpClient);
  private readonly trans = inject(TranslationService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly transferState = inject(TransferState);

  private readonly labEntriesSignal = signal<LabEntry[]>([]);
  readonly labEntries = this.labEntriesSignal.asReadonly();

  /**
   * Carga las entradas de The Lab (ADR-011). Se invoca desde `labEntriesResolver`
   * — no desde el constructor — para que solo corra al navegar a `/lab`, nunca
   * en el resto de las rutas. `ContentService` es `providedIn: 'root'`, así que
   * un fetch en el constructor correría para **toda** ruta prerenderizada; se
   * comprobó en la práctica (`npm run build` roto en las 7 rutas, "Terminating
   * worker thread") antes de descartar ese enfoque.
   *
   * En el servidor, `fetch()` de Node no acepta URLs relativas (a diferencia
   * del navegador, que las resuelve contra `document.baseURI`) — por eso se usa
   * `environment.labContentSsrUrl`, una URL absoluta, distinta de
   * `environment.labContentUrl` (relativa, solo para el navegador). Sin URL SSR
   * configurada (dev/preview, que no tienen un endpoint público para el
   * fixture todavía) se omite el fetch en el servidor sin romper el render —
   * el contenido se hidrata igual del lado del cliente.
   *
   * El resultado se guarda en `TransferState` para que el navegador no repita
   * el fetch tras la hidratación.
   */
  loadLabEntries(): Observable<LabEntry[]> {
    if (isPlatformBrowser(this.platformId) && this.transferState.hasKey(LAB_ENTRIES_KEY)) {
      const cached = this.transferState.get(LAB_ENTRIES_KEY, []);
      this.transferState.remove(LAB_ENTRIES_KEY);
      this.labEntriesSignal.set(cached);
      return of(cached);
    }

    const url = isPlatformBrowser(this.platformId) ? environment.labContentUrl : environment.labContentSsrUrl;
    if (!url) {
      this.labEntriesSignal.set([]);
      return of([]);
    }

    return this.http.get<LabEntry[]>(url).pipe(
      tap((entries) => {
        this.labEntriesSignal.set(entries);
        if (!isPlatformBrowser(this.platformId)) {
          this.transferState.set(LAB_ENTRIES_KEY, entries);
        }
      }),
      catchError(() => {
        this.labEntriesSignal.set([]);
        return of([]);
      }),
    );
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
}
