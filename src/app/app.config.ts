import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration, withNoIncrementalHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch()),
    provideRouter(routes),
    // Sin hidratación incremental: en Angular 22.1 es default y activa event replay,
    // que inyecta scripts inline jsaction bloqueados por la CSP (script-src 'self').
    provideClientHydration(withNoIncrementalHydration()),
  ],
};
