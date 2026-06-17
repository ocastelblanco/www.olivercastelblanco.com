import { Component, inject } from '@angular/core';
import { TranslationService } from '@core/i18n/translation.service';

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.html',
  styleUrl: './proyectos.scss',
})
export class Proyectos {
  protected readonly trans = inject(TranslationService);
}
