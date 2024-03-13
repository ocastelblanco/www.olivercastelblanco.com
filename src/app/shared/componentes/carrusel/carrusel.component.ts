import { Component, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'div[oca-carrusel]',
  template: `
    <div class="wrapper-carrusel">
      <div class="elementos">
        <div class="wrapper-elementos">
          <ng-content></ng-content>
        </div>
      </div>
      <div class="controles">
        <button oca-boton class="control" contenido="icono" tipo="acento" icono="anterior" (click)="retrocede()">
          <span class="texto">Anterior</span>
        </button>
        <button oca-boton class="control" contenido="icono" tipo="acento" icono="siguiente" (click)="avanza()">
          <span class="texto">Siguiente</span>
      </button>
      </div>
    </div>
  `,
  host: {
    'class': 'carrusel'
  }
})
export class CarruselComponent {
  pos: number = 0;
  constructor(private el: ElementRef, private renderer: Renderer2) { }
  retrocede(): void {
    if (this.pos > 0) {
      const wrapper: HTMLElement = this.el.nativeElement.getElementsByClassName('wrapper-elementos').item(0);
      const anchoElementos: number = this.el.nativeElement.getElementsByClassName('elementos').item(0).offsetWidth;
      const derecha: number = this.getAnchos().filter((e: number, i: number) => i >= this.pos).reduce((a: number, b: number) => a + b);
      this.pos--;
      const izquierda: number = this.pos > 0 ?
        this.getAnchos()
          .filter((e: number, i: number) => i < this.pos)
          .reduce((a: number, b: number) => a + b) :
        0;
      console.log(izquierda);
      this.renderer.setStyle(wrapper, 'transform', 'translateX(-' + izquierda + 'px');
    }
  }
  avanza(): void {
    const wrapper: HTMLElement = this.el.nativeElement.getElementsByClassName('wrapper-elementos').item(0);
    const anchoElementos: number = this.el.nativeElement.getElementsByClassName('elementos').item(0).offsetWidth;
    const derecha: number = this.getAnchos().filter((e: number, i: number) => i >= this.pos).reduce((a: number, b: number) => a + b);
    if (derecha > anchoElementos) this.pos++;
    const izquierda: number = this.getAnchos()
      .filter((e: number, i: number) => i < this.pos)
      .reduce((a: number, b: number) => a + b);
    this.renderer.setStyle(wrapper, 'transform', 'translateX(-' + izquierda + 'px');
  }
  getAnchos(): number[] {
    const anchos: number[] = [];
    const imgs: HTMLCollection = this.el.nativeElement.getElementsByTagName('img');
    for (let num: number = 0; num < imgs.length; num++) {
      const img: HTMLElement = imgs.item(num) as HTMLElement;
      anchos.push(img.offsetWidth);
    }
    return anchos;
  }
}
