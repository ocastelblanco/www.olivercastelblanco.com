import { Component, Input } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'oca-logo',
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss',
  animations: [
    trigger('logo', [
      state('false', style({ width: '*' })),
      state('true', style({ width: '48px' })),
      transition('false <=> true', [animate('1s cubic-bezier(0.33, 1, 0.68, 1)')])
    ]),
    trigger('nombre', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-in', style({ opacity: 1 }))
      ])
    ]),
    trigger('iniciales', [
      state('extendido', style({
        color: 'inherit',
        backgroundColor: 'rgba(3, 155, 229, 0)',
        width: '135px',
      })),
      state('comprimido', style({
        color: '#fff',
        backgroundColor: 'rgba(3, 155, 229, 1)',
        width: '48px'
      })),
      transition('extendido <=> comprimido', [
        animate('1s cubic-bezier(0.33, 1, 0.68, 1)')
      ])
    ]),
    trigger('resto', [
      state('extendido', style({
        opacity: 1,
        letterSpacing: '0'
      })),
      state('comprimido', style({
        opacity: 0,
        letterSpacing: '-1em'
      })),
      transition('extendido <=> comprimido', [
        animate('800ms cubic-bezier(0.32, 0, 0.67, 0)')
      ])
    ]),
  ]
})
export class LogoComponent {
  @Input() comprimido: boolean = false;
  logoReducido: boolean = false;
  cambiaLogoReducido(): void {
    this.logoReducido = this.comprimido;
  }
}
