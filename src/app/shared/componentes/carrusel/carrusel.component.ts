import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FuncionesService } from '@servicios/funciones.service';
import { animationFrameScheduler } from 'rxjs';

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
        <button oca-boton
                [class.inactivo]="!controlActivo(-1)"
                class="control anterior"
                contenido="icono"
                tipo="acento"
                icono="anterior"
                (click)="accionaControl(-1)">
          <span class="texto">Anterior</span>
        </button>
        <button oca-boton
                [class.inactivo]="!controlActivo(1)"
                class="control siguiente"
                contenido="icono"
                tipo="acento"
                icono="siguiente"
                (click)="accionaControl(1)">
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
  elemento: HTMLElement = this.el.nativeElement as HTMLElement;
  constructor(private el: ElementRef, private renderer: Renderer2, private func: FuncionesService) { }
  accionaControl(direccion: number): void {
    if (this.controlActivo(direccion)) {
      this.pos += direccion;
      const ocultos: number[] = this.getAnchos().filter((e: number, i: number) => i < this.pos);
      const izquierda: number = ocultos.length ? ocultos.reduce((a: number, b: number) => a + b) : 0;
      const wrapper: HTMLElement = this.elemento.querySelector('.wrapper-elementos') as HTMLElement;
      this.animaMovimiento(izquierda);
      this.setInactivo();
    }
  }
  controlActivo(direccion: number): boolean {
    const anchoElementos: number = (this.elemento.querySelector('.elementos') as HTMLElement).offsetWidth;
    const derecha: number = this.getAnchos().filter((e: number, i: number) => i >= this.pos).reduce((a: number, b: number) => a + b);
    return direccion < 0 ? this.pos > 0 : derecha > anchoElementos;
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
  setInactivo(): void {
    const anterior: HTMLElement = this.elemento.querySelector('.control.anterior') as HTMLElement;
    const siguiente: HTMLElement = this.elemento.querySelector('.control.siguiente') as HTMLElement;
    this.controlActivo(-1) ? this.renderer.removeClass(anterior, 'inactivo') : this.renderer.addClass(anterior, 'inactivo');
    this.controlActivo(1) ? this.renderer.removeClass(siguiente, 'inactivo') : this.renderer.addClass(siguiente, 'inactivo');
  }
  animaMovimiento(destino: number): Promise<void> {
    // Adaptado de https://github.com/angular/components/issues/13613
    return new Promise(resolve => {
      const wrapper: HTMLElement = this.elemento.querySelector('.wrapper-elementos') as HTMLElement;
      const origen: number = Math.abs(new WebKitCSSMatrix(window.getComputedStyle(wrapper).transform).m41);
      let pos: number = origen;
      let actual: number = 0;
      const incremento: number = 20;
      const duracion: number = 500;
      const animacion = () => {
        actual += incremento;
        pos = this.func.easeInOutExpo(actual, origen, destino - origen, duracion);
        this.renderer.setStyle(wrapper, 'transform', 'translateX(-' + pos + 'px)');
        if (actual < duracion) {
          animationFrameScheduler.schedule(animacion);
        } else {
          resolve();
        }
      };
      animacion();
    });
  }
}
