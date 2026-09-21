import { afterNextRender, DOCUMENT, inject, Injectable, Injector, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { environment } from '@env/environment';

// gtag.js no expone tipos oficiales — se tipa aquí lo mínimo que se usa.
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export type ConsentStatus = 'granted' | 'denied';

const STORAGE_KEY = 'cookie-consent';

/**
 * Carga GA4 (`gtag.js`) con Consent Mode v2, sin un solo `<script>` inline —
 * requisito de la CSP en producción (`script-src 'self' ...`, ver ADR-014).
 * El bootstrap del `dataLayer` y los defaults de consentimiento se empujan
 * desde este código TypeScript compilado, servido bajo `script-src 'self'`,
 * y solo después se anexa la etiqueta externa de Google.
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly injector = inject(Injector);

  private initialized = false;

  readonly consent = signal<ConsentStatus | null>(this.readStoredConsent());

  /**
   * Inicializa Consent Mode v2 y, si ya hay un consentimiento guardado, lo
   * aplica de inmediato. No-op en servidor o si no hay measurement ID
   * (dev/preview, ver ADR-014). Idempotente.
   */
  init(): void {
    if (this.initialized || !isPlatformBrowser(this.platformId)) return;
    if (!environment.gaMeasurementId) return;
    this.initialized = true;

    this.pushConsentDefaults();

    const stored = this.readStoredConsent();
    if (stored) {
      this.pushConsentUpdate(stored);
    }

    this.loadGtagScript();
    this.gtag('js', new Date());
    this.gtag('config', environment.gaMeasurementId, { send_page_view: false });

    this.trackPageViews();
  }

  grant(): void {
    this.setConsent('granted');
  }

  deny(): void {
    this.setConsent('denied');
  }

  /** Reabre el banner — link `// cookies` del topbar, requisito GDPR de retiro. */
  reopen(): void {
    this.consent.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  private setConsent(status: ConsentStatus): void {
    this.consent.set(status);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(STORAGE_KEY, status);
    }
    this.pushConsentUpdate(status);
  }

  private pushConsentDefaults(): void {
    this.gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
      wait_for_update: 500,
    });
  }

  private pushConsentUpdate(status: ConsentStatus): void {
    this.gtag('consent', 'update', {
      ad_storage: status,
      ad_user_data: status,
      ad_personalization: status,
      analytics_storage: status,
    });
  }

  private loadGtagScript(): void {
    const script = this.document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${environment.gaMeasurementId}`;
    this.document.head.appendChild(script);
  }

  /**
   * `page_view` manual diferido con `afterNextRender`: los títulos de página
   * se fijan en `ngOnInit` de cada feature vía `SeoService`, que en zoneless
   * corre en el ciclo posterior a `NavigationEnd`. Enviar el evento de forma
   * síncrona en `NavigationEnd` habría registrado cada vista con el título
   * de la ruta anterior (ver corrección de ADR-014).
   */
  private trackPageViews(): void {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      afterNextRender(
        () => {
          this.gtag('event', 'page_view', {
            page_path: this.router.url,
            page_location: this.document.location.href,
            page_title: this.document.title,
          });
        },
        { injector: this.injector },
      );
    });
  }

  private gtag(...args: unknown[]): void {
    const win = this.document.defaultView as Window | null;
    if (!win) return;
    win.dataLayer = win.dataLayer || [];
    win.dataLayer.push(args);
  }

  private readStoredConsent(): ConsentStatus | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'granted' || saved === 'denied' ? saved : null;
  }
}
