import { Injectable, signal, computed, effect } from '@angular/core';
import { Product } from '../models/product.model';
import { CartItem, Cart } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY = 'eca_cart';

  // Signals for reactive state
  public items = signal<CartItem[]>([]);
  public currency = signal<string>('TRY');

  // Computed values
  public totalCents = computed(() => {
    return this.items().reduce((total, item) => {
      return total + (item.product.priceCents * item.quantity);
    }, 0);
  });

  public itemCount = computed(() => {
    return this.items().reduce((count, item) => count + item.quantity, 0);
  });

  public isEmpty = computed(() => this.items().length === 0);

  constructor() {
    // Load cart from localStorage on initialization
    if (typeof window !== 'undefined') {
      this.loadFromStorage();
      
      // Save to storage whenever cart changes
      effect(() => {
        this.saveToStorage();
      });
    }
  }

  addToCart(product: Product, quantity: number = 1): void {
    this.items.update(items => {
      const existingIndex = items.findIndex(item => item.product.sku === product.sku);
      
      if (existingIndex >= 0) {
        // Update existing item
        const updated = [...items];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      } else {
        // Add new item
        return [...items, { product, quantity }];
      }
    });
  }

  updateQuantity(sku: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(sku);
      return;
    }

    this.items.update(items => {
      return items.map(item => {
        if (item.product.sku === sku) {
          return { ...item, quantity };
        }
        return item;
      });
    });
  }

  removeFromCart(sku: string): void {
    this.items.update(items => items.filter(item => item.product.sku !== sku));
  }

  clearCart(): void {
    this.items.set([]);
  }

  getCart(): Cart {
    return {
      items: this.items(),
      totalCents: this.totalCents(),
      currency: this.currency()
    };
  }

  isInCart(sku: string): boolean {
    return this.items().some(item => item.product.sku === sku);
  }

  getItemQuantity(sku: string): number {
    const item = this.items().find(item => item.product.sku === sku);
    return item?.quantity || 0;
  }

  formatPrice(priceCents: number, currency: string = 'TRY'): string {
    const price = priceCents / 100;
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency
    }).format(price);
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const cart = JSON.parse(stored) as Cart;
        this.items.set(cart.items || []);
        this.currency.set(cart.currency || 'TRY');
      }
    } catch (e) {
      console.error('Error loading cart from storage:', e);
    }
  }

  private saveToStorage(): void {
    try {
      const cart: Cart = {
        items: this.items(),
        totalCents: this.totalCents(),
        currency: this.currency()
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart to storage:', e);
    }
  }
}
