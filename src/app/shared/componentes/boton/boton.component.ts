import { Component, Input, OnInit, Renderer2, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'oca-boton',
  templateUrl: './boton.component.html',
  styleUrls: ['./boton.component.scss']
})
export class BotonComponent implements OnInit {
  @Input() contenido: 'texto' | 'icono+texto' | 'icono' = 'texto';
  @Input() tipo: 'primario' | 'acento' = 'primario';
  @Input() label: string = 'Aceptar';
  @Input() estado: 'activo' | 'over' | 'press' = 'activo';
  @Input() icono: any;
  constructor(private vista: ViewContainerRef, private renderer: Renderer2) { }
  ngOnInit(): void {
    const componente: HTMLElement = this.vista.element.nativeElement;
    const boton: HTMLElement = componente.getElementsByTagName('button')[0];
    const envoltura: HTMLElement = this.renderer.createElement('div');
    this.renderer.addClass(envoltura, 'envoltura-boton');
    this.renderer.removeChild(componente, boton);
    this.renderer.appendChild(componente, envoltura);
    this.renderer.appendChild(envoltura, boton);
  }
}
