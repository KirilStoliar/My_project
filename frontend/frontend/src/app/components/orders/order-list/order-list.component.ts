import { Component, OnInit } from '@angular/core';
import { OrderService } from '../order.service';
import { AuthService } from '../../auth/auth.service';
import { Order } from '../../../shared/models/order.models';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  currentPage = 0;
  pageSize = 10;
  totalItems = 0;
  loading = false;
  error: string = '';

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    const currentUser = this.authService.getCurrentUser();

    this.orderService.getOrdersByUser(currentUser.id, this.currentPage, this.pageSize)
      .subscribe({
        next: (response) => {
          this.orders = response.content || response;
          this.totalItems = response.totalElements || this.orders.length;
          this.loading = false;
        },
        error: (error) => {
          this.error = error.error?.message || 'Failed to load orders';
          this.loading = false;
        }
      });
  }

  getStatusBadgeClass(status: string): string {
    switch(status) {
      case 'PENDING': return 'bg-warning';
      case 'CONFIRMED': return 'bg-info';
      case 'SHIPPED': return 'bg-primary';
      case 'DELIVERED': return 'bg-success';
      case 'CANCELLED': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  deleteOrder(id: number): void {
    if (confirm('Are you sure you want to delete this order?')) {
      this.orderService.deleteOrder(id).subscribe({
        next: () => {
          this.orders = this.orders.filter(order => order.id !== id);
        },
        error: (error) => {
          alert(error.error?.message || 'Failed to delete order');
        }
      });
    }
  }

  canEdit(order: Order): boolean {
    return order.status === 'PENDING' || order.status === 'CONFIRMED';
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadOrders();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }
}
