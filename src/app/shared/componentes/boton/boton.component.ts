import { Component, Input, OnInit, Renderer2, ViewContainerRef } from '@angular/core';
import { FuncionesService } from '@servicios/funciones.service';

@Component({
  selector: 'a[oca-boton], button[oca-boton]',
  template: '<ng-content></ng-content>',
  host: { 'class': 'oca-boton' }
})
export class BotonComponent implements OnInit {
  @Input() contenido: 'texto' | 'icono+texto' | 'icono' = 'texto';
  @Input() tipo: 'primario' | 'acento' | undefined = 'primario';
  @Input() estado: 'activo' | 'over' | 'press' = 'activo';
  @Input() icono: string = 'home';
  constructor(private vista: ViewContainerRef, private renderer: Renderer2, private funciones: FuncionesService) { }
  ngOnInit(): void {
    this.inicializa();
  }
  inicializa(): void {
    const componente: HTMLElement = this.vista.element.nativeElement;
    const texto: HTMLElement = componente.querySelector('.texto') as HTMLElement;
    this.renderer.addClass(componente, this.contenido);
    if (this.tipo) this.renderer.addClass(componente, this.tipo);
    this.renderer.addClass(componente, this.estado);
    this.renderer.listen(componente, 'mousedown', (ev: any) => this.cambiaEstado(componente, ev));
    this.renderer.listen(componente, 'mouseup', (ev: any) => this.cambiaEstado(componente, ev));
    this.renderer.listen(componente, 'mouseout', (ev: any) => this.cambiaEstado(componente, ev));
    this.renderer.listen(componente, 'mouseover', (ev: any) => this.cambiaEstado(componente, ev));
    this.renderer.setAttribute(componente, 'icono', this.icono)
    switch (this.contenido) {
      case 'icono+texto':
        this.funciones.creaIcono(componente, this.vista, this.renderer);
        this.renderer.appendChild(componente, texto);
        break;
      case 'icono':
        this.funciones.creaIcono(componente, this.vista, this.renderer);
        this.renderer.removeChild(componente, texto);
        break;
    }
    const padre: HTMLElement = componente.parentElement as HTMLElement;
    const wrapper: HTMLElement = this.renderer.createElement('div');
    this.renderer.addClass(wrapper, 'wrapper-boton');
    this.renderer.insertBefore(padre, wrapper, componente);
    this.renderer.appendChild(wrapper, componente);
    const descarga: boolean = componente.getAttribute('descarga') == 'true';
    if (descarga) this.renderer.setAttribute(componente, 'download', '');
  }
  cambiaEstado(componente: HTMLElement, ev: any): void {
    const clase: string[] = ['activo', 'over', 'press'];
    clase.forEach((clase: string) => this.renderer.removeClass(componente, clase));
    switch (ev.type) {
      case 'mousedown':
        this.renderer.addClass(componente, 'press');
        break;
      case 'mouseup':
        this.renderer.addClass(componente, 'over');
        break;
      case 'mouseout':
        this.renderer.addClass(componente, 'activo');
        break;
      case 'mouseover':
        this.renderer.addClass(componente, 'over');
        break;
      default:
        this.renderer.addClass(componente, 'activo');
    }
  }
}
