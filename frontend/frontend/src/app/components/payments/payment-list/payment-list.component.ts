import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../payment.service';
import { AuthService } from '../../auth/auth.service';
import { Payment } from '../../../shared/models/payment.models';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.css']
})
export class PaymentListComponent implements OnInit {
  payments: Payment[] = [];
  loading = false;
  error: string = '';

  constructor(
    private paymentService: PaymentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.loading = true;
    const currentUser = this.authService.getCurrentUser();

    this.paymentService.getPaymentsByUser(currentUser.id)
      .subscribe({
        next: (payments) => {
          this.payments = payments;
          this.loading = false;
        },
        error: (error) => {
          this.error = error.error?.message || 'Failed to load payments';
          this.loading = false;
        }
      });
  }

  getStatusBadgeClass(status: string): string {
    switch(status) {
      case 'SUCCESS': return 'bg-success';
      case 'PENDING': return 'bg-warning';
      case 'FAILED': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }
}
