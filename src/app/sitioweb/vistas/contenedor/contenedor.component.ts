import { Component, OnInit, effect } from '@angular/core';
import { DataService } from '@servicios/data.service';
import { FuncionesService, Idioma, Vinculo } from '@servicios/funciones.service';

@Component({
  selector: 'oca-contenedor',
  templateUrl: './contenedor.component.html',
  styleUrls: ['./contenedor.component.scss']
})
export class ContenedorComponent implements OnInit {
  logoComprimido: boolean = false;
  idioma!: number;
  idiomas: Idioma[] = [];
  interfaz!: { [key: string]: Vinculo[] };
  idiomaPlegado: boolean = true;
  constructor(private funciones: FuncionesService, private data: DataService) {
    effect(() => this.idioma = this.funciones.idioma());
    this.data.getInterfaz().subscribe((_interfaz: any) => {
      if (_interfaz) {
        this.interfaz = _interfaz.contenidos.contenedor;
        this.idiomas = _interfaz.estructura.idiomas;
      }
    });
  }
  ngOnInit(): void {
    setTimeout(() => this.logoComprimido = true, 2000);
  }
  cambiaIdioma(idioma: number): void {
    this.funciones.idioma.set(idioma);
    this.idiomaPlegado = !this.idiomaPlegado;
  }
}
