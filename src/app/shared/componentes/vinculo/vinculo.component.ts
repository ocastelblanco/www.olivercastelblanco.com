import { Component, Input } from '@angular/core';
import { Vinculo } from '@servicios/funciones.service';
import { iconos } from '@componentes/icono/icono.lista';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'oca-vinculo',
  templateUrl: './vinculo.component.html'
})
export class VinculoComponent {
  @Input() clase!: string;
  @Input() datos!: Vinculo;
  @Input() idioma: number = 0;
  iconos: { [key: string]: IconDefinition } = iconos;
  esExterna(): boolean {
    return this.datos.enlace?.includes('http') as boolean;
  }
}
