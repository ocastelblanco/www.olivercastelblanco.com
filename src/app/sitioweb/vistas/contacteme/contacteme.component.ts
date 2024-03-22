import { Component, effect } from '@angular/core';
import { DataService } from '@servicios/data.service';
import { CampoForm, FuncionesService, Vinculo, Contacteme, Validador } from '@servicios/funciones.service';
import { cambioSecciones } from 'src/app/shared/librerias/animaciones';

@Component({
  selector: 'oca-contacteme',
  templateUrl: './contacteme.component.html',
  styleUrl: './contacteme.component.scss',
  animations: [
    cambioSecciones
  ]
})
export class ContactemeComponent {
  interfaz: Contacteme = { validadores: [], titulo: [], campos: [], accion: [], mensajes: {} };
  idioma: number = 0;
  datos: { [key: string]: string } = {};
  envioMensaje: 'formulario' | 'error' | 'enviado' = 'formulario';
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
        this.envioMensaje = 'enviado';
        console.log(this.interfaz.mensajes[this.envioMensaje].titulo[this.idioma]);
      } else {
        this.envioMensaje = 'error';
        console.log(this.interfaz.mensajes[this.envioMensaje].titulo[this.idioma]);
      }
    });
  }
  textoLabel(campo: CampoForm): string {
    let texto: string = campo.textos[this.idioma];
    if (campo.validadores.includes('obligatorio')) texto += '&nbsp;<span class="obligatorio">*</span>';
    return texto;
  }
  validaCampo(campo: CampoForm): boolean[] {
    const salida: boolean[] = [];
    if (this.datos[campo.nombre]) {
      campo.validadores.forEach((validador: string) => {
        const regex: RegExp = this.interfaz.validadores.find((val: Validador) => val.nombre == validador)?.regex as RegExp;
        salida.push(this.datos[campo.nombre].match(regex) ? true : false);
      });
    }
    return salida;
  }
  textoValidador(validador: string): string {
    return this.interfaz.validadores.find((val: Validador) => val.nombre == validador)?.textos[this.idioma] as string;
  }
  validaEnvio(): boolean {
    let valido: boolean = true;
    this.interfaz.campos
      .filter((campo: CampoForm) => campo.validadores.includes('obligatorio'))
      .map((campo: CampoForm) => this.datos[campo.nombre])
      .forEach((cont: string) => {
        if (!cont || cont.length < 3) valido = false;
      });
    return valido;
  }
}
