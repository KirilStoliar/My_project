import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../order.service';
import { PaymentService } from '../../payments/payment.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  paymentForm: FormGroup;
  orderId: number | null = null;
  orderTotal: number = 0;
  loading = false;
  submitted = false;
  error: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private orderService: OrderService,
    private paymentService: PaymentService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.paymentForm = this.formBuilder.group({
      paymentAmount: ['', [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.orderId = +params['id'];
        this.loadOrder(this.orderId);
      }
    });
  }

  loadOrder(id: number): void {
    this.loading = true;
    this.orderService.getOrderById(id).subscribe({
      next: (order) => {
        this.orderTotal = order.totalPrice;
        this.paymentForm.patchValue({
          paymentAmount: order.totalPrice
        });
        this.loading = false;
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to load order';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    if (this.paymentForm.invalid || !this.orderId) {
      return;
    }

    this.loading = true;
    const currentUser = this.authService.getCurrentUser();

    const paymentData = {
      orderId: this.orderId,
      userId: currentUser.id,
      paymentAmount: this.paymentForm.value.paymentAmount
    };

    this.paymentService.createPayment(paymentData).subscribe({
      next: (payment) => {
        alert(`Payment ${payment.status.toLowerCase()}! Payment ID: ${payment.id}`);
        this.router.navigate(['/orders']);
      },
      error: (error) => {
        this.error = error.error?.message || 'Payment failed';
        this.loading = false;
      }
    });
  }
}
