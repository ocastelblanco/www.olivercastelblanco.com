import { Component, Input } from '@angular/core';

@Component({
  selector: 'oca-icono',
  templateUrl: './icono.component.html',
  styleUrls: ['./icono.component.scss']
})
export class IconoComponent {
  @Input() tamano: string = 'pequeño';
  @Input() icono: string = 'home';
  @Input() color: string = 'blanco';
  @Input() iconos: any;
}
