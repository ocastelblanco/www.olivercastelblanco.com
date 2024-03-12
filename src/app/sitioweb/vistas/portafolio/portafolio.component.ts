import { Component, effect } from '@angular/core';
import { DataService } from '@servicios/data.service';
import { FuncionesService, Vinculo } from '@servicios/funciones.service';

interface Proyecto {
  nombre: string;
  titulo: string;
  portada: string;
  capturas: string[];
  descripcion: string[];
  enlace?: Vinculo;
  fecha?: string;
  cliente: string;
}

@Component({
  selector: 'oca-portafolio',
  templateUrl: './portafolio.component.html',
  styleUrl: './portafolio.component.scss'
})
export class PortafolioComponent {
  proyectos: Proyecto[] = [];
  idioma: number = 0;
  constructor(private func: FuncionesService, private data: DataService) {
    effect(() => this.idioma = this.func.idioma());
    this.data.getInterfaz().subscribe((_interfaz: any) => this.proyectos = _interfaz.contenidos.portafolio);
  }
}
