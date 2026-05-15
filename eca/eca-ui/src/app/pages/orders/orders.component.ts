import { Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="orders-page">
      <div class="eca-container orders-container">
        <!-- Page Header -->
        <div class="page-header">
          <h1>Siparişlerim</h1>
          @if (authService.isAuthenticated() && !orderService.isLoading() && orderService.orders().length > 0) {
            <span class="order-count">{{ orderService.orders().length }} sipariş</span>
          }
        </div>

        @if (!authService.isAuthenticated()) {
          <!-- Login Required -->
          <div class="auth-required eca-card">
            <div class="auth-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h2>Giriş Yapmanız Gerekiyor</h2>
            <p>Siparişlerinizi görmek için hesabınıza giriş yapın.</p>
            <button class="eca-btn eca-btn-primary eca-btn-lg" (click)="login()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
              Giriş Yap
            </button>
          </div>
        } @else {
          <!-- Loading State -->
          @if (orderService.isLoading()) {
            <div class="orders-skeleton">
              @for (i of [1, 2, 3]; track i) {
                <div class="order-skeleton eca-card">
                  <div class="skeleton-header">
                    <div class="eca-skeleton eca-skeleton-text" style="width: 120px; height: 24px;"></div>
                    <div class="eca-skeleton eca-skeleton-text" style="width: 80px; height: 28px; border-radius: 9999px;"></div>
                  </div>
                  <div class="skeleton-body">
                    <div class="eca-skeleton eca-skeleton-text" style="width: 60%;"></div>
                    <div class="eca-skeleton eca-skeleton-text" style="width: 100px; height: 32px;"></div>
                  </div>
                </div>
              }
            </div>
          }

          <!-- Error State -->
          @if (orderService.error()) {
            <div class="error-state eca-card">
              <div class="error-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <h3>Bir Hata Oluştu</h3>
              <p>{{ orderService.error() }}</p>
              <button class="eca-btn eca-btn-primary" (click)="loadOrders()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="23 4 23 10 17 10"/>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
                Tekrar Dene
              </button>
            </div>
          }

          <!-- Orders List -->
          @if (!orderService.isLoading() && !orderService.error()) {
            @if (orderService.orders().length === 0) {
              <div class="empty-orders eca-card">
                <div class="empty-icon">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                    <path d="M16.5 9.4l-9-5.19"/>
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                    <line x1="12" y1="22.08" x2="12" y2="12"/>
                  </svg>
                </div>
                <h2>Henüz Siparişiniz Yok</h2>
                <p>İlk siparişinizi vermek için alışverişe başlayın.</p>
                <button class="eca-btn eca-btn-primary eca-btn-lg" (click)="goToProducts()">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 0 1-8 0"/>
                  </svg>
                  Alışverişe Başla
                </button>
              </div>
            } @else {
              <div class="orders-list">
                @for (order of orderService.orders(); track order.id) {
                  <article class="order-card eca-card" (click)="viewOrder(order.id)">
                    <div class="order-header">
                      <div class="order-id">
                        <span class="label">Sipariş No</span>
                        <span class="value">#{{ order.id }}</span>
                      </div>
                      <span 
                        class="order-status" 
                        [class]="'status-' + order.status.toLowerCase()"
                      >
                        {{ orderService.getStatusLabel(order.status) }}
                      </span>
                    </div>
                    
                    <div class="order-body">
                      <div class="order-info">
                        <div class="info-item">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                          </svg>
                          <div>
                            <span class="label">Tarih</span>
                            <span class="value">{{ formatDate(order.createdAt) }}</span>
                          </div>
                        </div>
                        <div class="info-item">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                            <line x1="1" y1="10" x2="23" y2="10"/>
                          </svg>
                          <div>
                            <span class="label">Ödeme</span>
                            <span class="value payment" [class]="'payment-' + order.paymentStatus.toLowerCase()">
                              {{ getPaymentLabel(order.paymentStatus) }}
                            </span>
                          </div>
                        </div>
                        <div class="info-item">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M16.5 9.4l-9-5.19"/>
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                          </svg>
                          <div>
                            <span class="label">Ürün</span>
                            <span class="value">{{ order.items?.length || 0 }} adet</span>
                          </div>
                        </div>
                      </div>
                      
                      <div class="order-total">
                        <span class="label">Toplam</span>
                        <span class="value">{{ formatPrice(order.totalCents, order.currency) }}</span>
                      </div>
                    </div>

                    <div class="order-footer">
                      <span class="view-details">
                        Detayları Görüntüle
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <line x1="5" y1="12" x2="19" y2="12"/>
                          <polyline points="12 5 19 12 12 19"/>
                        </svg>
                      </span>
                    </div>
                  </article>
                }
              </div>
            }
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .orders-page {
      padding: var(--spacing-8) 0;
      min-height: calc(100vh - var(--header-height));
      background: var(--gray-50);
    }

    .orders-container {
      max-width: 900px;
    }

    /* Page Header */
    .page-header {
      display: flex;
      align-items: center;
      gap: var(--spacing-4);
      margin-bottom: var(--spacing-8);
    }

    .page-header h1 {
      font-size: var(--text-3xl);
      font-weight: var(--font-bold);
      color: var(--gray-900);
    }

    .order-count {
      font-size: var(--text-sm);
      color: var(--gray-500);
      background: var(--gray-100);
      padding: var(--spacing-1) var(--spacing-3);
      border-radius: var(--radius-full);
    }

    /* Auth Required */
    .auth-required {
      text-align: center;
      padding: var(--spacing-16);
      max-width: 480px;
      margin: 0 auto;
    }

    .auth-icon {
      color: var(--gray-300);
      margin-bottom: var(--spacing-6);
    }

    .auth-required h2 {
      font-size: var(--text-2xl);
      font-weight: var(--font-semibold);
      color: var(--gray-900);
      margin-bottom: var(--spacing-2);
    }

    .auth-required p {
      color: var(--gray-500);
      margin-bottom: var(--spacing-8);
    }

    /* Skeleton Loading */
    .orders-skeleton {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-4);
    }

    .order-skeleton {
      padding: 0;
      overflow: hidden;
    }

    .skeleton-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-5);
      background: var(--gray-50);
      border-bottom: 1px solid var(--gray-100);
    }

    .skeleton-body {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-6);
    }

    /* Error State */
    .error-state {
      text-align: center;
      padding: var(--spacing-12);
    }

    .error-icon {
      color: var(--error-400);
      margin-bottom: var(--spacing-4);
    }

    .error-state h3 {
      font-size: var(--text-xl);
      font-weight: var(--font-semibold);
      color: var(--gray-900);
      margin-bottom: var(--spacing-2);
    }

    .error-state p {
      color: var(--gray-500);
      margin-bottom: var(--spacing-6);
    }

    /* Empty Orders */
    .empty-orders {
      text-align: center;
      padding: var(--spacing-16);
      max-width: 480px;
      margin: 0 auto;
    }

    .empty-icon {
      color: var(--gray-300);
      margin-bottom: var(--spacing-6);
    }

    .empty-orders h2 {
      font-size: var(--text-2xl);
      font-weight: var(--font-semibold);
      color: var(--gray-900);
      margin-bottom: var(--spacing-2);
    }

    .empty-orders p {
      color: var(--gray-500);
      margin-bottom: var(--spacing-8);
    }

    /* Orders List */
    .orders-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-4);
    }

    .order-card {
      padding: 0;
      overflow: hidden;
      cursor: pointer;
      transition: all var(--transition-normal);
    }

    .order-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-5) var(--spacing-6);
      background: var(--gray-50);
      border-bottom: 1px solid var(--gray-100);
    }

    .order-id .label {
      display: block;
      font-size: var(--text-xs);
      color: var(--gray-500);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: var(--spacing-1);
    }

    .order-id .value {
      font-size: var(--text-xl);
      font-weight: var(--font-bold);
      color: var(--gray-900);
    }

    .order-status {
      padding: var(--spacing-1) var(--spacing-4);
      border-radius: var(--radius-full);
      font-size: var(--text-sm);
      font-weight: var(--font-semibold);
    }

    .status-pending {
      background: var(--warning-100);
      color: var(--warning-700);
    }

    .status-processing {
      background: var(--primary-100);
      color: var(--primary-700);
    }

    .status-shipped {
      background: var(--info-100);
      color: var(--info-700);
    }

    .status-delivered {
      background: var(--success-100);
      color: var(--success-700);
    }

    .status-cancelled {
      background: var(--error-100);
      color: var(--error-700);
    }

    .order-body {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-6);
    }

    .order-info {
      display: flex;
      gap: var(--spacing-8);
    }

    .info-item {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-3);
      color: var(--gray-400);
    }

    .info-item svg {
      margin-top: 2px;
    }

    .info-item .label {
      display: block;
      font-size: var(--text-xs);
      color: var(--gray-500);
      margin-bottom: var(--spacing-1);
    }

    .info-item .value {
      font-weight: var(--font-medium);
      color: var(--gray-900);
    }

    .payment.payment-paid {
      color: var(--success-600);
    }

    .payment.payment-pending {
      color: var(--warning-600);
    }

    .payment.payment-failed {
      color: var(--error-600);
    }

    .order-total {
      text-align: right;
    }

    .order-total .label {
      display: block;
      font-size: var(--text-xs);
      color: var(--gray-500);
      margin-bottom: var(--spacing-1);
    }

    .order-total .value {
      font-size: var(--text-2xl);
      font-weight: var(--font-bold);
      color: var(--primary-600);
    }

    .order-footer {
      padding: var(--spacing-4) var(--spacing-6);
      background: var(--gray-50);
      border-top: 1px solid var(--gray-100);
    }

    .view-details {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-2);
      color: var(--primary-600);
      font-weight: var(--font-medium);
      font-size: var(--text-sm);
      transition: gap var(--transition-fast);
    }

    .order-card:hover .view-details {
      gap: var(--spacing-3);
    }

    /* Responsive */
    @media (max-width: 640px) {
      .page-header h1 {
        font-size: var(--text-2xl);
      }

      .order-body {
        flex-direction: column;
        gap: var(--spacing-6);
        align-items: flex-start;
      }

      .order-info {
        flex-direction: column;
        gap: var(--spacing-4);
      }

      .order-total {
        text-align: left;
        width: 100%;
        padding-top: var(--spacing-4);
        border-top: 1px solid var(--gray-100);
      }
    }
  `]
})
export class OrdersComponent implements OnInit {
  constructor(
    public orderService: OrderService,
    public authService: AuthService,
    private router: Router
  ) {
    // Watch for auth state changes and load orders when authenticated
    effect(() => {
      if (this.authService.isAuthenticated() && !this.authService.isLoading()) {
        this.loadOrders();
      }
    });
  }

  ngOnInit(): void {
    // Orders will be loaded via effect when auth is ready
  }

  loadOrders(): void {
    this.orderService.loadOrders().subscribe();
  }

  viewOrder(id: number): void {
    this.router.navigate(['/orders', id]);
  }

  goToProducts(): void {
    this.router.navigate(['/products']);
  }

  login(): void {
    this.authService.login();
  }

  formatPrice(priceCents: number, currency: string): string {
    return this.orderService.formatPrice(priceCents, currency);
  }

  formatDate(date?: string): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getPaymentLabel(status: string): string {
    const labels: Record<string, string> = {
      'PAID': 'Ödendi',
      'PENDING': 'Bekliyor',
      'FAILED': 'Başarısız'
    };
    return labels[status] || status;
  }
}
