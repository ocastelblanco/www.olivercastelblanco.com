import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslationService } from '@core/i18n/translation.service';

interface NavLink {
  labelKey: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  protected readonly trans = inject(TranslationService);

  protected readonly links: NavLink[] = [
    {
      labelKey: 'nav.home',
      path: '/',
      icon: 'M10 2 2 8.5V18h5.5v-5.5h5V18H18V8.5L10 2Z',
    },
    {
      labelKey: 'nav.projects',
      path: '/proyectos',
      icon: 'M3 4h14v2H3V4Zm0 5h14v2H3V9Zm0 5h10v2H3v-2Z',
    },
    {
      labelKey: 'nav.lab',
      path: '/lab',
      icon: 'M8 2v5.5L3.5 16a1.5 1.5 0 0 0 1.3 2.2h10.4a1.5 1.5 0 0 0 1.3-2.2L12 7.5V2H8Zm2 2h0v4l-2 4h4l-2-4V4Z',
    },
    {
      labelKey: 'nav.contact',
      path: '/contacto',
      icon: 'M2 4h16v12H2V4Zm1.4 1.6 6.6 5 6.6-5',
    },
  ];
}
