import { Routes } from '@angular/router';
import { InicioComponent } from './vistas/inicio/inicio.component';

export const routes: Routes = [
  { path: 'inicio', component: InicioComponent, title: 'Oliver Castelblanco' },
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
];
