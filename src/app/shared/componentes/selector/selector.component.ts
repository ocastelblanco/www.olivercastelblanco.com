import { Component, ComponentRef, ElementRef, OnInit, Renderer2, ViewContainerRef } from '@angular/core';
import { FuncionesService } from '@servicios/funciones.service';
import { IconoComponent } from '@componentes/icono/icono.component';
import { iconos } from '@componentes/icono/icono.lista';
import { AnimationBuilder, AnimationFactory, AnimationPlayer, animate, style } from '@angular/animations';

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
  private listaEnlaces: Array<HTMLElement> = [];
  private enlaces: ElementRef = this.renderer.createElement('div');
  private plegado: boolean = true;
  private selector!: HTMLElement;
  private animacionEntrada: AnimationFactory = this.animationBuilder.build([
    style({ transform: 'translateX(-100%)' }),
    animate('400ms ease-in', style({ transform: 'translateY(0%)' }))
  ]);
  private animacionSalida: AnimationFactory = this.animationBuilder.build([
    style({ transform: 'translateX(0%)' }),
    animate('400ms ease-out', style({ transform: 'translateY(-100%)' }))
  ]);
  constructor(
    private _elemento: ElementRef,
    private renderer: Renderer2,
    private vista: ViewContainerRef,
    private funciones: FuncionesService,
    private animationBuilder: AnimationBuilder
  ) { }
  ngOnInit(): void {
    this.elemento = this._elemento.nativeElement;
    const wrapper: HTMLElement = this.elemento.querySelector('.selector-wrapper') as HTMLElement;
    // Convierte todos los <a> con clase 'selector' en botón desplegable
    this.selector = this.elemento.querySelector('.selector') as HTMLElement;
    this.funciones.creaIcono(this.selector, this.vista, this.renderer);
    const iconoComponenteRef: ComponentRef<IconoComponent> = this.vista.createComponent(IconoComponent);
    iconoComponenteRef.instance.iconos = iconos;
    iconoComponenteRef.instance.color = 'gris-900';
    iconoComponenteRef.instance.tamano = 'mediano';
    iconoComponenteRef.instance.icono = 'caretDown';
    const iconoComponente: HTMLElement = iconoComponenteRef.location.nativeElement;
    this.renderer.addClass(iconoComponente, 'oca-icono-selector');
    this.renderer.appendChild(this.selector, iconoComponente);
    // Crea el contenedor div.enlaces
    this.renderer.addClass(this.enlaces, 'enlaces');
    this.renderer.appendChild(wrapper, this.enlaces);
    // Crea enlaces con iconos SVG externos
    const listaSVG: HTMLCollection = this.elemento.getElementsByClassName('svg');
    for (let i: number = 0; i < listaSVG.length; i++) {
      const svg: HTMLElement = listaSVG.item(i) as HTMLElement;
      const texto: any = this.renderer.createText(svg.innerHTML);
      const span: HTMLElement = this.renderer.createElement('span');
      this.renderer.addClass(span, 'texto');
      this.renderer.appendChild(span, texto);
      svg.innerHTML = '';
      const fuente: string = svg.getAttribute('fuente') as string;
      const nombre: string = svg.getAttribute('svg') as string;
      const imagen: any = this.renderer.createElement('img');
      this.renderer.addClass(imagen, 'img-svg');
      this.renderer.setAttribute(imagen, 'src', `assets/${fuente}/${nombre}.svg`);
      this.renderer.appendChild(svg, imagen);
      this.renderer.appendChild(svg, span);
      this.renderer.removeChild(this.selector, svg);
      this.listaEnlaces.push(svg);
    }
    this.selector.addEventListener('click', this.pliega.bind(this));
  }
  pliega(): void {
    if (this.plegado) {
      this.listaEnlaces.forEach((svg: HTMLElement) => {
        this.renderer.appendChild(this.enlaces, svg);
        this.animacionEntrada.create(svg).play();
      });
      this.renderer.addClass(this.selector, 'desplegado');
    } else {
      this.listaEnlaces.forEach((svg: HTMLElement) => {
        this.renderer.removeChild(this.enlaces, svg);
        this.animacionSalida.create(svg).play();
      });
      this.renderer.removeClass(this.selector, 'desplegado');
    }
    this.plegado = !this.plegado;
  }
}