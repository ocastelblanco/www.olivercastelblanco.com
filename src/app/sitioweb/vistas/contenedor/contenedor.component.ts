import { Component, OnInit, effect } from '@angular/core';
import { DataService } from '@servicios/data.service';
import { FuncionesService } from '@servicios/funciones.service';

@Component({
  selector: 'oca-contenedor',
  templateUrl: './contenedor.component.html',
  styleUrls: ['./contenedor.component.scss']
})
export class ContenedorComponent implements OnInit {
  logoComprimido: boolean = false;
  idioma!: number;
  interfaz!: any;
  constructor(private funciones: FuncionesService, private data: DataService) {
    effect(() => this.idioma = this.funciones.idioma());
    this.data.getInterfaz().subscribe((_interfaz: any) => {
      if (_interfaz) this.interfaz = _interfaz;
    });
  }
  ngOnInit(): void {
    setTimeout(() => this.logoComprimido = true, 2000);
  }
}
