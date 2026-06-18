import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'entidades',
    loadComponent: () =>
      import('./entidades/entidades').then((m) => m.Entidades),
  },
  {
    path: 'entidades/nuevo',
    loadComponent: () =>
      import('./entidades/entidad-form/entidad-form').then((m) => m.EntidadForm),
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];
