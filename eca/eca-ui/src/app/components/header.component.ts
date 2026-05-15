import { Component, computed, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header" [class.scrolled]="isScrolled()">
      <div class="header-container">
        <!-- Logo Section -->
        <div class="logo-section" (click)="navigateTo('/')">
          <div class="logo-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#6366f1"/>
                  <stop offset="100%" style="stop-color:#a855f7"/>
                </linearGradient>
              </defs>
              <rect width="32" height="32" rx="8" fill="url(#logoGradient)"/>
              <path d="M10 12h12M10 16h12M10 20h8" stroke="white" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <span class="logo-text">ECA<span class="logo-accent">Store</span></span>
        </div>

        <!-- Navigation -->
        <nav class="nav-menu" [class.mobile-open]="isMobileMenuOpen()">
          <a class="nav-link" [class.active]="isActive('/')" (click)="navigateTo('/')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span>Ana Sayfa</span>
          </a>
          <a class="nav-link" [class.active]="isActive('/products')" (click)="navigateTo('/products')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <span>Ürünler</span>
          </a>
          <a class="nav-link" [class.active]="isActive('/orders')" (click)="navigateTo('/orders')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
            <span>Siparişlerim</span>
          </a>
        </nav>

        <!-- Actions Section -->
        <div class="actions-section">
          <!-- Cart Button -->
          <button class="cart-btn" (click)="navigateTo('/cart')" aria-label="Sepet">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            @if (cartService.itemCount() > 0) {
              <span class="cart-badge">{{ cartService.itemCount() }}</span>
            }
          </button>

          <!-- Auth Section -->
          @if (authService.isLoading()) {
            <div class="auth-loading">
              <div class="spinner"></div>
            </div>
          } @else if (authService.isAuthenticated()) {
            <!-- User Profile Dropdown -->
            <div class="user-dropdown" [class.open]="isDropdownOpen()">
              @if (isDropdownOpen()) {
                <div class="dropdown-backdrop" (click)="closeDropdown()"></div>
              }
              
              <button 
                class="user-btn" 
                (click)="toggleDropdown()"
                [attr.aria-expanded]="isDropdownOpen()"
                aria-haspopup="true">
                <div class="user-avatar">
                  {{ getUserInitials() }}
                </div>
                <span class="user-name">{{ displayName() }}</span>
                <svg class="dropdown-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              @if (isDropdownOpen()) {
                <div class="dropdown-menu">
                  <div class="dropdown-header">
                    <div class="dropdown-avatar">
                      {{ getUserInitials() }}
                    </div>
                    <div class="dropdown-user-info">
                      <span class="dropdown-user-name">{{ displayName() }}</span>
                      <span class="dropdown-user-email">{{ getUserEmail() }}</span>
                    </div>
                  </div>
                  
                  <div class="dropdown-divider"></div>
                  
                  <button class="dropdown-item" (click)="navigateToProfile()">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    <span>Profil</span>
                  </button>
                  
                  <button class="dropdown-item" (click)="navigateToOrders()">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                      <line x1="1" y1="10" x2="23" y2="10"/>
                    </svg>
                    <span>Siparişlerim</span>
                  </button>
                  
                  <div class="dropdown-divider"></div>
                  
                  <button 
                    class="dropdown-item logout" 
                    (click)="onLogout()"
                    [disabled]="isLoggingOut">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    <span>{{ isLoggingOut ? 'Çıkış yapılıyor...' : 'Çıkış Yap' }}</span>
                  </button>
                </div>
              }
            </div>
          } @else {
            <!-- Login Button -->
            <button class="login-btn" (click)="onLogin()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
              <span>Giriş Yap</span>
            </button>
          }

          <!-- Mobile Menu Toggle -->
          <button class="mobile-menu-btn" (click)="toggleMobileMenu()" aria-label="Menü">
            @if (isMobileMenuOpen()) {
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            } @else {
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            }
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    /* Header Base */
    .header {
      position: sticky;
      top: 0;
      z-index: var(--z-sticky);
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      transition: all var(--transition-base);
    }

    .header.scrolled {
      background: rgba(255, 255, 255, 0.95);
      box-shadow: var(--shadow-md);
      border-bottom-color: var(--gray-100);
    }

    .header-container {
      max-width: var(--container-max);
      margin: 0 auto;
      padding: 0 var(--spacing-6);
      height: var(--header-height);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--spacing-8);
    }

    /* Logo */
    .logo-section {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      cursor: pointer;
      transition: transform var(--transition-fast);
    }

    .logo-section:hover {
      transform: scale(1.02);
    }

    .logo-icon {
      flex-shrink: 0;
    }

    .logo-text {
      font-size: var(--text-xl);
      font-weight: var(--font-bold);
      color: var(--gray-900);
      letter-spacing: -0.025em;
    }

    .logo-accent {
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* Navigation */
    .nav-menu {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      padding: var(--spacing-2) var(--spacing-4);
      border-radius: var(--radius-lg);
      color: var(--gray-600);
      font-size: var(--text-sm);
      font-weight: var(--font-medium);
      transition: all var(--transition-fast);
      cursor: pointer;
    }

    .nav-link:hover {
      color: var(--primary-600);
      background: var(--primary-50);
    }

    .nav-link.active {
      color: var(--primary-600);
      background: var(--primary-100);
    }

    .nav-link svg {
      opacity: 0.7;
    }

    .nav-link:hover svg,
    .nav-link.active svg {
      opacity: 1;
    }

    /* Actions Section */
    .actions-section {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
    }

    /* Cart Button */
    .cart-btn {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: var(--radius-lg);
      color: var(--gray-600);
      background: var(--gray-100);
      transition: all var(--transition-fast);
    }

    .cart-btn:hover {
      color: var(--primary-600);
      background: var(--primary-100);
    }

    .cart-badge {
      position: absolute;
      top: -4px;
      right: -4px;
      min-width: 20px;
      height: 20px;
      padding: 0 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--error-500);
      color: white;
      font-size: var(--text-xs);
      font-weight: var(--font-bold);
      border-radius: var(--radius-full);
      border: 2px solid white;
      animation: badgePop 0.3s ease;
    }

    @keyframes badgePop {
      0% { transform: scale(0); }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); }
    }

    /* User Dropdown */
    .user-dropdown {
      position: relative;
    }

    .user-btn {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      padding: var(--spacing-2) var(--spacing-4);
      padding-left: var(--spacing-2);
      border-radius: var(--radius-full);
      background: var(--gray-100);
      color: var(--gray-700);
      transition: all var(--transition-fast);
    }

    .user-btn:hover {
      background: var(--gray-200);
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-full);
      background: var(--gradient-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: var(--text-sm);
      font-weight: var(--font-bold);
    }

    .user-name {
      font-size: var(--text-sm);
      font-weight: var(--font-medium);
      max-width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .dropdown-arrow {
      color: var(--gray-400);
      transition: transform var(--transition-fast);
    }

    .user-dropdown.open .dropdown-arrow {
      transform: rotate(180deg);
    }

    /* Dropdown Menu */
    .dropdown-backdrop {
      position: fixed;
      inset: 0;
      z-index: var(--z-dropdown);
    }

    .dropdown-menu {
      position: absolute;
      top: calc(100% + var(--spacing-2));
      right: 0;
      min-width: 280px;
      background: white;
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-xl);
      border: 1px solid var(--gray-100);
      z-index: calc(var(--z-dropdown) + 1);
      animation: dropdownIn 0.2s ease-out;
      overflow: hidden;
    }

    @keyframes dropdownIn {
      from {
        opacity: 0;
        transform: translateY(-8px) scale(0.96);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .dropdown-header {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      padding: var(--spacing-4);
      background: var(--gray-50);
    }

    .dropdown-avatar {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-full);
      background: var(--gradient-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: var(--text-lg);
      font-weight: var(--font-bold);
      flex-shrink: 0;
    }

    .dropdown-user-info {
      flex: 1;
      min-width: 0;
    }

    .dropdown-user-name {
      display: block;
      font-weight: var(--font-semibold);
      color: var(--gray-900);
      margin-bottom: 2px;
    }

    .dropdown-user-email {
      display: block;
      font-size: var(--text-sm);
      color: var(--gray-500);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .dropdown-divider {
      height: 1px;
      background: var(--gray-100);
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      width: 100%;
      padding: var(--spacing-3) var(--spacing-4);
      color: var(--gray-700);
      font-size: var(--text-sm);
      font-weight: var(--font-medium);
      text-align: left;
      transition: all var(--transition-fast);
    }

    .dropdown-item:hover {
      background: var(--gray-50);
      color: var(--gray-900);
    }

    .dropdown-item svg {
      color: var(--gray-400);
      flex-shrink: 0;
    }

    .dropdown-item:hover svg {
      color: var(--gray-600);
    }

    .dropdown-item.logout {
      color: var(--error-600);
    }

    .dropdown-item.logout:hover {
      background: var(--error-50);
      color: var(--error-700);
    }

    .dropdown-item.logout svg {
      color: var(--error-500);
    }

    .dropdown-item:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Login Button */
    .login-btn {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      padding: var(--spacing-2) var(--spacing-5);
      background: var(--gradient-primary);
      color: white;
      font-size: var(--text-sm);
      font-weight: var(--font-semibold);
      border-radius: var(--radius-lg);
      transition: all var(--transition-fast);
    }

    .login-btn:hover {
      transform: translateY(-1px);
      box-shadow: var(--shadow-md), var(--shadow-glow);
    }

    /* Auth Loading */
    .auth-loading {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
    }

    .spinner {
      width: 24px;
      height: 24px;
      border: 2px solid var(--gray-200);
      border-top-color: var(--primary-500);
      border-radius: var(--radius-full);
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Mobile Menu Button */
    .mobile-menu-btn {
      display: none;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: var(--radius-lg);
      color: var(--gray-600);
      background: var(--gray-100);
      transition: all var(--transition-fast);
    }

    .mobile-menu-btn:hover {
      background: var(--gray-200);
    }

    /* Responsive */
    @media (max-width: 768px) {
      .header-container {
        padding: 0 var(--spacing-4);
      }

      .nav-menu {
        position: fixed;
        top: var(--header-height);
        left: 0;
        right: 0;
        bottom: 0;
        flex-direction: column;
        align-items: stretch;
        gap: var(--spacing-1);
        padding: var(--spacing-4);
        background: white;
        border-top: 1px solid var(--gray-100);
        transform: translateX(-100%);
        transition: transform var(--transition-slow);
        z-index: var(--z-fixed);
      }

      .nav-menu.mobile-open {
        transform: translateX(0);
      }

      .nav-link {
        padding: var(--spacing-4);
        font-size: var(--text-base);
      }

      .mobile-menu-btn {
        display: flex;
      }

      .user-name {
        display: none;
      }

      .user-btn {
        padding: var(--spacing-2);
      }

      .dropdown-menu {
        position: fixed;
        top: auto;
        right: var(--spacing-4);
        left: var(--spacing-4);
        bottom: var(--spacing-4);
        min-width: auto;
      }
    }
  `]
})
export class HeaderComponent {
  isLoggingOut = false;
  isDropdownOpen = signal(false);
  isMobileMenuOpen = signal(false);
  isScrolled = signal(false);

  constructor(
    public authService: AuthService,
    public cartService: CartService,
    private router: Router
  ) {}

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled.set(window.scrollY > 10);
  }

  displayName = computed(() => {
    const user = this.authService.currentUser();
    if (!user) return '';
    return user.given_name || user.name || user.preferred_username || user.email || 'Kullanıcı';
  });

  getUserInitials(): string {
    const user = this.authService.currentUser();
    if (!user) return '?';

    const firstName = user.given_name || user.name || '';
    const lastName = user.family_name || '';

    if (firstName && lastName) {
      return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
    } else if (firstName) {
      return firstName.substring(0, 2).toUpperCase();
    } else if (user.preferred_username) {
      return user.preferred_username.substring(0, 2).toUpperCase();
    } else if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return '?';
  }

  getUserEmail(): string {
    const user = this.authService.currentUser();
    return user?.email || user?.preferred_username || '';
  }

  isActive(path: string): boolean {
    if (path === '/') {
      return this.router.url === '/';
    }
    return this.router.url.startsWith(path);
  }

  toggleDropdown(): void {
    this.isDropdownOpen.update(value => !value);
  }

  closeDropdown(): void {
    this.isDropdownOpen.set(false);
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(value => !value);
  }

  navigateTo(path: string): void {
    this.isMobileMenuOpen.set(false);
    this.router.navigate([path]);
  }

  navigateToProfile(): void {
    this.closeDropdown();
    this.authService.getAccountUrl().subscribe({
      next: (response) => {
        if (typeof window !== 'undefined') {
          window.open(response.accountUrl, '_blank');
        }
      },
      error: (error) => {
        console.error('Failed to get account URL:', error);
      }
    });
  }

  navigateToOrders(): void {
    this.closeDropdown();
    this.router.navigate(['/orders']);
  }

  onLogin(): void {
    this.authService.login();
  }

  onLogout(): void {
    this.isLoggingOut = true;
    this.closeDropdown();

    this.authService.logout().subscribe({
      next: () => {
        this.isLoggingOut = false;
      },
      error: (error) => {
        console.error('Logout failed:', error);
        this.isLoggingOut = false;
      }
    });
  }
}
