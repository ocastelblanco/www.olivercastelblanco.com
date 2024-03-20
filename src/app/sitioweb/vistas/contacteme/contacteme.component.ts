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
    this.datos['destinatario'] = 'ocastelblanco@gmail.com';
    this.datos['asunto'] = 'Mensaje desde www.ocastelblanco.com';
    this.datos['html'] = `
      <h2>Has recibido un mensaje de alguien desde tu sitio web ocastelblanco.com</h2>
      <h3>NOMBRE</h3>
      <p>${this.datos['nombre']}</p>
      <h3>MENSAJE</h3>
      <p>${this.datos['mensaje'].replace(/[\r\n]/g, '<br><br>')}</p>
      <h3>EMAIL</h3>
      <p>${this.datos['email']}</p>
      <h3>CELULAR</h3>
      <p>${this.datos['celular']}</p>
    `;
    this.datos['texto'] = `
      Has recibido un mensaje de alguien desde tu sitio web ocastelblanco.com\r\n
      NOMBRE: ${this.datos['nombre']}\r\n
      MENSAJE: ${this.datos['mensaje']}\r\n
      EMAIL: ${this.datos['email']}\r\n
      CELULAR: ${this.datos['celular']}
    `;
    if (enlace.ajax) this.data.sendPOST(enlace.enlace as string, this.datos);
  }
}
