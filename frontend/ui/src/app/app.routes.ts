import { Routes } from '@angular/router';
import { authCanMatch } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'orders',
  },
  {
    path: 'auth',
    loadComponent: () => import('./pages/auth/auth.page').then((m) => m.Auth),
  },
  {
    path: 'orders',
    canMatch: [authCanMatch],
    loadChildren: () => import('./pages/orders/orders.page').then(m => m.Orders),
  }
];
