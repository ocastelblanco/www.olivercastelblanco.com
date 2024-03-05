import { Component, ElementRef, OnInit, Renderer2, ViewContainerRef } from '@angular/core';
import { FuncionesService } from '@servicios/funciones.service';

@Component({
  selector: 'div[oca-card]',
  template: '<div class="card-wrapper"><ng-content></ng-content></div>',
  host: { 'class': 'card' }
})
export class CardComponent implements OnInit {
  private elemento!: HTMLElement;
  constructor(
    private _elemento: ElementRef,
    private renderer: Renderer2,
    private vista: ViewContainerRef,
    private funciones: FuncionesService
  ) { }
  ngOnInit(): void {
    this.elemento = this._elemento.nativeElement;
    const wrapper: HTMLElement = this.elemento.querySelector('.card-wrapper') as HTMLElement;
    const contenedor: HTMLElement = this.renderer.createElement('div');
    const foto: HTMLElement = wrapper.querySelector('.foto') as HTMLElement;
    const contenido: HTMLElement = wrapper.querySelector('.contenido') as HTMLElement;
    const accion: HTMLElement = wrapper.querySelector('.accion') as HTMLElement;
    this.renderer.addClass(contenedor, 'contenedor');
    this.renderer.appendChild(wrapper, contenedor);
    this.renderer.appendChild(contenedor, foto);
    this.renderer.appendChild(contenedor, contenido);
    this.renderer.appendChild(wrapper, accion);
  }
}
