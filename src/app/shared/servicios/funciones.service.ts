import { Injectable, ComponentRef, ViewContainerRef, Renderer2, WritableSignal, signal } from '@angular/core';
import { IconoComponent } from '@componentes/icono/icono.component';
import { iconos } from '@componentes/icono/icono.lista';

export interface Vinculo {
  nombre: string;
  textos: string[];
  icono: string;
  enlace?: string;
  blank?: boolean;
  activeLink?: boolean;
  download?: boolean;
  contenido?: 'texto' | 'icono+texto' | 'icono';
  tipo?: 'primario' | 'acento';
}
export interface Idioma {
  sigla: string;
  idioma: string;
  bandera: string;
}

@Injectable({
  providedIn: 'root'
})
export class FuncionesService {
  public idioma: WritableSignal<number> = signal(0);
  constructor() { }
  creaIcono(parent: HTMLElement, vista: ViewContainerRef, renderer: Renderer2, _icono: string | null = null): HTMLElement {
    const icono: string = _icono ?? parent.getAttribute('icono') as string;
    const iconoComponenteRef: ComponentRef<IconoComponent> = vista.createComponent(IconoComponent);
    iconoComponenteRef.instance.iconos = iconos;
    iconoComponenteRef.instance.color = 'gris-900';
    iconoComponenteRef.instance.tamano = 'mediano';
    iconoComponenteRef.instance.icono = icono;
    const iconoComponente: HTMLElement = iconoComponenteRef.location.nativeElement;
    renderer.addClass(iconoComponente, 'oca-icono');
    renderer.appendChild(parent, iconoComponente);
    return iconoComponente;
  }
}
