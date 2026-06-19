import { Component, inject } from '@angular/core';
import { TranslationService } from '@core/i18n/translation.service';

@Component({
  selector: 'app-lab',
  templateUrl: './lab.html',
  styleUrl: './lab.scss',
})
export class Lab {
  protected readonly trans = inject(TranslationService);
  protected readonly entries = ['1', '2', '3'] as const;
}
