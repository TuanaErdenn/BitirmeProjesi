import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="product-detail-page">
      <div class="eca-container">
        <!-- Back Button -->
        <button class="back-btn" (click)="goBack()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          Ürünlere Dön
        </button>

        <!-- Loading State -->
        @if (productService.isLoading()) {
          <div class="product-skeleton eca-card">
            <div class="skeleton-image">
              <div class="eca-skeleton" style="width: 100%; height: 100%;"></div>
            </div>
            <div class="skeleton-info">
              <div class="eca-skeleton eca-skeleton-text" style="width: 60%; height: 36px;"></div>
              <div class="eca-skeleton eca-skeleton-text" style="width: 30%;"></div>
              <div class="eca-skeleton eca-skeleton-text" style="width: 100%;"></div>
              <div class="eca-skeleton eca-skeleton-text" style="width: 80%;"></div>
              <div class="eca-skeleton eca-skeleton-text" style="width: 40%; height: 48px;"></div>
            </div>
          </div>
        }

        <!-- Error State -->
        @if (productService.error()) {
          <div class="error-state eca-card">
            <div class="error-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h2>Ürün Bulunamadı</h2>
            <p>{{ productService.error() }}</p>
            <button class="eca-btn eca-btn-primary" (click)="loadProduct()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23 4 23 10 17 10"/>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
              </svg>
              Tekrar Dene
            </button>
          </div>
        }

        <!-- Product Detail -->
        @if (productService.selectedProduct(); as product) {
          <div class="product-detail eca-card">
            <div class="product-image-section">
              @if (product.imageUrl) {
                <img [src]="product.imageUrl" [alt]="product.name" class="product-image">
              } @else {
                <div class="placeholder-image">
                  <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                    <path d="M16.5 9.4l-9-5.19"/>
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                    <line x1="12" y1="22.08" x2="12" y2="12"/>
                  </svg>
                </div>
              }
              @if (cartService.isInCart(product.sku)) {
                <div class="in-cart-badge">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Sepette
                </div>
              }
            </div>

            <div class="product-info-section">
              <div class="product-header">
                <span class="product-sku">SKU: {{ product.sku }}</span>
                <h1>{{ product.name }}</h1>
              </div>

              <!-- Categories -->
              @if (product.categories && product.categories.length > 0) {
                <div class="product-categories">
                  @for (category of product.categories; track category.id) {
                    <span class="category-tag">{{ category.name }}</span>
                  }
                </div>
              }

              <p class="product-description">{{ product.description }}</p>

              <div class="product-price-section">
                <span class="price">{{ formatPrice(product.priceCents, product.currency) }}</span>
                <span class="stock-status" [class.in-stock]="product.isActive" [class.out-of-stock]="!product.isActive">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    @if (product.isActive) {
                      <polyline points="20 6 9 17 4 12"/>
                    } @else {
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="15" y1="9" x2="9" y2="15"/>
                      <line x1="9" y1="9" x2="15" y2="15"/>
                    }
                  </svg>
                  {{ product.isActive ? 'Stokta Var' : 'Stokta Yok' }}
                </span>
              </div>

              <div class="eca-divider"></div>

              <div class="quantity-section">
                <label>Adet Seçin:</label>
                <div class="quantity-controls">
                  <button 
                    class="qty-btn" 
                    (click)="decreaseQuantity()" 
                    [disabled]="quantity <= 1"
                    aria-label="Adet Azalt">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  </button>
                  <span class="qty-value">{{ quantity }}</span>
                  <button 
                    class="qty-btn" 
                    (click)="increaseQuantity()"
                    aria-label="Adet Artır">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <line x1="12" y1="5" x2="12" y2="19"/>
                      <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div class="action-buttons">
                <button 
                  class="eca-btn eca-btn-primary eca-btn-xl add-to-cart-btn" 
                  (click)="addToCart()"
                  [disabled]="!product.isActive">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="9" cy="21" r="1"/>
                    <circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                  @if (cartService.isInCart(product.sku)) {
                    Sepete Daha Ekle
                  } @else {
                    Sepete Ekle
                  }
                </button>
                <button class="eca-btn eca-btn-secondary eca-btn-xl" (click)="goToCart()">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                  Sepete Git
                </button>
              </div>

              @if (cartService.isInCart(product.sku)) {
                <div class="cart-info">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                  Bu üründen sepetinizde <strong>{{ cartService.getItemQuantity(product.sku) }} adet</strong> bulunmaktadır.
                </div>
              }

              <!-- Features -->
              <div class="product-features">
                <div class="feature">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="1" y="3" width="15" height="13"/>
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                    <circle cx="5.5" cy="18.5" r="2.5"/>
                    <circle cx="18.5" cy="18.5" r="2.5"/>
                  </svg>
                  <span>Ücretsiz Kargo</span>
                </div>
                <div class="feature">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <polyline points="23 4 23 10 17 10"/>
                    <polyline points="1 20 1 14 7 14"/>
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                  </svg>
                  <span>14 Gün İade</span>
                </div>
                <div class="feature">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  <span>Güvenli Ödeme</span>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .product-detail-page {
      padding: var(--spacing-8) 0;
      min-height: calc(100vh - var(--header-height));
      background: var(--gray-50);
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

    /* Skeleton Loading */
    .product-skeleton {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0;
      padding: 0;
      overflow: hidden;
    }

    .skeleton-image {
      background: var(--gray-100);
      min-height: 500px;
    }

    .skeleton-info {
      padding: var(--spacing-8);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-4);
    }

    /* Error State */
    .error-state {
      text-align: center;
      padding: var(--spacing-16);
      max-width: 480px;
      margin: 0 auto;
    }

    .error-icon {
      color: var(--gray-300);
      margin-bottom: var(--spacing-6);
    }

    .error-state h2 {
      font-size: var(--text-2xl);
      font-weight: var(--font-semibold);
      color: var(--gray-900);
      margin-bottom: var(--spacing-2);
    }

    .error-state p {
      color: var(--gray-500);
      margin-bottom: var(--spacing-6);
    }

    /* Product Detail */
    .product-detail {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0;
      padding: 0;
      overflow: hidden;
    }

    .product-image-section {
      position: relative;
      background: var(--gray-100);
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 500px;
    }

    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .placeholder-image {
      color: var(--gray-300);
    }

    .in-cart-badge {
      position: absolute;
      top: var(--spacing-4);
      left: var(--spacing-4);
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      background: var(--success-500);
      color: white;
      padding: var(--spacing-2) var(--spacing-4);
      border-radius: var(--radius-full);
      font-size: var(--text-sm);
      font-weight: var(--font-semibold);
    }

    .product-info-section {
      padding: var(--spacing-8);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-5);
    }

    .product-header {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2);
    }

    .product-header h1 {
      font-size: var(--text-3xl);
      font-weight: var(--font-bold);
      color: var(--gray-900);
      line-height: 1.2;
    }

    .product-sku {
      font-size: var(--text-sm);
      color: var(--gray-400);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .product-categories {
      display: flex;
      gap: var(--spacing-2);
      flex-wrap: wrap;
    }

    .category-tag {
      background: var(--gray-100);
      color: var(--gray-600);
      padding: var(--spacing-1) var(--spacing-3);
      border-radius: var(--radius-full);
      font-size: var(--text-sm);
    }

    .product-description {
      color: var(--gray-600);
      line-height: 1.8;
      font-size: var(--text-base);
    }

    .product-price-section {
      display: flex;
      align-items: center;
      gap: var(--spacing-4);
    }

    .price {
      font-size: var(--text-3xl);
      font-weight: var(--font-bold);
      color: var(--primary-600);
    }

    .stock-status {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-1);
      padding: var(--spacing-2) var(--spacing-4);
      border-radius: var(--radius-full);
      font-size: var(--text-sm);
      font-weight: var(--font-medium);
    }

    .stock-status.in-stock {
      background: var(--success-100);
      color: var(--success-700);
    }

    .stock-status.out-of-stock {
      background: var(--error-100);
      color: var(--error-700);
    }

    .quantity-section {
      display: flex;
      align-items: center;
      gap: var(--spacing-4);
    }

    .quantity-section label {
      font-weight: var(--font-medium);
      color: var(--gray-700);
    }

    .quantity-controls {
      display: flex;
      align-items: center;
      gap: var(--spacing-1);
      background: var(--gray-100);
      border-radius: var(--radius-lg);
      padding: var(--spacing-1);
    }

    .qty-btn {
      width: 44px;
      height: 44px;
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
      min-width: 50px;
      text-align: center;
      font-weight: var(--font-bold);
      font-size: var(--text-lg);
    }

    .action-buttons {
      display: flex;
      gap: var(--spacing-4);
    }

    .add-to-cart-btn {
      flex: 1;
    }

    .cart-info {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      background: var(--primary-50);
      color: var(--primary-700);
      padding: var(--spacing-4);
      border-radius: var(--radius-lg);
      font-size: var(--text-sm);
    }

    .cart-info strong {
      font-weight: var(--font-semibold);
    }

    /* Product Features */
    .product-features {
      display: flex;
      gap: var(--spacing-6);
      padding-top: var(--spacing-6);
      border-top: 1px solid var(--gray-100);
    }

    .feature {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      color: var(--gray-500);
      font-size: var(--text-sm);
    }

    .feature svg {
      color: var(--primary-500);
    }

    /* Responsive */
    @media (max-width: 900px) {
      .product-detail,
      .product-skeleton {
        grid-template-columns: 1fr;
      }

      .product-image-section,
      .skeleton-image {
        min-height: 350px;
      }

      .product-header h1 {
        font-size: var(--text-2xl);
      }

      .price {
        font-size: var(--text-2xl);
      }

      .action-buttons {
        flex-direction: column;
      }

      .product-features {
        flex-wrap: wrap;
        gap: var(--spacing-4);
      }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  productId: number = 0;
  quantity: number = 1;

  constructor(
    public productService: ProductService,
    public cartService: CartService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productId = +params['id'];
      this.loadProduct();
    });
  }

  loadProduct(): void {
    this.productService.getProduct(this.productId).subscribe();
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    const product = this.productService.selectedProduct();
    if (product && product.isActive) {
      this.cartService.addToCart(product, this.quantity);
      this.quantity = 1;
    }
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  formatPrice(priceCents: number, currency: string): string {
    return this.productService.formatPrice(priceCents, currency);
  }
}
