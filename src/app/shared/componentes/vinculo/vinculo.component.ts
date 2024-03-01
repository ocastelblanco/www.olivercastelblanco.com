import { Component, Input } from '@angular/core';
import { Vinculo } from '@servicios/funciones.service';
import { iconos } from '@componentes/icono/icono.lista';

@Component({
  selector: 'oca-vinculo',
  templateUrl: './vinculo.component.html'
})
export class VinculoComponent {
  @Input() clase!: string;
  @Input() datos!: Vinculo;
  @Input() idioma: number = 0;
  iconos: any = iconos;
}
