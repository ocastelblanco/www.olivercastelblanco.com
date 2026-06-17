import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '@core/i18n/translation.service';
import { LangSwitcher } from '@shared/shell/lang-switcher/lang-switcher';

@Component({
  selector: 'app-topbar',
  imports: [RouterLink, LangSwitcher],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
})
export class Topbar {
  protected readonly trans = inject(TranslationService);
}
