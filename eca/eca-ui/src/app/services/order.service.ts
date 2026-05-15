import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { Order, CreateOrderRequest } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly apiUrl = '/api/orders';

  // Signals for reactive state
  public orders = signal<Order[]>([]);
  public selectedOrder = signal<Order | null>(null);
  public isLoading = signal<boolean>(false);
  public error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  loadOrders(): Observable<Order[]> {
    this.isLoading.set(true);
    this.error.set(null);
    
    return this.http.get<Order[]>(this.apiUrl).pipe(
      tap((orders) => {
        this.orders.set(orders);
        this.isLoading.set(false);
      }),
      catchError((err) => {
        console.error('Error loading orders:', err);
        this.error.set('Siparişler yüklenirken bir hata oluştu');
        this.isLoading.set(false);
        return of([]);
      })
    );
  }

  getOrder(id: number): Observable<Order | null> {
    this.isLoading.set(true);
    this.error.set(null);
    
    return this.http.get<Order>(`${this.apiUrl}/${id}`).pipe(
      tap((order) => {
        this.selectedOrder.set(order);
        this.isLoading.set(false);
      }),
      catchError((err) => {
        console.error('Error loading order:', err);
        this.error.set('Sipariş yüklenirken bir hata oluştu');
        this.isLoading.set(false);
        return of(null);
      })
    );
  }

  createOrder(request: CreateOrderRequest): Observable<Order | null> {
    this.isLoading.set(true);
    this.error.set(null);
    
    return this.http.post<Order>(this.apiUrl, request).pipe(
      tap((order) => {
        // Add new order to the list
        this.orders.update(orders => [order, ...orders]);
        this.isLoading.set(false);
      }),
      catchError((err) => {
        console.error('Error creating order:', err);
        this.error.set('Sipariş oluşturulurken bir hata oluştu');
        this.isLoading.set(false);
        return of(null);
      })
    );
  }

  deleteOrder(id: number): Observable<boolean> {
    this.isLoading.set(true);
    
    return new Observable<boolean>(observer => {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe({
        next: () => {
          this.orders.update(orders => orders.filter(o => o.id !== id));
          this.isLoading.set(false);
          observer.next(true);
          observer.complete();
        },
        error: (err) => {
          console.error('Error deleting order:', err);
          this.error.set('Sipariş silinirken bir hata oluştu');
          this.isLoading.set(false);
          observer.next(false);
          observer.complete();
        }
      });
    });
  }

  payOrder(orderId: number): Observable<boolean> {
    this.isLoading.set(true);
    
    return new Observable<boolean>(observer => {
      this.http.get(`/api/v1/payments/${orderId}`).subscribe({
        next: () => {
          // Reload the order to get updated status
          this.getOrder(orderId).subscribe();
          this.isLoading.set(false);
          observer.next(true);
          observer.complete();
        },
        error: (err) => {
          console.error('Error processing payment:', err);
          this.error.set('Ödeme işlemi sırasında bir hata oluştu');
          this.isLoading.set(false);
          observer.next(false);
          observer.complete();
        }
      });
    });
  }

  getStatusLabel(status: string): string {
    const statusLabels: Record<string, string> = {
      'new': 'Yeni',
      'awaiting_stock': 'Stok Bekleniyor',
      'awaiting_payment': 'Ödeme Bekleniyor',
      'paid': 'Ödendi',
      'cancelled': 'İptal Edildi',
      'fulfilled': 'Tamamlandı'
    };
    return statusLabels[status] || status;
  }

  getStatusColor(status: string): string {
    const statusColors: Record<string, string> = {
      'new': '#3b82f6',
      'awaiting_stock': '#f59e0b',
      'awaiting_payment': '#f59e0b',
      'paid': '#10b981',
      'cancelled': '#ef4444',
      'fulfilled': '#6366f1'
    };
    return statusColors[status] || '#6b7280';
  }

  formatPrice(priceCents: number, currency: string = 'TRY'): string {
    const price = priceCents / 100;
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency
    }).format(price);
  }
}
