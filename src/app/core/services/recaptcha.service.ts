import { DOCUMENT, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '@env/environment';

// reCAPTCHA v3 no expone tipos oficiales — se tipa aquí lo mínimo que se usa.
declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

/**
 * Carga `recaptcha/api.js` (ADR-016) **solo cuando se llama `execute()`**, no
 * site-wide — así el resto del sitio no depende de un tercero de Google.
 * No-op en servidor o si no hay site key configurada (dev/preview).
 */
@Injectable({ providedIn: 'root' })
export class RecaptchaService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);

  private scriptPromise: Promise<void> | null = null;

  /**
   * Devuelve un token de reCAPTCHA v3 para la acción dada, o `null` si no hay
   * site key configurada (dev/preview) o si el servicio corre en servidor.
   */
  async execute(action: string): Promise<string | null> {
    if (!isPlatformBrowser(this.platformId) || !environment.recaptchaSiteKey) {
      return null;
    }

    await this.loadScript();

    const win = this.document.defaultView as Window | null;
    const grecaptcha = win?.grecaptcha;
    if (!grecaptcha) return null;

    return new Promise((resolve) => {
      grecaptcha.ready(() => {
        grecaptcha
          .execute(environment.recaptchaSiteKey, { action })
          .then(resolve)
          .catch(() => resolve(null));
      });
    });
  }

  private loadScript(): Promise<void> {
    if (this.scriptPromise) return this.scriptPromise;

    this.scriptPromise = new Promise((resolve, reject) => {
      const script = this.document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${environment.recaptchaSiteKey}`;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('No se pudo cargar reCAPTCHA'));
      this.document.head.appendChild(script);
    });

    return this.scriptPromise;
  }
}
