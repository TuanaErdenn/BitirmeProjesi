import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-main-content',
    standalone: true,
    imports: [CommonModule],
    template: `
    <main class="main-content">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-container">
          <div class="hero-content">
            <h1 class="hero-title">Modern E-Commerce Deneyimi</h1>
            <p class="hero-description">
              En kaliteli ürünleri en uygun fiyatlarla keşfedin. 
              Güvenli ödeme ve hızlı teslimat garantisi.
            </p>
            @if (!authService.isAuthenticated()) {
              <div class="hero-actions">
                <button class="btn btn-primary btn-large" (click)="authService.login()">
                  Hemen Başla
                </button>
                <button class="btn btn-outline btn-large">
                  Ürünleri İncele
                </button>
              </div>
            }
          </div>
          <div class="hero-image">
            <div class="placeholder-image">
              🛍️
            </div>
          </div>
        </div>
      </section>

      <!-- Authentication Status -->
      @if (authService.isAuthenticated()) {
        <section class="user-section">
          <div class="container">
            <div class="welcome-card">
              <h2>Hoş Geldiniz, {{ getUserDisplayName() }}!</h2>
              <p>Kişiselleştirilmiş alışveriş deneyiminize başlayabilirsiniz.</p>
              <div class="quick-actions">
                <button class="btn btn-primary" (click)="testProtectedEndpoint()">
                  Korumalı Veri Al
                </button>
                <button class="btn btn-outline">
                  Profili Görüntüle
                </button>
              </div>

              @if (protectedData) {
                <div class="protected-data">
                  <h3>Korumalı Veri:</h3>
                  <pre>{{ protectedData | json }}</pre>
                </div>
              }
            </div>
          </div>
        </section>
      }

      <!-- Features Section -->
      <section class="features-section">
        <div class="container">
          <h2 class="section-title">Neden Bizi Seçmelisiniz?</h2>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">🚚</div>
              <h3>Hızlı Teslimat</h3>
              <p>24 saat içinde kapınızda</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🔒</div>
              <h3>Güvenli Ödeme</h3>
              <p>SSL sertifikası ile korumalı</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">💯</div>
              <h3>Kalite Garantisi</h3>
              <p>30 gün iade garantisi</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">📞</div>
              <h3>7/24 Destek</h3>
              <p>Her zaman yanınızdayız</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Categories Section -->
      <section class="categories-section">
        <div class="container">
          <h2 class="section-title">Popüler Kategoriler</h2>
          <div class="categories-grid">
            <div class="category-card">
              <div class="category-image">📱</div>
              <h3>Elektronik</h3>
            </div>
            <div class="category-card">
              <div class="category-image">👔</div>
              <h3>Moda</h3>
            </div>
            <div class="category-card">
              <div class="category-image">🏠</div>
              <h3>Ev & Yaşam</h3>
            </div>
            <div class="category-card">
              <div class="category-image">📚</div>
              <h3>Kitap</h3>
            </div>
            <div class="category-card">
              <div class="category-image">🎮</div>
              <h3>Oyun</h3>
            </div>
            <div class="category-card">
              <div class="category-image">💄</div>
              <h3>Kozmetik</h3>
            </div>
          </div>
        </div>
      </section>
    </main>
  `,
    styles: [`
    .main-content {
      flex: 1;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    /* Hero Section */
    .hero-section {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
      padding: 4rem 0;
    }

    .hero-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      align-items: center;
    }

    .hero-content {
      max-width: 500px;
    }

    .hero-title {
      font-size: 3rem;
      font-weight: 700;
      color: #1a202c;
      margin-bottom: 1rem;
      line-height: 1.2;
    }

    .hero-description {
      font-size: 1.25rem;
      color: #4a5568;
      margin-bottom: 2rem;
      line-height: 1.6;
    }

    .hero-actions {
      display: flex;
      gap: 1rem;
    }

    .hero-image {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .placeholder-image {
      font-size: 10rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* User Section */
    .user-section {
      padding: 3rem 0;
      background-color: #f7fafc;
    }

    .welcome-card {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }

    .welcome-card h2 {
      color: #1a202c;
      margin-bottom: 0.5rem;
    }

    .welcome-card p {
      color: #4a5568;
      margin-bottom: 1.5rem;
    }

    .quick-actions {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .protected-data {
      background-color: #f7fafc;
      padding: 1rem;
      border-radius: 0.5rem;
      border-left: 4px solid #667eea;
    }

    .protected-data h3 {
      margin-bottom: 0.5rem;
      color: #1a202c;
    }

    .protected-data pre {
      background-color: #1a202c;
      color: #e2e8f0;
      padding: 1rem;
      border-radius: 0.5rem;
      overflow-x: auto;
      font-size: 0.875rem;
    }

    /* Features Section */
    .features-section {
      padding: 4rem 0;
    }

    .section-title {
      text-align: center;
      font-size: 2.5rem;
      font-weight: 700;
      color: #1a202c;
      margin-bottom: 3rem;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .feature-card {
      text-align: center;
      padding: 2rem;
      background: white;
      border-radius: 1rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .feature-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
    }

    .feature-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .feature-card h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1a202c;
      margin-bottom: 0.5rem;
    }

    .feature-card p {
      color: #4a5568;
    }

    /* Categories Section */
    .categories-section {
      padding: 4rem 0;
      background-color: #f7fafc;
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1.5rem;
    }

    .category-card {
      text-align: center;
      padding: 2rem 1rem;
      background: white;
      border-radius: 1rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      cursor: pointer;
    }

    .category-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    }

    .category-image {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .category-card h3 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1a202c;
    }

    /* Buttons */
    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .btn-large {
      padding: 1rem 2rem;
      font-size: 1rem;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
    }

    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
    }

    .btn-outline {
      background-color: transparent;
      color: #667eea;
      border: 2px solid #667eea;
    }

    .btn-outline:hover {
      background-color: #667eea;
      color: white;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .hero-container {
        grid-template-columns: 1fr;
        gap: 2rem;
        text-align: center;
      }

      .hero-title {
        font-size: 2rem;
      }

      .hero-description {
        font-size: 1.125rem;
      }

      .hero-actions {
        justify-content: center;
        flex-wrap: wrap;
      }

      .section-title {
        font-size: 2rem;
      }

      .quick-actions {
        flex-wrap: wrap;
      }
    }
  `]
})
export class MainContentComponent implements OnInit {
    protectedData: any = null;

    constructor(public authService: AuthService) { }

    ngOnInit(): void {
        // Check if we're running in the browser (not during SSR)
        if (typeof window === 'undefined') return;

        // Check if we're coming back from OAuth callback
        const urlParams = new URLSearchParams(window.location.search);
        const error = urlParams.get('error');
        const loginSuccess = urlParams.get('login');

        if (error) {
            // Optionally show error message to user
        } else if (loginSuccess === 'success') {
            // Force auth status check after successful login
            setTimeout(() => {
                this.authService.checkAuthStatus();
                // Clean URL
                window.history.replaceState({}, document.title, window.location.pathname);
            }, 500);
        }
    } getUserDisplayName(): string {
        const user = this.authService.currentUser();
        if (!user) return 'Kullanıcı';

        return user.given_name || user.name || user.preferred_username || user.email || 'Kullanıcı';
    }

    testProtectedEndpoint(): void {
        this.authService.getProtectedData().subscribe({
            next: (data) => {
                this.protectedData = data;
            },
            error: (error) => {
                console.error('Protected endpoint error:', error);
                this.protectedData = { error: 'Veri alınamadı' };
            }
        });
    }
}
