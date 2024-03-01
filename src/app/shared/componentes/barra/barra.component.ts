import { Component, ComponentRef, ElementRef, Input, OnInit, Renderer2, ViewContainerRef } from '@angular/core';
import { VinculoComponent } from '@componentes/vinculo/vinculo.component';
import { FuncionesService, Vinculo } from '@servicios/funciones.service';

@Component({
  selector: 'nav[oca-barra-horizontal], nav[oca-barra-vertical]',
  host: {
    'class': 'barra',
    '[class.horizontal]': '_esHorizontal()',
    '[class.vertical]': '!_esHorizontal()',
  },
  exportAs: 'ocaBarra',
  template: '<div class="barra-wrapper"><ng-content></ng-content></div>',
})
export class BarraComponent implements OnInit {
  @Input() vinculos: Vinculo[] = [];
  @Input() idioma: number = 0;
  private elemento!: HTMLElement;
  constructor(
    private _elemento: ElementRef,
    private renderer: Renderer2,
    private vista: ViewContainerRef,
    private funciones: FuncionesService
  ) { }
  ngOnInit(): void {
    this.elemento = this._elemento.nativeElement;
    const wrapper: HTMLElement = this.elemento.querySelector('.barra-wrapper') as HTMLElement;
    if (this.vinculos.length) {
      this.vinculos.forEach((vinculo: Vinculo) => {
        const vinculoComponentRef: ComponentRef<VinculoComponent> = this.vista.createComponent(VinculoComponent);
        vinculoComponentRef.instance.clase = 'elemento';
        vinculoComponentRef.instance.datos = vinculo;
        vinculoComponentRef.instance.idioma = this.idioma;
        const vinculoComponente: HTMLElement = vinculoComponentRef.location.nativeElement;
        this.renderer.appendChild(wrapper, vinculoComponente);
      });
    } else {
      // Convierte todos los <a> con clase 'elemento' en botones con ícono
      const lista: HTMLCollection = this.elemento.getElementsByClassName('elemento');
      for (let i: number = 0; i < lista.length; i++) {
        const vinculo: HTMLElement = lista.item(i) as HTMLElement;
        const texto: any = this.renderer.createText(vinculo.innerHTML);
        const span: HTMLElement = this.renderer.createElement('span');
        this.renderer.addClass(span, 'texto');
        this.renderer.appendChild(span, texto);
        vinculo.innerHTML = '';
        this.funciones.creaIcono(vinculo, this.vista, this.renderer);
        this.renderer.appendChild(vinculo, span);
      }
    }
  }
  _esHorizontal(): boolean {
    return this.elemento.hasAttribute('oca-barra-horizontal');
  }
}
