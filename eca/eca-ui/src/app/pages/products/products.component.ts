import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="products-page">
      <div class="eca-container">
        <!-- Page Header -->
        <div class="page-header">
          <div class="header-content">
            <h1>Ürünlerimiz</h1>
            <p>En kaliteli ürünleri keşfedin</p>
          </div>
          <div class="header-meta">
            <span class="product-count">{{ productService.products().length }} ürün</span>
          </div>
        </div>

        <!-- Loading State -->
        @if (productService.isLoading()) {
          <div class="products-grid">
            @for (i of [1,2,3,4,5,6]; track i) {
              <div class="product-card-skeleton eca-card">
                <div class="skeleton-image eca-skeleton"></div>
                <div class="skeleton-content">
                  <div class="skeleton-line eca-skeleton"></div>
                  <div class="skeleton-desc eca-skeleton"></div>
                  <div class="skeleton-footer">
                    <div class="skeleton-price eca-skeleton"></div>
                    <div class="skeleton-btn eca-skeleton"></div>
                  </div>
                </div>
              </div>
            }
          </div>
        }

        <!-- Error State -->
        @if (productService.error()) {
          <div class="error-state eca-card">
            <div class="error-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h3>Bir Hata Oluştu</h3>
            <p>{{ productService.error() }}</p>
            <button class="eca-btn eca-btn-primary" (click)="loadProducts()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23 4 23 10 17 10"/>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
              </svg>
              Tekrar Dene
            </button>
          </div>
        }

        <!-- Products Grid -->
        @if (!productService.isLoading() && !productService.error()) {
          <div class="products-grid">
            @for (product of productService.products(); track product.id) {
              <div class="product-card eca-card eca-card-interactive" (click)="viewProduct(product)">
                <div class="product-image">
                  @if (product.imageUrl) {
                    <img [src]="product.imageUrl" [alt]="product.name" loading="lazy">
                  } @else {
                    <div class="product-placeholder">📦</div>
                  }
                  @if (!product.isActive) {
                    <span class="product-badge out-of-stock">Stokta Yok</span>
                  }
                </div>
                <div class="product-content">
                  <h3 class="product-name">{{ product.name }}</h3>
                  <p class="product-description">{{ product.description | slice:0:80 }}...</p>
                  <div class="product-footer">
                    <span class="product-price">{{ formatPrice(product.priceCents, product.currency) }}</span>
                    <button 
                      class="product-btn"
                      [class.in-cart]="cartService.isInCart(product.sku)"
                      (click)="addToCart($event, product)"
                      [disabled]="!product.isActive">
                      @if (cartService.isInCart(product.sku)) {
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Sepette
                      } @else {
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <line x1="12" y1="5" x2="12" y2="19"/>
                          <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        Ekle
                      }
                    </button>
                  </div>
                </div>
              </div>
            } @empty {
              <div class="empty-state eca-empty-state">
                <span class="eca-empty-state-icon">📦</span>
                <h3 class="eca-empty-state-title">Henüz Ürün Yok</h3>
                <p class="eca-empty-state-text">Yakında yeni ürünler eklenecek!</p>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .products-page {
      padding: var(--spacing-8) 0;
      min-height: calc(100vh - var(--header-height));
      background: var(--gray-50);
    }

    /* Page Header */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: var(--spacing-8);
      padding-bottom: var(--spacing-6);
      border-bottom: 1px solid var(--gray-200);
    }

    .header-content h1 {
      font-size: var(--text-3xl);
      font-weight: var(--font-bold);
      color: var(--gray-900);
      margin-bottom: var(--spacing-2);
    }

    .header-content p {
      color: var(--gray-500);
      font-size: var(--text-lg);
    }

    .product-count {
      font-size: var(--text-sm);
      color: var(--gray-400);
      background: var(--gray-100);
      padding: var(--spacing-2) var(--spacing-4);
      border-radius: var(--radius-full);
    }

    /* Products Grid */
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: var(--spacing-6);
    }

    .product-card {
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .product-image {
      position: relative;
      aspect-ratio: 4/3;
      background: var(--gray-100);
      overflow: hidden;
    }

    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform var(--transition-slow);
    }

    .product-card:hover .product-image img {
      transform: scale(1.05);
    }

    .product-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      font-size: 4rem;
      color: var(--gray-300);
    }

    .product-badge {
      position: absolute;
      top: var(--spacing-3);
      right: var(--spacing-3);
      padding: var(--spacing-1) var(--spacing-3);
      border-radius: var(--radius-md);
      font-size: var(--text-xs);
      font-weight: var(--font-semibold);
    }

    .product-badge.out-of-stock {
      background: var(--error-500);
      color: white;
    }

    .product-content {
      padding: var(--spacing-5);
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .product-name {
      font-size: var(--text-lg);
      font-weight: var(--font-semibold);
      color: var(--gray-900);
      margin-bottom: var(--spacing-2);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .product-description {
      font-size: var(--text-sm);
      color: var(--gray-500);
      line-height: var(--leading-relaxed);
      margin-bottom: var(--spacing-4);
      flex: 1;
    }

    .product-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--spacing-4);
    }

    .product-price {
      font-size: var(--text-xl);
      font-weight: var(--font-bold);
      color: var(--primary-600);
    }

    .product-btn {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      padding: var(--spacing-2) var(--spacing-4);
      background: var(--gradient-primary);
      color: white;
      font-size: var(--text-sm);
      font-weight: var(--font-semibold);
      border-radius: var(--radius-lg);
      transition: all var(--transition-fast);
    }

    .product-btn:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }

    .product-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .product-btn.in-cart {
      background: var(--success-500);
    }

    /* Skeleton Loading */
    .product-card-skeleton {
      overflow: hidden;
    }

    .skeleton-image {
      aspect-ratio: 4/3;
    }

    .skeleton-content {
      padding: var(--spacing-5);
    }

    .skeleton-line {
      height: 24px;
      margin-bottom: var(--spacing-3);
      border-radius: var(--radius-sm);
    }

    .skeleton-desc {
      height: 48px;
      margin-bottom: var(--spacing-4);
      border-radius: var(--radius-sm);
    }

    .skeleton-footer {
      display: flex;
      justify-content: space-between;
      gap: var(--spacing-4);
    }

    .skeleton-price {
      width: 80px;
      height: 28px;
      border-radius: var(--radius-sm);
    }

    .skeleton-btn {
      width: 100px;
      height: 36px;
      border-radius: var(--radius-lg);
    }

    /* Error State */
    .error-state {
      grid-column: 1 / -1;
      padding: var(--spacing-16);
      text-align: center;
    }

    .error-icon {
      color: var(--error-500);
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

    /* Empty State */
    .empty-state {
      grid-column: 1 / -1;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--spacing-4);
      }

      .header-content h1 {
        font-size: var(--text-2xl);
      }

      .products-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProductsComponent implements OnInit {
  constructor(
    public productService: ProductService,
    public cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.loadProducts().subscribe();
  }

  viewProduct(product: Product): void {
    this.router.navigate(['/products', product.id]);
  }

  addToCart(event: Event, product: Product): void {
    event.stopPropagation();
    if (product.isActive) {
      this.cartService.addToCart(product, 1);
    }
  }

  formatPrice(priceCents: number, currency: string): string {
    return this.productService.formatPrice(priceCents, currency);
  }
}
