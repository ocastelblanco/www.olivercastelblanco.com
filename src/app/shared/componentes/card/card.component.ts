import { AfterViewInit, Component, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'div[oca-card]',
  template: '<div class="card-wrapper"><ng-content></ng-content></div>',
  host: { 'class': 'card' }
})
export class CardComponent implements AfterViewInit {
  private elemento!: HTMLElement;
  constructor(
    private _elemento: ElementRef,
    private renderer: Renderer2
  ) { }
  ngAfterViewInit(): void {
    this.inicializa();
  }
  inicializa() {
    this.elemento = this._elemento.nativeElement;
    const wrapper: HTMLElement = this.elemento.querySelector('.card-wrapper') as HTMLElement;
    const contenedor: HTMLElement = this.renderer.createElement('div');
    const foto: HTMLElement = wrapper.querySelector('.foto') as HTMLElement;
    const contenido: HTMLElement = wrapper.querySelector('.contenido') as HTMLElement;
    const carrusel: HTMLElement = wrapper.querySelector('.carrusel') as HTMLElement;
    const accion: HTMLElement = wrapper.querySelector('.accion') as HTMLElement;
    this.renderer.addClass(contenedor, 'contenedor');
    this.renderer.appendChild(wrapper, contenedor);
    if (carrusel) this.renderer.appendChild(wrapper, carrusel);
    if (foto) this.renderer.appendChild(contenedor, foto);
    this.renderer.appendChild(contenedor, contenido);
    if (accion) this.renderer.appendChild(wrapper, accion);
  }
}
