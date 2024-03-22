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
  ajax?: boolean;
}
export interface Idioma {
  sigla: string;
  idioma: string;
  bandera: string;
}
export interface Proyecto {
  nombre: string;
  titulo: string;
  portada: string;
  capturas: string[];
  descripcion: string[];
  enlace: string;
  fecha: string;
  cliente: string;
}
export interface Captura {
  img: string;
  txt: string;
}
export interface ProyectoPortafolio {
  nombre: string;
  titulo: string;
  portada: string;
  capturas: Captura[];
  descripcion: string[];
  enlace?: Vinculo;
  fecha?: string;
  cliente: string;
}
export interface Validador {
  nombre: string;
  textos: string[];
  regex: RegExp;
}
export interface CampoForm {
  nombre: string;
  textos: string[];
  tipo: string;
  placeholder: string[];
  validadores: string[];
}
export interface Contacteme {
  validadores: Validador[];
  titulo: string[];
  campos: CampoForm[];
  accion: Vinculo[];
  mensajes: { [key: string]: { titulo: string[], textos: string[] } };
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
  // Easing functions
  easeInOutQuad(t: number, b: number, c: number, d: number): number {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }
  easeOutElastic(t: number, b: number, c: number, d: number): number {
    return (easing(t / d) * c) + b;
    function easing(x: number): number {
      const c4 = (2 * Math.PI) / 3;
      return x === 0
        ? 0
        : x === 1
          ? 1
          : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
    }
  }
  easeOutBounce(t: number, b: number, c: number, d: number): number {
    return (easing(t / d) * c) + b;
    function easing(x: number): number {
      const n1 = 7.5625;
      const d1 = 2.75;
      if (x < 1 / d1) {
        return n1 * x * x;
      } else if (x < 2 / d1) {
        return n1 * (x -= 1.5 / d1) * x + 0.75;
      } else if (x < 2.5 / d1) {
        return n1 * (x -= 2.25 / d1) * x + 0.9375;
      } else {
        return n1 * (x -= 2.625 / d1) * x + 0.984375;
      }
    }
  }
  easeInOutExpo(t: number, b: number, c: number, d: number): number {
    return (easing(t / d) * c) + b;
    function easing(x: number): number {
      return x === 0
        ? 0
        : x === 1
          ? 1
          : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2
            : (2 - Math.pow(2, -20 * x + 10)) / 2;
    }
  }
}
