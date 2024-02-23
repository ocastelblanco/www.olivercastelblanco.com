import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';


@Component({
  selector: 'oc-toolbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
  animations: [
    trigger('nombre', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('100ms', style({ opacity: 1 }))
      ])
    ]),
    trigger('iniciales', [
      state('extendido', style({
        color: 'inherit',
        backgroundColor: '#fff',
        width: '90px',
      })),
      state('comprimido', style({
        color: '#fff',
        backgroundColor: '#2c2c2c',
        width: '32px'
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
export class ToolbarComponent implements OnInit {
  comprimido: boolean = false;
  constructor() { }
  ngOnInit(): void {
    setTimeout(() => this.comprimeNombre(true), 5000);
  }
  comprimeNombre(comprime: boolean = false): void {
    this.comprimido = comprime ? true : !this.comprimido;
  }
}
