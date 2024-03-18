import { Component, effect } from '@angular/core';
import { DataService } from '@servicios/data.service';
import { Captura, FuncionesService, ProyectoPortafolio } from '@servicios/funciones.service';
import { cambioSecciones } from 'src/app/shared/librerias/animaciones';

@Component({
  selector: 'oca-portafolio',
  templateUrl: './portafolio.component.html',
  styleUrl: './portafolio.component.scss',
  animations: [
    cambioSecciones
  ]
})
export class PortafolioComponent {
  proyectos: ProyectoPortafolio[] = [];
  idioma: number = 0;
  overlayVisible: boolean = false;
  overlayData: Captura = { img: '', txt: '' };
  propCapOver: string | null = null;
  numProyectoOverlay: number = 0;
  numCapturaOverlay: number = 0;
  constructor(private func: FuncionesService, private data: DataService) {
    effect(() => this.idioma = this.func.idioma());
    this.data.getInterfaz().subscribe((_interfaz: any) => this.proyectos = _interfaz.contenidos.portafolio);
  }
  abreCaptura(numProy: number, numCap: number): void {
    this.numProyectoOverlay = numProy;
    this.numCapturaOverlay = numCap;
    this.overlayData = this.proyectos[this.numProyectoOverlay].capturas[this.numCapturaOverlay];
    this.overlayVisible = true;
  }
  propCaptura(ev: Event): void {
    const img: HTMLElement = ev.target as HTMLElement;
    const prop: number = img.offsetWidth / img.offsetHeight;
    if (prop < 0.8) this.propCapOver = 'vertical';
    if (prop >= 0.8 && prop <= 1.25) this.propCapOver = 'estandar';
    if (prop > 1.25) this.propCapOver = 'horizontal';
  }
  overlayCambiaCaptura(dir: -1 | 1): void {
    const fin: number = this.proyectos[this.numProyectoOverlay].capturas.length - 1;
    if (this.numCapturaOverlay == 0 && dir == -1) this.numCapturaOverlay = fin + 1;
    if (this.numCapturaOverlay == fin && dir == 1) this.numCapturaOverlay = -1;
    this.numCapturaOverlay += dir;
    this.overlayData = this.proyectos[this.numProyectoOverlay].capturas[this.numCapturaOverlay];
  }
}
