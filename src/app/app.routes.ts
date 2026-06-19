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
  {
    path: 'lab',
    loadComponent: () => import('./features/lab/lab').then(m => m.Lab),
  },
  {
    path: 'contacto',
    loadComponent: () => import('./features/contacto/contacto').then(m => m.Contacto),
  },
];
