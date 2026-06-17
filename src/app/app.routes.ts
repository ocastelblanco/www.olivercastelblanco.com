import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then(m => m.Home),
  },
  {
    path: 'proyectos',
    loadComponent: () => import('./features/proyectos/proyectos').then(m => m.Proyectos),
  },
];
