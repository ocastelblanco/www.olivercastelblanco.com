import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { ContentService } from '@core/content/content.service';
import { LabEntry } from '@core/content/lab.types';

/**
 * Resuelve las entradas de The Lab **antes** de activar la ruta (ADR-011) —
 * tanto en SSR/prerender como en navegación del lado del cliente. Angular
 * espera este resolver antes de renderizar, lo que garantiza que el HTML
 * servido a buscadores incluya el contenido real, no un `@for` vacío que se
 * llena después por un fetch fuera del ciclo de render.
 */
export const labEntriesResolver: ResolveFn<LabEntry[]> = () => inject(ContentService).loadLabEntries();
