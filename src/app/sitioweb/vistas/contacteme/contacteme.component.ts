import { Component, effect } from '@angular/core';
import { DataService } from '@servicios/data.service';
import { CampoForm, FuncionesService, Vinculo } from '@servicios/funciones.service';
import { cambioSecciones } from 'src/app/shared/librerias/animaciones';

interface Contacteme {
  titulo: string[];
  campos: CampoForm[];
  accion: Vinculo[];
}

@Component({
  selector: 'oca-contacteme',
  templateUrl: './contacteme.component.html',
  styleUrl: './contacteme.component.scss',
  animations: [
    cambioSecciones
  ]
})
export class ContactemeComponent {
  interfaz: Contacteme = { titulo: [], campos: [], accion: [] };
  idioma: number = 0;
  datos: { [key: string]: string } = {};
  constructor(private func: FuncionesService, private data: DataService) {
    effect(() => this.idioma = this.func.idioma());
    this.data.getInterfaz().subscribe((_interfaz: any) => this.interfaz = _interfaz.contenidos.contacteme);
  }
  enviaInfo(enlace: Vinculo) {
    if (enlace.ajax) this.data.enviaAjax(enlace.enlace as string, this.datos);
  }
}
