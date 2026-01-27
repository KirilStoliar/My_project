import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Order, OrderCreateDto, OrderUpdateDto } from '../../shared/models/order.models';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = environment.apiUrl + environment.orders.base;

  constructor(private http: HttpClient) {}

  getOrders(page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(this.apiUrl, { params });
  }

  getOrdersByUser(userId: number, page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(`${environment.apiUrl}${environment.orders.byUser}/${userId}`, { params });
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  createOrder(orderData: OrderCreateDto): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, orderData);
  }

  updateOrder(id: number, orderData: OrderUpdateDto): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}`, orderData);
  }

  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
