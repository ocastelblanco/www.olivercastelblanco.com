import { trigger, transition, style, animate } from "@angular/animations";

export const cambioSecciones =
  trigger('arribaAbajo', [
    transition(':enter', [
      style({
        transform: 'translateY(-100%)',
        opacity: 0
      }),
      animate('300ms ease-out', style({
        transform: 'translateY(0)',
        opacity: 1
      }))
    ]),
    transition(':leave', [
      style({
        transform: 'translateY(0)',
        opacity: 1
      }),
      animate('300ms ease-out', style({
        transform: 'translateY(-100%)',
        opacity: 0
      }))
    ]),
  ]);