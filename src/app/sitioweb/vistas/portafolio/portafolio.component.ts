import { Component, effect } from '@angular/core';
import { DataService } from '@servicios/data.service';
import { Captura, FuncionesService, ProyectoPortafolio } from '@servicios/funciones.service';

@Component({
  selector: 'oca-portafolio',
  templateUrl: './portafolio.component.html',
  styleUrl: './portafolio.component.scss'
})
export class PortafolioComponent {
  proyectos: ProyectoPortafolio[] = [];
  idioma: number = 0;
  overlayVisible: boolean = false;
  overlayData: Captura = { img: '', txt: '' };
  propCapOver: string | null = null;
  constructor(private func: FuncionesService, private data: DataService) {
    effect(() => this.idioma = this.func.idioma());
    this.data.getInterfaz().subscribe((_interfaz: any) => this.proyectos = _interfaz.contenidos.portafolio);
  }
  abreCaptura(proyecto: Captura, ev: MouseEvent): void {
    this.overlayData = proyecto;
    this.overlayVisible = true;
  }
  propCaptura(ev: Event): void {
    const img: HTMLElement = ev.target as HTMLElement;
    const prop: number = img.offsetWidth / img.offsetHeight;
    if (prop < 0.8) this.propCapOver = 'vertical';
    if (prop >= 0.8 && prop <= 1.25) this.propCapOver = 'estandar';
    if (prop > 1.25) this.propCapOver = 'horizontal';
  }
}
