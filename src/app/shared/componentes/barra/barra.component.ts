import { Component, ElementRef, OnInit, Renderer2, ViewContainerRef } from '@angular/core';
import { FuncionesService } from '@servicios/funciones.service';

@Component({
  selector: 'nav[oca-barra-horizontal], nav[oca-barra-vertical]',
  host: {
    'class': 'barra',
    '[class.horizontal]': '_esHorizontal()',
    '[class.vertical]': '!_esHorizontal()',
  },
  exportAs: 'ocaBarra',
  template: '<div class="barra-wrapper"><ng-content selector="elemento"></ng-content></div>',
})
export class BarraComponent implements OnInit {
  private elemento!: HTMLElement;
  constructor(
    private _elemento: ElementRef,
    private renderer: Renderer2,
    private vista: ViewContainerRef,
    private funciones: FuncionesService
  ) { }
  ngOnInit(): void {
    this.elemento = this._elemento.nativeElement;
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
  _esHorizontal(): boolean {
    return this.elemento.hasAttribute('oca-barra-horizontal');
  }
}
