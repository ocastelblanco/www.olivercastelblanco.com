import { Component, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { TranslationService } from '@core/i18n/translation.service';

/**
 * Barra de consentimiento (ADR-015). Visible solo en el navegador y solo
 * mientras no exista una decisión guardada — así no aparece en el HTML
 * prerenderizado ni causa flash en SSR. Se reabre desde el link `// cookies`
 * del topbar (`AnalyticsService.reopen()`), requisito GDPR de retiro.
 */
@Component({
  selector: 'app-cookie-consent',
  templateUrl: './cookie-consent.html',
  styleUrl: './cookie-consent.scss',
})
export class CookieConsent {
  private readonly platformId = inject(PLATFORM_ID);
  protected readonly analytics = inject(AnalyticsService);
  protected readonly trans = inject(TranslationService);

  protected get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  protected accept(): void {
    this.analytics.grant();
  }

  protected reject(): void {
    this.analytics.deny();
  }
}
