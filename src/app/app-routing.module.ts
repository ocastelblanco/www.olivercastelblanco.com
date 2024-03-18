import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from '@vistas/inicio/inicio.component';
import { PortafolioComponent } from '@vistas/portafolio/portafolio.component';
import { ContactemeComponent } from '@vistas/contacteme/contacteme.component';

const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: InicioComponent, data: { animation: 'Inicio' } },
  { path: 'portafolio', component: PortafolioComponent, data: { animation: 'Portafolio' } },
  { path: 'contacteme', component: ContactemeComponent, data: { animation: 'Contacteme' } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
