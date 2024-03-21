import { Component, effect } from '@angular/core';
import { DataService } from '@servicios/data.service';
import { CampoForm, FuncionesService, Vinculo } from '@servicios/funciones.service';
import { cambioSecciones } from 'src/app/shared/librerias/animaciones';

interface Contacteme {
  titulo: string[];
  campos: CampoForm[];
  accion: Vinculo[];
}
interface ValidaCampo {
  valido: boolean;
  validadores: { [key: string]: { textos: string[], valido: boolean } }[];
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
      <p>${this.datos['mensaje'].replace(/[\r\n]/g, '<br>')}</p>
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
    if (enlace.ajax) this.data.sendPOST(enlace.enlace as string, this.datos).subscribe((resp: any) => {
      if (resp && resp.$metadata && resp.$metadata.httpStatusCode && resp.$metadata.httpStatusCode == 200) {
        console.log('Envío correcto');
      } else {
        console.log('error');
      }
    });
  }
  textoLabel(campo: CampoForm): string {
    let texto: string = campo.textos[this.idioma];
    if (campo.obligatorio) texto += '&nbsp;<span class="obligatorio">*</span>';
    return texto;
  }
  validaCampo(campo: CampoForm): ValidaCampo {
    const _validaCampo: ValidaCampo = { valido: false, validadores: [] };
    const dato: string = this.datos[campo.nombre];
    const iterator: string[] = Object.keys(campo.validaciones ?? {});
    iterator.forEach((val: string) => {
      switch (val) {
        case 'obligatorio':
          _validaCampo.validadores.push({
            'obligatorio': {
              textos: campo.validaciones?.obligatorio as string[],
              valido: true
            }
          });
          break;
      }
    });
    return _validaCampo;
  }
  verificaTipoDato(dato: string, tipo: string): boolean {
    let resp: boolean = false;
    if (dato) {
      const emailRegex: RegExp = /.*@.*\..*/g
      const telRegex: RegExp = /\+?[0-9]{0,3}\s?[0-9]{7,10}/g
      switch (tipo) {
        case 'email':
          if (dato.match(emailRegex)) resp = true;
          break;
        case 'telephone':
          if (dato.match(telRegex)) resp = true;
          break;
        default:
          resp = false;
          break;
      }
    }
    return resp;
  }
}
