import { Component, ComponentRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges, ViewContainerRef } from '@angular/core';
import { IconoComponent } from '@componentes/icono/icono.component';
import { FuncionesService } from '@servicios/funciones.service';

@Component({
  selector: 'a[oca-boton], button[oca-boton]',
  template: '<ng-content></ng-content>',
  host: { 'class': 'oca-boton' }
})
export class BotonComponent implements OnInit, OnChanges {
  @Input() contenido: 'texto' | 'icono+texto' | 'icono' = 'texto';
  @Input() tipo: 'primario' | 'acento' | undefined = 'primario';
  @Input() estado: 'activo' | 'over' | 'press' = 'activo';
  @Input() icono: string = 'home';
  iconoComp!: ComponentRef<IconoComponent>;
  constructor(private vista: ViewContainerRef, private renderer: Renderer2, private funciones: FuncionesService) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['icono'].isFirstChange()) this.cambiaIcono();
  }
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
        this.iconoComp = this.funciones.creaIcono(componente, this.vista, this.renderer);
        this.renderer.appendChild(componente, texto);
        break;
      case 'icono':
        this.iconoComp = this.funciones.creaIcono(componente, this.vista, this.renderer);
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
  cambiaIcono(): void {
    if (this.icono == 'cargando') this.iconoComp.instance.animacion = 'spin';
    else this.iconoComp.instance.animacion = undefined;
    this.iconoComp.instance.icono = this.icono;
  }
}
