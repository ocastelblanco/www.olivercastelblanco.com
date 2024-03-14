import { Component, effect } from '@angular/core';
import { DataService } from '@servicios/data.service';
import { FuncionesService, ProyectoPortafolio } from '@servicios/funciones.service';

@Component({
  selector: 'oca-portafolio',
  templateUrl: './portafolio.component.html',
  styleUrl: './portafolio.component.scss'
})
export class PortafolioComponent {
  proyectos: ProyectoPortafolio[] = [];
  idioma: number = 0;
  overlayVisible: boolean = false;
  overlayData!: ProyectoPortafolio;
  constructor(private func: FuncionesService, private data: DataService) {
    effect(() => this.idioma = this.func.idioma());
    this.data.getInterfaz().subscribe((_interfaz: any) => this.proyectos = _interfaz.contenidos.portafolio);
  }
  abreCaptura(proyecto: ProyectoPortafolio): void {
    this.overlayData = proyecto;
    this.overlayVisible = true;
  }
}
