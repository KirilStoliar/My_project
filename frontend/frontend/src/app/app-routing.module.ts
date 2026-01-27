import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { OrderListComponent } from './components/orders/order-list/order-list.component';
import { OrderFormComponent } from './components/orders/order-form/order-form.component';
import { PaymentListComponent } from './components/payments/payment-list/payment-list.component';
import { PaymentComponent } from './components/orders/payment/payment.component';

const routes: Routes = [
  { path: '', redirectTo: '/orders', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Protected routes
  {
    path: 'orders',
    component: OrderListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'orders/new',
    component: OrderFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'orders/:id/edit',
    component: OrderFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'orders/:id/pay',
    component: PaymentComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'payments',
    component: PaymentListComponent,
    canActivate: [AuthGuard]
  },

  // Wildcard route
  { path: '**', redirectTo: '/orders' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
