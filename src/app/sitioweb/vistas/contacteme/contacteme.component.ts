import { Component, effect } from '@angular/core';
import { DataService } from '@servicios/data.service';
import { CampoForm, FuncionesService, Vinculo, Contacteme, Validador } from '@servicios/funciones.service';
import { cambioSecciones } from 'src/app/shared/librerias/animaciones';
import { iconos } from '@componentes/icono/icono.lista';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { environment } from 'src/environments/environment';

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
  envioMensaje: 'previo' | 'enviando' | 'error' | 'enviado' = 'previo';
  _iconos: { [key: string]: IconDefinition } = iconos;
  constructor(private func: FuncionesService, private data: DataService, private recaptchaV3Service: ReCaptchaV3Service) {
    effect(() => this.idioma = this.func.idioma());
    this.data.getInterfaz().subscribe((_interfaz: any) => this.interfaz = _interfaz.contenidos.contacteme);
  }
  submitEnviar(enlace: Vinculo): void {
    this.recaptchaV3Service.execute('enviarInfo').subscribe({
      next: (response: string) => {
        this.data.sendPOST(environment.url_api + 'recaptcha', {
          secret: environment.google_recaptcha_site_secret,
          response: response
        }).subscribe((resp: any) => {
          if (resp) {
            if (resp.success && resp.score > 0.4) this.enviaInfo(enlace);
            else this.envioMensaje = 'error';
          }
        });
      },
      error: (error: any) => {
        console.log('ERROR:\n\r', error);
        this.envioMensaje = 'error';
      }
    });
  }
  enviaInfo(enlace: Vinculo): void {
    this.envioMensaje = 'enviando';
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
    if (enlace.ajax) this.data.sendPOST(environment.url_api + 'mensaje' as string, this.datos).subscribe((resp: any) => {
      if (resp && resp.$metadata && resp.$metadata.httpStatusCode && resp.$metadata.httpStatusCode == 200) {
        this.envioMensaje = 'enviado';
      } else {
        this.envioMensaje = 'error';
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
