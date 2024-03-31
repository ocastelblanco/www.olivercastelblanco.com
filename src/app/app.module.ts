import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FormsModule } from '@angular/forms';
import { environment } from '../environments/environment';
import { registerLocaleData } from '@angular/common';
import localeEsCO from '@angular/common/locales/es-CO';
import localeEsCOExtra from '@angular/common/locales/extra/es-CO';

// External modules
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from "ng-recaptcha";
// Shared components & pipes
import { BotonComponent } from '@componentes/boton/boton.component';
import { IconoComponent } from '@componentes/icono/icono.component';
import { LogoComponent } from '@componentes/logo/logo.component';
import { FondoAnimadoComponent } from '@componentes/fondo-animado/fondo-animado.component';
import { BarraComponent } from '@componentes/barra/barra.component';
import { SelectorComponent } from '@componentes/selector/selector.component';
import { CardComponent } from '@componentes/card/card.component';
import { VinculoComponent } from '@componentes/vinculo/vinculo.component';
import { CarruselComponent } from '@componentes/carrusel/carrusel.component';
import { OverlayComponent } from '@componentes/overlay/overlay.component';
import { SafePipe } from '@pipes/safe.pipe';
// Views components
import { AppComponent } from './app.component';
import { ContenedorComponent } from '@vistas/contenedor/contenedor.component';
import { InicioComponent } from '@vistas/inicio/inicio.component';
import { PortafolioComponent } from '@vistas/portafolio/portafolio.component';
import { ContactemeComponent } from '@vistas/contacteme/contacteme.component';
import { secrets } from '@secretos/secrets';

registerLocaleData(localeEsCO, 'es-CO', localeEsCOExtra);

@NgModule({
  declarations: [
    AppComponent,
    BotonComponent,
    IconoComponent,
    ContenedorComponent,
    InicioComponent,
    FondoAnimadoComponent,
    BarraComponent,
    LogoComponent,
    SelectorComponent,
    CardComponent,
    SafePipe,
    VinculoComponent,
    PortafolioComponent,
    CarruselComponent,
    OverlayComponent,
    ContactemeComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    FontAwesomeModule,
    RecaptchaV3Module,
  ],
  providers: [
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: secrets.google_recaptcha_site_key },
    { provide: LOCALE_ID, useValue: 'es-CO' },
  ],
  bootstrap: [AppComponent],
  exports: []
})
export class AppModule { }
