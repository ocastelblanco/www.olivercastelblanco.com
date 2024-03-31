import { AnimationBuilder, AnimationFactory, AnimationMetadata, AnimationPlayer, animate, style } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, Renderer2, SimpleChanges } from '@angular/core';
import { Captura } from '@servicios/funciones.service';

@Component({
  selector: 'div[oca-overlay]',
  templateUrl: './overlay.component.html',
  host: {
    'class': 'overlay'
  },
})
export class OverlayComponent implements OnChanges, AfterViewInit {
  @Input() visible: boolean = false;
  @Input() data!: Captura;
  @Output() cerrar: EventEmitter<boolean> = new EventEmitter<boolean>();
  private elemento: HTMLElement = this.el.nativeElement as HTMLElement;
  private dialog: HTMLElement = this.elemento.querySelector('.dialog-overlay') as HTMLElement;
  private backdrop: HTMLElement = this.elemento.querySelector('.backdrop') as HTMLElement;
  private padre: HTMLElement = this.elemento.parentElement as HTMLElement;
  private body: HTMLElement = document.querySelector('body') as HTMLElement;
  private animEntrada: AnimationMetadata[] = [
    style({ transform: 'translateY(-100vh)', opacity: 0 }),
    animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
  ];
  private animSalida: AnimationMetadata[] = [
    style({ transform: 'translateY(0)', opacity: 1 }),
    animate('300ms ease-in', style({ transform: 'translateY(100vh)', opacity: 0 }))
  ];
  private animEntradaFactory: AnimationFactory = this.animBuild.build(this.animEntrada);
  private animSalidaFactory: AnimationFactory = this.animBuild.build(this.animSalida);
  private animEntradaPlayer!: AnimationPlayer;
  private animSalidaPlayer!: AnimationPlayer;
  constructor(private el: ElementRef, private render: Renderer2, private animBuild: AnimationBuilder) { }
  ngAfterViewInit(): void {
    this.reubica();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && !changes['visible'].isFirstChange()) this.toggleVisible(changes['visible'].currentValue);
  }
  cierra(): void {
    this.cerrar.emit(true);
  }
  reubica(): void {
    this.render.removeChild(this.padre, this.elemento);
    this.render.appendChild(this.body, this.elemento);
    this.dialog = this.elemento.querySelector('.dialog-overlay') as HTMLElement;
    this.backdrop = this.elemento.querySelector('.backdrop') as HTMLElement;
    this.animEntradaPlayer = this.animEntradaFactory.create(this.dialog);
    this.removeDialog();
  }
  toggleVisible(visible: boolean): void {
    if (visible) {
      this.addDialog();
      this.animEntradaPlayer.play();
    } else {
      this.animSalidaPlayer.play();
      this.animSalidaPlayer.onDone(() => {
        this.removeDialog();
        this.animSalidaPlayer.destroy();
      });
    }
  }
  addDialog(): void {
    this.render.appendChild(this.elemento, this.dialog);
    this.render.appendChild(this.elemento, this.backdrop);
    this.animSalidaPlayer = this.animSalidaFactory.create(this.dialog);
  }
  removeDialog(): void {
    this.render.removeChild(this.elemento, this.dialog);
    this.render.removeChild(this.elemento, this.backdrop);
  }
}
