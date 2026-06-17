import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '@core/i18n/translation.service';

@Component({
  selector: 'app-conectatech',
  imports: [RouterLink],
  templateUrl: './conectatech.html',
  styleUrl: './conectatech.scss',
})
export class Conectatech {
  protected readonly trans = inject(TranslationService);
}
