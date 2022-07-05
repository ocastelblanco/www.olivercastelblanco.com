import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
// External modules
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
// Shared components
import { BotonComponent } from './shared/componentes/boton/boton.component';
import { IconoComponent } from './shared/componentes/icono/icono.component';
// Views components
import { ContenedorComponent } from './sitioweb/vistas/contenedor/contenedor.component';
import { InicioComponent } from './sitioweb/vistas/inicio/inicio.component';
import { FondoAnimadoComponent } from './shared/componentes/fondo-animado/fondo-animado.component';

@NgModule({
  declarations: [
    AppComponent,
    BotonComponent,
    IconoComponent,
    ContenedorComponent,
    InicioComponent,
    FondoAnimadoComponent,
  ],
  imports: [
    BrowserModule,
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
  bootstrap: [AppComponent]
})
export class AppModule { }
