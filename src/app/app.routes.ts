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
    path: 'proyectos/:slug',
    loadComponent: () =>
      import('./features/proyectos/caso-detalle/caso-detalle').then(m => m.CasoDetalle),
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
