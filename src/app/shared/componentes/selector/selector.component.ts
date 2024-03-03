import { AfterViewInit, Component, ComponentRef, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges, ViewContainerRef } from '@angular/core';
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
  template: '<div class="selector-wrapper"><ng-content></ng-content></div>'
})
export class SelectorComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() plegado: boolean = true;
  private elemento!: HTMLElement;
  private listaEnlaces: Array<HTMLElement> = [];
  private enlaces: ElementRef = this.renderer.createElement('div');
  private selector!: HTMLElement;
  private wrapper!: HTMLElement;
  private caretDownIcon!: HTMLElement;
  constructor(
    private _elemento: ElementRef,
    private renderer: Renderer2,
    private vista: ViewContainerRef,
    private funciones: FuncionesService,
    private animationBuilder: AnimationBuilder
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['plegado'].isFirstChange()) {
      this.plegado = false;
      this.pliega();
    }
  }
  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    setTimeout(() => this.init(), 500);
  }
  init() {
    this.elemento = this._elemento.nativeElement;
    this.wrapper = this.elemento.querySelector('.selector-wrapper') as HTMLElement;
    // Convierte todos los <a> con clase 'selector' en botón desplegable
    this.selector = this.elemento.querySelector('.selector') as HTMLElement;
    this.funciones.creaIcono(this.selector, this.vista, this.renderer);
    const iconoComponenteRef: ComponentRef<IconoComponent> = this.vista.createComponent(IconoComponent);
    iconoComponenteRef.instance.iconos = iconos;
    iconoComponenteRef.instance.color = 'gris-900';
    iconoComponenteRef.instance.tamano = 'mediano';
    iconoComponenteRef.instance.icono = 'caretDown';
    this.caretDownIcon = iconoComponenteRef.location.nativeElement;
    this.renderer.addClass(this.caretDownIcon, 'oca-icono-selector');
    this.renderer.appendChild(this.selector, this.caretDownIcon);
    // Crea el contenedor div.enlaces
    this.renderer.addClass(this.enlaces, 'enlaces');
    this.renderer.appendChild(this.wrapper, this.enlaces);
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
    const alto: string = (((this.listaEnlaces.length + 1) * 42) + ((this.listaEnlaces.length - 1) * 8)) + 'px';
    const animaDespliegue: AnimationFactory = this.animationBuilder.build([
      style({ height: '*' }),
      animate('300ms ease-in', style({ height: alto }))
    ]);
    const animaPliegue: AnimationFactory = this.animationBuilder.build([
      style({ height: alto }),
      animate('300ms ease-in', style({ height: '42px' }))
    ]);
    const animaGiroAbre: AnimationFactory = this.animationBuilder.build([
      style({ transform: 'rotate(0deg' }),
      animate('300ms ease-in', style({ transform: 'rotate(180deg' }))
    ]);
    const animaGiroCierra: AnimationFactory = this.animationBuilder.build([
      style({ transform: 'rotate(180deg' }),
      animate('300ms ease-in', style({ transform: 'rotate(0deg' }))
    ]);
    if (this.plegado) {
      animaDespliegue.create(this.wrapper).play();
      animaGiroAbre.create(this.caretDownIcon).play();
      this.listaEnlaces.forEach((svg: HTMLElement) => this.renderer.appendChild(this.enlaces, svg));
      this.renderer.addClass(this.selector, 'desplegado');
    } else {
      animaGiroCierra.create(this.caretDownIcon).play();
      const player: AnimationPlayer = animaPliegue.create(this.wrapper);
      player.play();
      player.onDone(() => {
        this.listaEnlaces.forEach((svg: HTMLElement) => this.renderer.removeChild(this.enlaces, svg));
        this.renderer.removeClass(this.selector, 'desplegado');
      });
    }
    this.plegado = !this.plegado;
  }
}