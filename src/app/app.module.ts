import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
// External modules
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
// Shared elements
import { BotonComponent } from './shared/componentes/boton/boton.component';
import { IconoComponent } from './shared/componentes/icono/icono.component';
import { LogoComponent } from './shared/componentes/logo/logo.component';
import { FondoAnimadoComponent } from './shared/componentes/fondo-animado/fondo-animado.component';
import { BarraComponent } from './shared/componentes/barra/barra.component';
import { SelectorComponent } from './shared/componentes/selector/selector.component';
import { CardComponent } from './shared/componentes/card/card.component';

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
