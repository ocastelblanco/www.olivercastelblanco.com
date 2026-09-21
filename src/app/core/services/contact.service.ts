import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
  /** Token de reCAPTCHA v3 (ADR-016), `null` en dev/preview sin site key. */
  recaptchaToken: string | null;
  /** Honeypot — siempre vacío para un humano, ver `contacto.html` (ADR-016). */
  website: string;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly http = inject(HttpClient);

  send(payload: ContactPayload) {
    return this.http.post<{ ok: boolean }>(`${environment.apiUrl}/contact`, payload);
  }
}
