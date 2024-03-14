import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { ProyectoPortafolio } from '@servicios/funciones.service';

@Component({
  selector: 'div[oca-overlay]',
  template: '<div class="wrapper-overlay"><ng-content></ng-content></div><div class="backdrop"></div>',
  host: {
    'class': 'overlay'
  }
})
export class OverlayComponent implements OnInit {
  @Input() visible: boolean = false;
  @Input() data!: ProyectoPortafolio;
  private elemento: HTMLElement = this.el.nativeElement as HTMLElement;
  private padre: HTMLElement = this.elemento.parentElement as HTMLElement;
  private body: HTMLElement = document.querySelector('body') as HTMLElement;
  constructor(private el: ElementRef, private render: Renderer2) { }
  ngOnInit(): void {
    this.render.removeChild(this.padre, this.elemento);
  }
}
