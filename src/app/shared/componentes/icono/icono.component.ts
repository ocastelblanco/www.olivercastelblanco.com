import { Component, Input } from '@angular/core';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'oca-icono',
  templateUrl: './icono.component.html',
  styleUrls: ['./icono.component.scss']
})
export class IconoComponent {
  @Input() tamano: string = 'pequeño';
  @Input() icono: string = 'home';
  @Input() color: string = 'blanco';
  @Input() iconos: { [key: string]: IconDefinition } = {};
  @Input() animacion: 'spin' | 'beat' | 'shake' | undefined = undefined;
}
