import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '@core/i18n/translation.service';

@Component({
  selector: 'app-le-tiende',
  imports: [RouterLink],
  templateUrl: './le-tiende.html',
  styleUrl: './le-tiende.scss',
})
export class LeTiende {
  protected readonly trans = inject(TranslationService);
}
