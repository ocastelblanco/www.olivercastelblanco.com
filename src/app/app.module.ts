import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
// External modules
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
// Shared components
import { BotonComponent } from './shared/componentes/boton/boton.component';
import { IconoComponent } from './shared/componentes/icono/icono.component';
import { LogoComponent } from './shared/componentes/logo/logo.component';
import { FondoAnimadoComponent } from './shared/componentes/fondo-animado/fondo-animado.component';
import { BarraComponent } from './shared/componentes/barra/barra.component';
import { SelectorComponent } from './shared/componentes/selector/selector.component';
import { CardComponent } from './shared/componentes/card/card.component';
import { SafePipe } from './shared/pipes/safe.pipe';
import { VinculoComponent } from './shared/componentes/vinculo/vinculo.component';
// Views components
import { AppComponent } from './app.component';
import { ContenedorComponent } from './sitioweb/vistas/contenedor/contenedor.component';
import { InicioComponent } from './sitioweb/vistas/inicio/inicio.component';
import { PortafolioComponent } from './sitioweb/vistas/portafolio/portafolio.component';
import { CarruselComponent } from './shared/componentes/carrusel/carrusel.component';

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
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    FontAwesomeModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: []
})
export class AppModule { }
