import { Component, ComponentRef, ElementRef, OnInit, Renderer2, ViewContainerRef } from '@angular/core';
import { IconoComponent } from '../icono/icono.component';
import { iconos } from '../icono/icono.lista';

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
  constructor(private _elemento: ElementRef, private renderer: Renderer2, private vista: ViewContainerRef) { }
  ngOnInit(): void {
    this.elemento = this._elemento.nativeElement;
    const lista: HTMLCollection = this.elemento.getElementsByClassName('elemento');
    for (let i: number = 0; i < lista.length; i++) {
      const vinculo: HTMLElement = lista.item(i) as HTMLElement;
      const icono: string = vinculo.getAttribute('icono') as string;
      const texto: any = this.renderer.createText(vinculo.innerHTML);
      const span: HTMLElement = this.renderer.createElement('span');
      this.renderer.addClass(span, 'texto');
      this.renderer.appendChild(span, texto);
      vinculo.innerHTML = '';
      const iconoComponenteRef: ComponentRef<IconoComponent> = this.vista.createComponent(IconoComponent);
      iconoComponenteRef.instance.iconos = iconos;
      iconoComponenteRef.instance.color = 'gris-900';
      iconoComponenteRef.instance.tamano = 'mediano';
      iconoComponenteRef.instance.icono = icono;
      const iconoComponente: HTMLElement = iconoComponenteRef.location.nativeElement;
      this.renderer.addClass(iconoComponente, 'oca-icono');
      this.renderer.appendChild(vinculo, iconoComponente);
      this.renderer.appendChild(vinculo, span);
    }
  }
  _esHorizontal(): boolean {
    return this.elemento.hasAttribute('oca-barra-horizontal');
  }
}
