import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { CreateOrderRequest } from '../../models/order.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cart-page">
      <div class="eca-container">
        <!-- Page Header -->
        <div class="page-header">
          <h1>Sepetim</h1>
          @if (!cartService.isEmpty()) {
            <span class="item-count">{{ cartService.itemCount() }} ürün</span>
          }
        </div>

        @if (cartService.isEmpty()) {
          <!-- Empty Cart -->
          <div class="empty-cart eca-card">
            <div class="empty-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
            </div>
            <h2>Sepetiniz Boş</h2>
            <p>Henüz sepetinize ürün eklemediniz. Hemen alışverişe başlayın!</p>
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
          <!-- Cart Content -->
          <div class="cart-layout">
            <!-- Cart Items -->
            <div class="cart-items">
              @for (item of cartService.items(); track item.product.sku) {
                <div class="cart-item eca-card">
                  <div class="item-image">
                    @if (item.product.imageUrl) {
                      <img [src]="item.product.imageUrl" [alt]="item.product.name">
                    } @else {
                      <div class="item-placeholder">📦</div>
                    }
                  </div>
                  <div class="item-info">
                    <h3 class="item-name">{{ item.product.name }}</h3>
                    <p class="item-sku">SKU: {{ item.product.sku }}</p>
                    <p class="item-price">{{ formatPrice(item.product.priceCents, item.product.currency) }}</p>
                  </div>
                  <div class="item-quantity">
                    <button 
                      class="qty-btn" 
                      (click)="decreaseQuantity(item.product.sku)"
                      [disabled]="item.quantity <= 1">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                    </button>
                    <span class="qty-value">{{ item.quantity }}</span>
                    <button class="qty-btn" (click)="increaseQuantity(item.product.sku)">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                    </button>
                  </div>
                  <div class="item-subtotal">
                    {{ formatPrice(item.product.priceCents * item.quantity, item.product.currency) }}
                  </div>
                  <button class="remove-btn" (click)="removeItem(item.product.sku)" aria-label="Ürünü Kaldır">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      <line x1="10" y1="11" x2="10" y2="17"/>
                      <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
                  </button>
                </div>
              }
            </div>

            <!-- Order Summary -->
            <div class="order-summary eca-card">
              <h2>Sipariş Özeti</h2>
              
              <div class="summary-details">
                <div class="summary-row">
                  <span>Ürün Toplamı</span>
                  <span>{{ cartService.itemCount() }} adet</span>
                </div>
                <div class="summary-row">
                  <span>Ara Toplam</span>
                  <span>{{ formatPrice(cartService.totalCents(), 'TRY') }}</span>
                </div>
                <div class="summary-row">
                  <span>Kargo</span>
                  <span class="free-shipping">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Ücretsiz
                  </span>
                </div>
              </div>
              
              <div class="eca-divider"></div>
              
              <div class="summary-total">
                <span>Toplam</span>
                <span class="total-price">{{ formatPrice(cartService.totalCents(), 'TRY') }}</span>
              </div>

              @if (authService.isAuthenticated()) {
                <button 
                  class="checkout-btn eca-btn eca-btn-primary eca-btn-xl" 
                  (click)="checkout()"
                  [disabled]="isCheckingOut">
                  @if (isCheckingOut) {
                    <div class="eca-spinner eca-spinner-sm"></div>
                    İşleniyor...
                  } @else {
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                      <line x1="1" y1="10" x2="23" y2="10"/>
                    </svg>
                    Siparişi Tamamla
                  }
                </button>
              } @else {
                <button class="checkout-btn eca-btn eca-btn-primary eca-btn-xl" (click)="login()">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                    <polyline points="10 17 15 12 10 7"/>
                    <line x1="15" y1="12" x2="3" y2="12"/>
                  </svg>
                  Giriş Yap ve Devam Et
                </button>
                <p class="login-hint">Sipariş vermek için giriş yapmanız gerekmektedir.</p>
              }

              <button class="clear-btn eca-btn eca-btn-ghost" (click)="clearCart()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
                Sepeti Temizle
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .cart-page {
      padding: var(--spacing-8) 0;
      min-height: calc(100vh - var(--header-height));
      background: var(--gray-50);
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

    .item-count {
      font-size: var(--text-sm);
      color: var(--gray-500);
      background: var(--gray-100);
      padding: var(--spacing-1) var(--spacing-3);
      border-radius: var(--radius-full);
    }

    /* Empty Cart */
    .empty-cart {
      padding: var(--spacing-16);
      text-align: center;
      max-width: 480px;
      margin: 0 auto;
    }

    .empty-icon {
      color: var(--gray-300);
      margin-bottom: var(--spacing-6);
    }

    .empty-cart h2 {
      font-size: var(--text-2xl);
      font-weight: var(--font-semibold);
      color: var(--gray-900);
      margin-bottom: var(--spacing-2);
    }

    .empty-cart p {
      color: var(--gray-500);
      margin-bottom: var(--spacing-8);
    }

    /* Cart Layout */
    .cart-layout {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: var(--spacing-8);
      align-items: start;
    }

    /* Cart Items */
    .cart-items {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-4);
    }

    .cart-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-5);
      padding: var(--spacing-5);
    }

    .item-image {
      width: 100px;
      height: 100px;
      border-radius: var(--radius-lg);
      overflow: hidden;
      background: var(--gray-100);
      flex-shrink: 0;
    }

    .item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .item-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      font-size: 2.5rem;
    }

    .item-info {
      flex: 1;
      min-width: 0;
    }

    .item-name {
      font-size: var(--text-base);
      font-weight: var(--font-semibold);
      color: var(--gray-900);
      margin-bottom: var(--spacing-1);
    }

    .item-sku {
      font-size: var(--text-xs);
      color: var(--gray-400);
      margin-bottom: var(--spacing-2);
    }

    .item-price {
      font-weight: var(--font-semibold);
      color: var(--primary-600);
    }

    .item-quantity {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      background: var(--gray-100);
      border-radius: var(--radius-lg);
      padding: var(--spacing-1);
    }

    .qty-btn {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      border-radius: var(--radius-md);
      color: var(--gray-600);
      transition: all var(--transition-fast);
    }

    .qty-btn:hover:not(:disabled) {
      background: var(--gray-50);
      color: var(--gray-900);
    }

    .qty-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .qty-value {
      min-width: 40px;
      text-align: center;
      font-weight: var(--font-semibold);
      font-size: var(--text-base);
    }

    .item-subtotal {
      font-size: var(--text-lg);
      font-weight: var(--font-bold);
      color: var(--gray-900);
      min-width: 100px;
      text-align: right;
    }

    .remove-btn {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-lg);
      color: var(--gray-400);
      transition: all var(--transition-fast);
    }

    .remove-btn:hover {
      background: var(--error-50);
      color: var(--error-500);
    }

    /* Order Summary */
    .order-summary {
      padding: var(--spacing-6);
      position: sticky;
      top: calc(var(--header-height) + var(--spacing-8));
    }

    .order-summary h2 {
      font-size: var(--text-xl);
      font-weight: var(--font-semibold);
      color: var(--gray-900);
      margin-bottom: var(--spacing-6);
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

    .free-shipping {
      display: flex;
      align-items: center;
      gap: var(--spacing-1);
      color: var(--success-600);
      font-weight: var(--font-medium);
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
      font-size: var(--text-2xl);
      font-weight: var(--font-bold);
      color: var(--primary-600);
    }

    .checkout-btn {
      width: 100%;
      margin-top: var(--spacing-6);
    }

    .login-hint {
      font-size: var(--text-xs);
      color: var(--gray-500);
      text-align: center;
      margin-top: var(--spacing-2);
    }

    .clear-btn {
      width: 100%;
      margin-top: var(--spacing-3);
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .cart-layout {
        grid-template-columns: 1fr;
      }

      .order-summary {
        position: static;
      }
    }

    @media (max-width: 640px) {
      .page-header h1 {
        font-size: var(--text-2xl);
      }

      .cart-item {
        flex-wrap: wrap;
        gap: var(--spacing-4);
      }

      .item-info {
        flex: none;
        width: calc(100% - 116px);
      }

      .item-quantity {
        order: 1;
      }

      .item-subtotal {
        order: 2;
        min-width: auto;
        margin-left: auto;
      }

      .remove-btn {
        order: 3;
      }
    }
  `]
})
export class CartComponent {
  isCheckingOut = false;

  constructor(
    public cartService: CartService,
    public authService: AuthService,
    private orderService: OrderService,
    private router: Router
  ) {}

  increaseQuantity(sku: string): void {
    const currentQty = this.cartService.getItemQuantity(sku);
    this.cartService.updateQuantity(sku, currentQty + 1);
  }

  decreaseQuantity(sku: string): void {
    const currentQty = this.cartService.getItemQuantity(sku);
    this.cartService.updateQuantity(sku, currentQty - 1);
  }

  removeItem(sku: string): void {
    this.cartService.removeFromCart(sku);
  }

  clearCart(): void {
    if (confirm('Sepetinizi temizlemek istediğinizden emin misiniz?')) {
      this.cartService.clearCart();
    }
  }

  checkout(): void {
    const user = this.authService.currentUser();
    if (!user) return;

    this.isCheckingOut = true;

    const request: CreateOrderRequest = {
      userId: user.sub,
      currency: 'TRY',
      products: this.cartService.items().map(item => ({
        productSku: item.product.sku,
        quantity: item.quantity
      }))
    };

    this.orderService.createOrder(request).subscribe({
      next: (order) => {
        if (order) {
          this.cartService.clearCart();
          this.router.navigate(['/orders', order.id]);
        }
        this.isCheckingOut = false;
      },
      error: () => {
        this.isCheckingOut = false;
        alert('Sipariş oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    });
  }

  login(): void {
    this.authService.login();
  }

  goToProducts(): void {
    this.router.navigate(['/products']);
  }

  formatPrice(priceCents: number, currency: string): string {
    return this.cartService.formatPrice(priceCents, currency);
  }
}
