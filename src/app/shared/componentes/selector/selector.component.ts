import { Component, ComponentRef, ElementRef, OnInit, Renderer2, ViewContainerRef } from '@angular/core';
import { FuncionesService } from '@servicios/funciones.service';
import { IconoComponent } from '@componentes/icono/icono.component';
import { iconos } from '@componentes/icono/icono.lista';

@Component({
  selector: 'div[oca-selector]',
  host: {
    'class': 'oca-selector'
  },
  exportAs: 'ocaSelector',
  template: '<div class="selector-wrapper"><ng-content selector="elemento"></ng-content></div>'
})
export class SelectorComponent implements OnInit {
  private elemento!: HTMLElement;
  constructor(
    private _elemento: ElementRef,
    private renderer: Renderer2,
    private vista: ViewContainerRef,
    private funciones: FuncionesService
  ) { }
  ngOnInit(): void {
    this.elemento = this._elemento.nativeElement;
    // Convierte todos los <a> con clase 'selector' en botón desplegable
    const selector: HTMLElement = this.elemento.querySelector('.selector') as HTMLElement;
    this.funciones.creaIcono(selector, this.vista, this.renderer);
    const iconoComponenteRef: ComponentRef<IconoComponent> = this.vista.createComponent(IconoComponent);
    iconoComponenteRef.instance.iconos = iconos;
    iconoComponenteRef.instance.color = 'gris-900';
    iconoComponenteRef.instance.tamano = 'mediano';
    iconoComponenteRef.instance.icono = 'caretDown';
    const iconoComponente: HTMLElement = iconoComponenteRef.location.nativeElement;
    this.renderer.addClass(iconoComponente, 'oca-icono-selector');
    this.renderer.appendChild(selector, iconoComponente);
  }
}
