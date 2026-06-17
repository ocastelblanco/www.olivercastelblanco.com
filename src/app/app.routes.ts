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
  {
    path: 'proyectos/conectatech',
    loadComponent: () =>
      import('./features/proyectos/conectatech/conectatech').then(m => m.Conectatech),
  },
  {
    path: 'proyectos/le-tiende',
    loadComponent: () =>
      import('./features/proyectos/le-tiende/le-tiende').then(m => m.LeTiende),
  },
];
