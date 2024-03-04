import { Component, effect } from '@angular/core';
import { DataService } from '@servicios/data.service';
import { FuncionesService, Vinculo } from '@servicios/funciones.service';

@Component({
  selector: 'oca-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent {
  interfaz!: {
    presentacion: Vinculo,
    accion: Vinculo[]
  };
  idioma: number = 0;
  constructor(private func: FuncionesService, private data: DataService) {
    effect(() => this.idioma = this.func.idioma());
    this.data.getInterfaz().subscribe((_interfaz: any) => this.interfaz = _interfaz.contenidos.inicio);
  }
}
