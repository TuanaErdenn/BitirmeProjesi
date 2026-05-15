import { Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="order-detail-page">
      <div class="eca-container order-container">
        <!-- Back Button -->
        <button class="back-btn" (click)="goBack()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          Siparişlerime Dön
        </button>

        @if (!authService.isAuthenticated()) {
          <div class="auth-required eca-card">
            <div class="auth-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h2>Giriş Yapmanız Gerekiyor</h2>
            <p>Sipariş detaylarını görmek için hesabınıza giriş yapın.</p>
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
            <div class="order-skeleton">
              <div class="header-skeleton eca-card">
                <div class="eca-skeleton eca-skeleton-text" style="width: 200px; height: 32px;"></div>
                <div class="eca-skeleton eca-skeleton-text" style="width: 100px; height: 28px; border-radius: 9999px;"></div>
              </div>
              <div class="items-skeleton eca-card">
                <div class="eca-skeleton eca-skeleton-text" style="width: 150px; height: 24px; margin-bottom: var(--spacing-4);"></div>
                @for (i of [1, 2]; track i) {
                  <div class="item-skeleton">
                    <div class="eca-skeleton" style="width: 64px; height: 64px; border-radius: var(--radius-lg);"></div>
                    <div class="eca-skeleton eca-skeleton-text" style="flex: 1;"></div>
                    <div class="eca-skeleton eca-skeleton-text" style="width: 80px;"></div>
                  </div>
                }
              </div>
            </div>
          }

          <!-- Order Detail -->
          @if (orderService.selectedOrder(); as order) {
            <div class="order-detail">
              <!-- Order Header -->
              <div class="order-header-card eca-card">
                <div class="order-header-content">
                  <div class="header-info">
                    <span class="order-label">Sipariş Numarası</span>
                    <h1>#{{ order.id }}</h1>
                    <p class="order-date">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      {{ formatDate(order.createdAt) }}
                    </p>
                  </div>
                  <span class="order-status" [class]="'status-' + order.status.toLowerCase()">
                    {{ orderService.getStatusLabel(order.status) }}
                  </span>
                </div>

                <!-- Progress Indicator -->
                <div class="order-progress">
                  <div class="progress-step" [class.active]="isStepActive(order.status, 'awaiting_stock')" [class.completed]="isStepCompleted(order.status, 'awaiting_stock')">
                    <div class="step-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M16.5 9.4l-9-5.19"/>
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                      </svg>
                    </div>
                    <span>Stok Bekleniyor</span>
                  </div>
                  <div class="progress-line" [class.completed]="isStepCompleted(order.status, 'awaiting_payment')"></div>
                  <div class="progress-step" [class.active]="isStepActive(order.status, 'awaiting_payment')" [class.completed]="isStepCompleted(order.status, 'awaiting_payment')">
                    <div class="step-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                        <line x1="1" y1="10" x2="23" y2="10"/>
                      </svg>
                    </div>
                    <span>Ödeme Bekleniyor</span>
                  </div>
                  <div class="progress-line" [class.completed]="isStepCompleted(order.status, 'paid')"></div>
                  <div class="progress-step" [class.active]="isStepActive(order.status, 'paid')" [class.completed]="isStepCompleted(order.status, 'paid')">
                    <div class="step-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    <span>Ödendi</span>
                  </div>
                  <div class="progress-line" [class.completed]="isStepCompleted(order.status, 'fulfilled')"></div>
                  <div class="progress-step" [class.active]="isStepActive(order.status, 'fulfilled')" [class.completed]="isStepCompleted(order.status, 'fulfilled')">
                    <div class="step-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="1" y="3" width="15" height="13"/>
                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                        <circle cx="5.5" cy="18.5" r="2.5"/>
                        <circle cx="18.5" cy="18.5" r="2.5"/>
                      </svg>
                    </div>
                    <span>Teslim Edildi</span>
                  </div>
                </div>
              </div>

              <!-- Order Items -->
              <div class="order-items-card eca-card">
                <h2>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M16.5 9.4l-9-5.19"/>
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  </svg>
                  Sipariş Kalemleri
                </h2>
                @if (order.items && order.items.length > 0) {
                  <div class="items-list">
                    @for (item of order.items; track item.id) {
                      <div class="order-item">
                        <div class="item-image">
                          @if (getProductImage(item.productSku)) {
                            <img [src]="getProductImage(item.productSku)" [alt]="item.productSku">
                          } @else {
                            <div class="item-placeholder">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M16.5 9.4l-9-5.19"/>
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                              </svg>
                            </div>
                          }
                        </div>
                        <div class="item-details">
                          <h3>{{ getProductName(item.productSku) || item.productSku }}</h3>
                          <p class="item-sku">SKU: {{ item.productSku }}</p>
                        </div>
                        <div class="item-meta">
                          <div class="item-quantity">
                            <span class="qty-label">Adet</span>
                            <span class="qty-value">{{ item.quantity }}</span>
                          </div>
                          <div class="item-price">
                            <span class="price-label">Birim Fiyat</span>
                            <span class="price-value">{{ formatPrice(item.unitPriceCents, order.currency) }}</span>
                          </div>
                          <div class="item-subtotal">
                            <span class="subtotal-label">Ara Toplam</span>
                            <span class="subtotal-value">{{ formatPrice(item.subtotalCents, order.currency) }}</span>
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                } @else {
                  <div class="no-items">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                      <path d="M16.5 9.4l-9-5.19"/>
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    </svg>
                    <p>Sipariş kalemleri bulunamadı.</p>
                  </div>
                }
              </div>

              <!-- Order Summary -->
              <div class="order-summary-card eca-card">
                <h2>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="8" y1="6" x2="21" y2="6"/>
                    <line x1="8" y1="12" x2="21" y2="12"/>
                    <line x1="8" y1="18" x2="21" y2="18"/>
                    <line x1="3" y1="6" x2="3.01" y2="6"/>
                    <line x1="3" y1="12" x2="3.01" y2="12"/>
                    <line x1="3" y1="18" x2="3.01" y2="18"/>
                  </svg>
                  Sipariş Özeti
                </h2>
                <div class="summary-details">
                  <div class="summary-row">
                    <span>Sipariş No</span>
                    <span class="value">#{{ order.id }}</span>
                  </div>
                  <div class="summary-row">
                    <span>Durum</span>
                    <span class="value status-badge" [class]="'badge-' + order.status.toLowerCase()">
                      {{ orderService.getStatusLabel(order.status) }}
                    </span>
                  </div>
                  <div class="summary-row">
                    <span>Ödeme Durumu</span>
                    <span class="value payment-badge" [class]="'payment-' + order.paymentStatus.toLowerCase()">
                      {{ getPaymentLabel(order.paymentStatus) }}
                    </span>
                  </div>
                  <div class="summary-row">
                    <span>Para Birimi</span>
                    <span class="value">{{ order.currency }}</span>
                  </div>
                </div>
                <div class="eca-divider"></div>
                <div class="summary-total">
                  <span>Toplam Tutar</span>
                  <span class="total-price">{{ formatPrice(order.totalCents, order.currency) }}</span>
                </div>
              </div>

              <!-- Actions -->
              @if (order.status === 'awaiting_payment' || order.status === 'awaiting_stock') {
                <div class="order-actions">
                  <button 
                    class="eca-btn eca-btn-success eca-btn-xl pay-btn" 
                    (click)="payOrder()"
                    [disabled]="isProcessingPayment">
                    @if (isProcessingPayment) {
                      <div class="eca-spinner eca-spinner-sm"></div>
                      İşleniyor...
                    } @else {
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                        <line x1="1" y1="10" x2="23" y2="10"/>
                      </svg>
                      Ödeme Yap
                    }
                  </button>
                  <button class="eca-btn eca-btn-danger" (click)="cancelOrder()">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="15" y1="9" x2="9" y2="15"/>
                      <line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                    İptal Et
                  </button>
                </div>
              }
              @if (order.status === 'new') {
                <div class="order-actions">
                  <button class="eca-btn eca-btn-danger" (click)="cancelOrder()">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="15" y1="9" x2="9" y2="15"/>
                      <line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                    Siparişi İptal Et
                  </button>
                </div>
              }
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .order-detail-page {
      padding: var(--spacing-8) 0;
      min-height: calc(100vh - var(--header-height));
      background: var(--gray-50);
    }

    .order-container {
      max-width: 900px;
    }

    /* Back Button */
    .back-btn {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-2);
      background: none;
      border: none;
      color: var(--primary-600);
      font-size: var(--text-base);
      cursor: pointer;
      padding: var(--spacing-2) 0;
      margin-bottom: var(--spacing-6);
      font-weight: var(--font-medium);
      transition: all var(--transition-fast);
    }

    .back-btn:hover {
      color: var(--primary-700);
      gap: var(--spacing-3);
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
    .order-skeleton {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-6);
    }

    .header-skeleton {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-6);
    }

    .items-skeleton {
      padding: var(--spacing-6);
    }

    .item-skeleton {
      display: flex;
      align-items: center;
      gap: var(--spacing-4);
      padding: var(--spacing-4);
      background: var(--gray-50);
      border-radius: var(--radius-lg);
      margin-bottom: var(--spacing-3);
    }

    /* Order Detail */
    .order-detail {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-6);
    }

    /* Order Header Card */
    .order-header-card {
      padding: var(--spacing-6);
    }

    .order-header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--spacing-8);
    }

    .header-info {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-1);
    }

    .order-label {
      font-size: var(--text-sm);
      color: var(--gray-500);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .order-header-content h1 {
      font-size: var(--text-3xl);
      font-weight: var(--font-bold);
      color: var(--gray-900);
    }

    .order-date {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      color: var(--gray-500);
      font-size: var(--text-sm);
      margin-top: var(--spacing-1);
    }

    .order-status {
      padding: var(--spacing-2) var(--spacing-5);
      border-radius: var(--radius-full);
      font-weight: var(--font-semibold);
      font-size: var(--text-sm);
    }

    .status-pending, .status-new, .status-awaiting_payment {
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

    /* Progress Indicator */
    .order-progress {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: var(--spacing-4);
      border-top: 1px solid var(--gray-100);
    }

    .progress-step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-2);
      color: var(--gray-400);
    }

    .progress-step.active,
    .progress-step.completed {
      color: var(--primary-600);
    }

    .step-icon {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-full);
      background: var(--gray-100);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--transition-normal);
    }

    .progress-step.active .step-icon {
      background: var(--primary-100);
      color: var(--primary-600);
    }

    .progress-step.completed .step-icon {
      background: var(--success-500);
      color: white;
    }

    .progress-step span {
      font-size: var(--text-xs);
      font-weight: var(--font-medium);
      text-align: center;
    }

    .progress-line {
      flex: 1;
      height: 2px;
      background: var(--gray-200);
      margin: 0 var(--spacing-2);
      margin-bottom: var(--spacing-6);
    }

    .progress-line.completed {
      background: var(--success-500);
    }

    /* Order Items Card */
    .order-items-card {
      padding: var(--spacing-6);
    }

    .order-items-card h2,
    .order-summary-card h2 {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      font-size: var(--text-lg);
      font-weight: var(--font-semibold);
      color: var(--gray-900);
      margin-bottom: var(--spacing-6);
    }

    .order-items-card h2 svg,
    .order-summary-card h2 svg {
      color: var(--primary-500);
    }

    .items-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-4);
    }

    .order-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-5);
      padding: var(--spacing-5);
      background: var(--gray-50);
      border-radius: var(--radius-lg);
    }

    .item-image {
      width: 72px;
      height: 72px;
      border-radius: var(--radius-lg);
      overflow: hidden;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .item-placeholder {
      color: var(--gray-300);
    }

    .item-details {
      flex: 1;
      min-width: 0;
    }

    .item-details h3 {
      font-size: var(--text-base);
      font-weight: var(--font-semibold);
      color: var(--gray-900);
      margin-bottom: var(--spacing-1);
    }

    .item-sku {
      font-size: var(--text-xs);
      color: var(--gray-400);
    }

    .item-meta {
      display: flex;
      align-items: center;
      gap: var(--spacing-6);
    }

    .item-quantity,
    .item-price,
    .item-subtotal {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: var(--spacing-1);
    }

    .qty-label,
    .price-label,
    .subtotal-label {
      font-size: var(--text-xs);
      color: var(--gray-500);
    }

    .qty-value {
      font-weight: var(--font-semibold);
      color: var(--gray-700);
    }

    .price-value {
      color: var(--gray-600);
    }

    .subtotal-value {
      font-size: var(--text-lg);
      font-weight: var(--font-bold);
      color: var(--gray-900);
    }

    .no-items {
      text-align: center;
      padding: var(--spacing-8);
      color: var(--gray-400);
    }

    .no-items p {
      margin-top: var(--spacing-4);
      color: var(--gray-500);
    }

    /* Order Summary Card */
    .order-summary-card {
      padding: var(--spacing-6);
    }

    .summary-details {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-4);
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: var(--gray-600);
    }

    .summary-row .value {
      font-weight: var(--font-medium);
      color: var(--gray-900);
    }

    .status-badge {
      padding: var(--spacing-1) var(--spacing-3);
      border-radius: var(--radius-full);
      font-size: var(--text-sm);
    }

    .badge-pending, .badge-new, .badge-awaiting_payment {
      background: var(--warning-100);
      color: var(--warning-700);
    }

    .badge-processing {
      background: var(--primary-100);
      color: var(--primary-700);
    }

    .badge-shipped {
      background: var(--info-100);
      color: var(--info-700);
    }

    .badge-delivered {
      background: var(--success-100);
      color: var(--success-700);
    }

    .badge-cancelled {
      background: var(--error-100);
      color: var(--error-700);
    }

    .payment-badge {
      padding: var(--spacing-1) var(--spacing-3);
      border-radius: var(--radius-full);
      font-size: var(--text-sm);
    }

    .payment-paid {
      background: var(--success-100);
      color: var(--success-700);
    }

    .payment-pending {
      background: var(--warning-100);
      color: var(--warning-700);
    }

    .payment-failed {
      background: var(--error-100);
      color: var(--error-700);
    }

    .summary-total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: var(--spacing-4);
    }

    .summary-total span:first-child {
      font-size: var(--text-lg);
      font-weight: var(--font-semibold);
      color: var(--gray-900);
    }

    .total-price {
      font-size: var(--text-3xl);
      font-weight: var(--font-bold);
      color: var(--primary-600);
    }

    /* Order Actions */
    .order-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--spacing-4);
    }

    .pay-btn {
      background: var(--success-500);
    }

    .pay-btn:hover:not(:disabled) {
      background: var(--success-600);
    }

    /* Responsive */
    @media (max-width: 768px) {
      .order-header-content {
        flex-direction: column;
        gap: var(--spacing-4);
      }

      .order-progress {
        overflow-x: auto;
        padding-bottom: var(--spacing-4);
      }

      .progress-step span {
        white-space: nowrap;
      }

      .order-item {
        flex-direction: column;
        align-items: flex-start;
      }

      .item-meta {
        width: 100%;
        justify-content: space-between;
        margin-top: var(--spacing-4);
        padding-top: var(--spacing-4);
        border-top: 1px solid var(--gray-200);
      }

      .item-quantity,
      .item-price,
      .item-subtotal {
        align-items: center;
      }
    }
  `]
})
export class OrderDetailComponent implements OnInit {
  orderId: number = 0;
  productCache: Map<string, Product> = new Map();
  isProcessingPayment = false;

  // Backend order status flow: awaiting_stock -> awaiting_payment -> paid -> fulfilled
  private statusOrder = ['awaiting_stock', 'awaiting_payment', 'paid', 'fulfilled'];

  constructor(
    public orderService: OrderService,
    public authService: AuthService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Watch for auth state changes
    effect(() => {
      if (this.authService.isAuthenticated() && !this.authService.isLoading() && this.orderId > 0) {
        this.loadOrder();
      }
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.orderId = +params['id'];
      // Order will be loaded via effect when auth is ready
      if (this.authService.isAuthenticated() && !this.authService.isLoading()) {
        this.loadOrder();
      }
    });
  }

  loadOrder(): void {
    this.orderService.getOrder(this.orderId).subscribe(order => {
      if (order?.items) {
        const skus = order.items.map(item => item.productSku);
        this.loadProducts(skus);
      }
    });
  }

  loadProducts(skus: string[]): void {
    this.productService.getProductsBySku(skus).subscribe(products => {
      products.forEach(p => this.productCache.set(p.sku, p));
    });
  }

  getProductName(sku: string): string | undefined {
    return this.productCache.get(sku)?.name;
  }

  getProductImage(sku: string): string | undefined {
    return this.productCache.get(sku)?.imageUrl;
  }

  isStepActive(currentStatus: string, step: string): boolean {
    return currentStatus.toLowerCase() === step.toLowerCase();
  }

  isStepCompleted(currentStatus: string, step: string): boolean {
    const currentIndex = this.statusOrder.indexOf(currentStatus.toLowerCase());
    const stepIndex = this.statusOrder.indexOf(step.toLowerCase());
    return currentIndex > stepIndex;
  }

  payOrder(): void {
    this.isProcessingPayment = true;
    this.orderService.payOrder(this.orderId).subscribe({
      next: (success) => {
        this.isProcessingPayment = false;
        if (success) {
          alert('Ödeme başarıyla tamamlandı!');
        }
      },
      error: () => {
        this.isProcessingPayment = false;
        alert('Ödeme işlemi sırasında bir hata oluştu.');
      }
    });
  }

  cancelOrder(): void {
    if (confirm('Siparişi iptal etmek istediğinizden emin misiniz?')) {
      this.orderService.deleteOrder(this.orderId).subscribe(success => {
        if (success) {
          this.router.navigate(['/orders']);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/orders']);
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
