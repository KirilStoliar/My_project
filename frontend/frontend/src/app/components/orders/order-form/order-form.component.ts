import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../order.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css']
})
export class OrderFormComponent implements OnInit {
  orderForm: FormGroup;
  isEditMode = false;
  orderId: number | null = null;
  loading = false;
  submitted = false;
  error: string = '';

  // Mock items for demo (в реальном проекте получать из сервиса)
  availableItems = [
    { id: 1, name: 'Item 1', price: 10.99 },
    { id: 2, name: 'Item 2', price: 15.50 },
    { id: 3, name: 'Item 3', price: 22.75 },
    { id: 4, name: 'Item 4', price: 8.99 },
    { id: 5, name: 'Item 5', price: 12.25 }
  ];

  get orderItems(): FormArray {
    return this.orderForm.get('orderItems') as FormArray;
  }

  constructor(
    private formBuilder: FormBuilder,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.orderForm = this.formBuilder.group({
      userId: ['', Validators.required],
      orderItems: this.formBuilder.array([], Validators.required)
    });
  }

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    this.orderForm.patchValue({ userId: currentUser.id });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.orderId = +params['id'];
        this.loadOrder(this.orderId);
      }
    });

    // Добавляем один элемент по умолчанию
    this.addOrderItem();
  }

  createOrderItem(): FormGroup {
    return this.formBuilder.group({
      itemId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  addOrderItem(): void {
    this.orderItems.push(this.createOrderItem());
  }

  removeOrderItem(index: number): void {
    this.orderItems.removeAt(index);
    if (this.orderItems.length === 0) {
      this.addOrderItem();
    }
  }

  loadOrder(id: number): void {
    this.loading = true;
    this.orderService.getOrderById(id).subscribe({
      next: (order) => {
        // Очищаем массив
        while (this.orderItems.length !== 0) {
          this.orderItems.removeAt(0);
        }

        // Добавляем элементы заказа
        order.orderItems.forEach(item => {
          this.orderItems.push(this.formBuilder.group({
            itemId: [item.itemId, Validators.required],
            quantity: [item.quantity, [Validators.required, Validators.min(1)]]
          }));
        });

        this.orderForm.patchValue({
          userId: order.userId
        });

        this.loading = false;
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to load order';
        this.loading = false;
      }
    });
  }

  getItemName(itemId: number): string {
    const item = this.availableItems.find(i => i.id === itemId);
    return item ? item.name : `Item #${itemId}`;
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    if (this.orderForm.invalid || this.orderItems.length === 0) {
      return;
    }

    this.loading = true;

    if (this.isEditMode && this.orderId) {
      const updateData = {
        status: 'PENDING', // Статус по умолчанию для обновления
        orderItems: this.orderForm.value.orderItems
      };

      this.orderService.updateOrder(this.orderId, updateData).subscribe({
        next: () => {
          this.router.navigate(['/orders']);
        },
        error: (error) => {
          this.error = error.error?.message || 'Failed to update order';
          this.loading = false;
        }
      });
    } else {
      this.orderService.createOrder(this.orderForm.value).subscribe({
        next: () => {
          this.router.navigate(['/orders']);
        },
        error: (error) => {
          this.error = error.error?.message || 'Failed to create order';
          this.loading = false;
        }
      });
    }
  }
}
