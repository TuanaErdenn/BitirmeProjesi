import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home-page">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-bg">
          <div class="hero-gradient"></div>
          <div class="hero-pattern"></div>
        </div>
        <div class="hero-container">
          <div class="hero-content">
            <span class="hero-badge">
              <span class="badge-dot"></span>
              Yeni Koleksiyon 2026
            </span>
            <h1 class="hero-title">
              Premium E-Commerce
              <span class="hero-title-accent">Deneyimi</span>
            </h1>
            <p class="hero-description">
              En kaliteli ürünleri en uygun fiyatlarla keşfedin. 
              Güvenli ödeme, hızlı teslimat ve 7/24 müşteri desteği.
            </p>
            <div class="hero-actions">
              @if (!authService.isAuthenticated()) {
                <button class="eca-btn eca-btn-primary eca-btn-xl" (click)="authService.login()">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                    <polyline points="10 17 15 12 10 7"/>
                    <line x1="15" y1="12" x2="3" y2="12"/>
                  </svg>
                  Hemen Başla
                </button>
              }
              <button class="eca-btn eca-btn-secondary eca-btn-xl" (click)="goToProducts()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                Ürünleri İncele
              </button>
            </div>
            <div class="hero-stats">
              <div class="stat-item">
                <span class="stat-value">10K+</span>
                <span class="stat-label">Mutlu Müşteri</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <span class="stat-value">500+</span>
                <span class="stat-label">Ürün Çeşidi</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <span class="stat-value">4.9</span>
                <span class="stat-label">Ortalama Puan</span>
              </div>
            </div>
          </div>
          <div class="hero-visual">
            <div class="hero-card hero-card-1">
              <div class="floating-product">🛍️</div>
            </div>
            <div class="hero-card hero-card-2">
              <div class="floating-product">✨</div>
            </div>
            <div class="hero-card hero-card-3">
              <div class="floating-product">🎁</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Welcome Banner (Authenticated) -->
      @if (authService.isAuthenticated()) {
        <section class="welcome-banner">
          <div class="eca-container">
            <div class="welcome-card eca-card eca-card-glass">
              <div class="welcome-avatar">
                {{ getUserInitials() }}
              </div>
              <div class="welcome-content">
                <h2>Hoş Geldiniz, {{ authService.currentUser()?.given_name || authService.currentUser()?.preferred_username }}!</h2>
                <p>Kişiselleştirilmiş alışveriş deneyiminize devam edin.</p>
              </div>
              <div class="welcome-actions">
                <button class="eca-btn eca-btn-primary" (click)="goToOrders()">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M16.5 9.4l-9-5.19"/>
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  </svg>
                  Siparişlerim
                </button>
                <button class="eca-btn eca-btn-secondary" (click)="goToCart()">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="9" cy="21" r="1"/>
                    <circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                  Sepetim ({{ cartService.itemCount() }})
                </button>
              </div>
            </div>
          </div>
        </section>
      }

      <!-- Featured Products -->
      <section class="products-section">
        <div class="eca-container">
          <div class="section-header">
            <div>
              <h2 class="section-title">Öne Çıkan Ürünler</h2>
              <p class="section-subtitle">En çok tercih edilen ürünlerimiz</p>
            </div>
            <button class="eca-btn eca-btn-ghost" (click)="goToProducts()">
              Tümünü Gör
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </div>

          @if (productService.isLoading()) {
            <div class="products-grid">
              @for (i of [1, 2, 3, 4]; track i) {
                <div class="product-card-skeleton eca-card">
                  <div class="skeleton-image eca-skeleton"></div>
                  <div class="skeleton-content">
                    <div class="skeleton-line eca-skeleton eca-skeleton-text"></div>
                    <div class="skeleton-line short eca-skeleton eca-skeleton-text"></div>
                    <div class="skeleton-btn eca-skeleton"></div>
                  </div>
                </div>
              }
            </div>
          } @else {
            <div class="products-grid">
              @for (product of featuredProducts; track product.id) {
                <article class="product-card eca-card" (click)="viewProduct(product)">
                  <div class="product-image">
                    @if (product.imageUrl) {
                      <img [src]="product.imageUrl" [alt]="product.name">
                    } @else {
                      <div class="product-placeholder">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                          <path d="M16.5 9.4l-9-5.19"/>
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                        </svg>
                      </div>
                    }
                    @if (cartService.isInCart(product.sku)) {
                      <span class="in-cart-badge">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Sepette
                      </span>
                    }
                  </div>
                  <div class="product-info">
                    <h3 class="product-name">{{ product.name }}</h3>
                    <p class="product-price">{{ formatPrice(product.priceCents, product.currency) }}</p>
                    <button 
                      class="product-btn"
                      [class.in-cart]="cartService.isInCart(product.sku)"
                      [disabled]="!product.isActive"
                      (click)="addToCart($event, product)">
                      @if (cartService.isInCart(product.sku)) {
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Sepete Eklendi
                      } @else {
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <circle cx="9" cy="21" r="1"/>
                          <circle cx="20" cy="21" r="1"/>
                          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                        </svg>
                        Sepete Ekle
                      }
                    </button>
                  </div>
                </article>
              }
            </div>
          }
        </div>
      </section>

      <!-- Features Section -->
      <section class="features-section">
        <div class="eca-container">
          <div class="features-grid">
            <div class="feature-card eca-card">
              <div class="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="1" y="3" width="15" height="13"/>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                  <circle cx="5.5" cy="18.5" r="2.5"/>
                  <circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
              </div>
              <h3>Hızlı Teslimat</h3>
              <p>Siparişleriniz 24 saat içinde kargoya verilir</p>
            </div>
            <div class="feature-card eca-card">
              <div class="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h3>Güvenli Ödeme</h3>
              <p>256-bit SSL şifreleme ile korunan ödemeler</p>
            </div>
            <div class="feature-card eca-card">
              <div class="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <polyline points="23 4 23 10 17 10"/>
                  <polyline points="1 20 1 14 7 14"/>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                </svg>
              </div>
              <h3>Kolay İade</h3>
              <p>14 gün içinde ücretsiz iade garantisi</p>
            </div>
            <div class="feature-card eca-card">
              <div class="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <h3>7/24 Destek</h3>
              <p>Her zaman yanınızda olan müşteri hizmetleri</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Categories Section -->
      <section class="categories-section">
        <div class="eca-container">
          <div class="section-header centered">
            <h2 class="section-title">Kategoriler</h2>
            <p class="section-subtitle">İhtiyacınıza uygun kategoriyi keşfedin</p>
          </div>
          <div class="categories-grid">
            @for (category of categories; track category.name) {
              <div class="category-card" (click)="goToProducts()">
                <span class="category-emoji">{{ category.emoji }}</span>
                <span class="category-name">{{ category.name }}</span>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section">
        <div class="eca-container">
          <div class="cta-card">
            <div class="cta-content">
              <h2>Fırsatları Kaçırmayın!</h2>
              <p>E-bültenimize abone olun, özel indirimlerden ilk siz haberdar olun.</p>
            </div>
            <div class="cta-actions">
              <button class="eca-btn eca-btn-primary eca-btn-xl" (click)="goToProducts()">
                Alışverişe Başla
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-page {
      min-height: calc(100vh - var(--header-height));
    }

    /* Hero Section */
    .hero {
      position: relative;
      padding: var(--spacing-16) 0;
      overflow: hidden;
      min-height: 600px;
      display: flex;
      align-items: center;
    }

    .hero-bg {
      position: absolute;
      inset: 0;
      z-index: 0;
    }

    .hero-gradient {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 50%, #1e1b4b 100%);
    }

    .hero-pattern {
      position: absolute;
      inset: 0;
      background-image: radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px);
      background-size: 40px 40px;
    }

    .hero-container {
      position: relative;
      z-index: 1;
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 var(--spacing-6);
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-12);
      align-items: center;
    }

    .hero-content {
      color: white;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-2);
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      padding: var(--spacing-2) var(--spacing-4);
      border-radius: var(--radius-full);
      font-size: var(--text-sm);
      font-weight: var(--font-medium);
      margin-bottom: var(--spacing-6);
    }

    .badge-dot {
      width: 8px;
      height: 8px;
      background: var(--success-400);
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .hero-title {
      font-size: 3.5rem;
      font-weight: var(--font-bold);
      line-height: 1.1;
      margin-bottom: var(--spacing-6);
    }

    .hero-title-accent {
      display: block;
      background: linear-gradient(135deg, #fbbf24, #f59e0b);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-description {
      font-size: var(--text-lg);
      opacity: 0.9;
      line-height: 1.7;
      margin-bottom: var(--spacing-8);
      max-width: 480px;
    }

    .hero-actions {
      display: flex;
      gap: var(--spacing-4);
      margin-bottom: var(--spacing-10);
    }

    .hero-stats {
      display: flex;
      align-items: center;
      gap: var(--spacing-6);
    }

    .stat-item {
      text-align: center;
    }

    .stat-value {
      display: block;
      font-size: var(--text-2xl);
      font-weight: var(--font-bold);
    }

    .stat-label {
      font-size: var(--text-sm);
      opacity: 0.7;
    }

    .stat-divider {
      width: 1px;
      height: 40px;
      background: rgba(255, 255, 255, 0.2);
    }

    .hero-visual {
      position: relative;
      height: 400px;
    }

    .hero-card {
      position: absolute;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      border-radius: var(--radius-2xl);
      border: 1px solid rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .hero-card-1 {
      width: 200px;
      height: 200px;
      top: 0;
      right: 20%;
      animation: float 6s ease-in-out infinite;
    }

    .hero-card-2 {
      width: 150px;
      height: 150px;
      top: 40%;
      right: 0;
      animation: float 8s ease-in-out infinite;
      animation-delay: -2s;
    }

    .hero-card-3 {
      width: 120px;
      height: 120px;
      bottom: 10%;
      right: 30%;
      animation: float 7s ease-in-out infinite;
      animation-delay: -4s;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-20px); }
    }

    .floating-product {
      font-size: 4rem;
    }

    /* Welcome Banner */
    .welcome-banner {
      padding: var(--spacing-8) 0;
      background: var(--gray-50);
    }

    .welcome-card {
      display: flex;
      align-items: center;
      gap: var(--spacing-6);
      padding: var(--spacing-6);
    }

    .welcome-avatar {
      width: 64px;
      height: 64px;
      background: var(--gradient-primary);
      color: white;
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--text-xl);
      font-weight: var(--font-bold);
      flex-shrink: 0;
    }

    .welcome-content {
      flex: 1;
    }

    .welcome-content h2 {
      font-size: var(--text-xl);
      font-weight: var(--font-semibold);
      color: var(--gray-900);
      margin-bottom: var(--spacing-1);
    }

    .welcome-content p {
      color: var(--gray-500);
    }

    .welcome-actions {
      display: flex;
      gap: var(--spacing-3);
    }

    /* Products Section */
    .products-section {
      padding: var(--spacing-16) 0;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-10);
    }

    .section-header.centered {
      flex-direction: column;
      text-align: center;
    }

    .section-title {
      font-size: var(--text-3xl);
      font-weight: var(--font-bold);
      color: var(--gray-900);
      margin-bottom: var(--spacing-2);
    }

    .section-subtitle {
      color: var(--gray-500);
      font-size: var(--text-lg);
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: var(--spacing-6);
    }

    .product-card {
      cursor: pointer;
      transition: all var(--transition-normal);
      overflow: hidden;
      padding: 0;
    }

    .product-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-xl);
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
      transition: transform var(--transition-normal);
    }

    .product-card:hover .product-image img {
      transform: scale(1.05);
    }

    .product-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--gray-300);
    }

    .in-cart-badge {
      position: absolute;
      top: var(--spacing-3);
      right: var(--spacing-3);
      display: flex;
      align-items: center;
      gap: var(--spacing-1);
      background: var(--success-500);
      color: white;
      padding: var(--spacing-1) var(--spacing-3);
      border-radius: var(--radius-full);
      font-size: var(--text-xs);
      font-weight: var(--font-semibold);
    }

    .product-info {
      padding: var(--spacing-5);
    }

    .product-name {
      font-size: var(--text-base);
      font-weight: var(--font-semibold);
      color: var(--gray-900);
      margin-bottom: var(--spacing-2);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .product-price {
      font-size: var(--text-xl);
      font-weight: var(--font-bold);
      color: var(--primary-600);
      margin-bottom: var(--spacing-4);
    }

    .product-btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-2);
      padding: var(--spacing-3);
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
      padding: 0;
    }

    .skeleton-image {
      aspect-ratio: 4/3;
    }

    .skeleton-content {
      padding: var(--spacing-5);
    }

    .skeleton-line {
      height: 20px;
      margin-bottom: var(--spacing-3);
      border-radius: var(--radius-sm);
    }

    .skeleton-line.short {
      width: 60%;
      height: 28px;
    }

    .skeleton-btn {
      height: 44px;
      border-radius: var(--radius-lg);
    }

    /* Features Section */
    .features-section {
      padding: var(--spacing-16) 0;
      background: var(--gray-50);
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: var(--spacing-6);
    }

    .feature-card {
      padding: var(--spacing-8);
      text-align: center;
      transition: all var(--transition-base);
    }

    .feature-card:hover {
      transform: translateY(-4px);
    }

    .feature-icon {
      width: 72px;
      height: 72px;
      margin: 0 auto var(--spacing-5);
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--primary-100);
      color: var(--primary-600);
      border-radius: var(--radius-xl);
    }

    .feature-card h3 {
      font-size: var(--text-lg);
      font-weight: var(--font-semibold);
      color: var(--gray-900);
      margin-bottom: var(--spacing-2);
    }

    .feature-card p {
      color: var(--gray-500);
      font-size: var(--text-sm);
    }

    /* Categories Section */
    .categories-section {
      padding: var(--spacing-16) 0;
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: var(--spacing-4);
      margin-top: var(--spacing-10);
    }

    .category-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-3);
      padding: var(--spacing-6);
      background: white;
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-xl);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .category-card:hover {
      border-color: var(--primary-300);
      background: var(--primary-50);
      transform: translateY(-2px);
    }

    .category-emoji {
      font-size: 2.5rem;
    }

    .category-name {
      font-weight: var(--font-medium);
      color: var(--gray-700);
    }

    /* CTA Section */
    .cta-section {
      padding: var(--spacing-16) 0;
      background: var(--gray-50);
    }

    .cta-card {
      background: var(--gradient-primary);
      border-radius: var(--radius-2xl);
      padding: var(--spacing-12);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--spacing-8);
    }

    .cta-content h2 {
      font-size: var(--text-3xl);
      font-weight: var(--font-bold);
      color: white;
      margin-bottom: var(--spacing-2);
    }

    .cta-content p {
      color: rgba(255, 255, 255, 0.8);
      font-size: var(--text-lg);
    }

    .cta-actions .eca-btn {
      background: white;
      color: var(--primary-600);
    }

    .cta-actions .eca-btn:hover {
      background: var(--gray-100);
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .hero-container {
        grid-template-columns: 1fr;
        text-align: center;
      }

      .hero-description {
        margin-left: auto;
        margin-right: auto;
      }

      .hero-actions {
        justify-content: center;
      }

      .hero-stats {
        justify-content: center;
      }

      .hero-visual {
        display: none;
      }

      .hero-title {
        font-size: 2.5rem;
      }
    }

    @media (max-width: 768px) {
      .welcome-card {
        flex-direction: column;
        text-align: center;
      }

      .welcome-actions {
        flex-wrap: wrap;
        justify-content: center;
      }

      .section-header {
        flex-direction: column;
        text-align: center;
        gap: var(--spacing-4);
      }

      .cta-card {
        flex-direction: column;
        text-align: center;
      }

      .hero-actions {
        flex-direction: column;
        align-items: center;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];

  categories = [
    { name: 'Elektronik', emoji: '📱' },
    { name: 'Giyim', emoji: '👕' },
    { name: 'Ev & Yaşam', emoji: '🏠' },
    { name: 'Spor', emoji: '⚽' },
    { name: 'Kitap', emoji: '📚' },
    { name: 'Kozmetik', emoji: '💄' }
  ];

  constructor(
    public productService: ProductService,
    public cartService: CartService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productService.loadProducts().subscribe(products => {
      this.featuredProducts = products.slice(0, 4);
    });
  }

  getUserInitials(): string {
    const user = this.authService.currentUser();
    if (user?.given_name && user?.family_name) {
      return `${user.given_name[0]}${user.family_name[0]}`.toUpperCase();
    }
    return user?.preferred_username?.[0]?.toUpperCase() || 'U';
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

  goToProducts(): void {
    this.router.navigate(['/products']);
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  goToOrders(): void {
    this.router.navigate(['/orders']);
  }

  formatPrice(priceCents: number, currency: string): string {
    return this.productService.formatPrice(priceCents, currency);
  }
}
