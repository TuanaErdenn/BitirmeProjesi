import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { Product, ProductDetails, Category } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly apiUrl = '/api/products';
  private readonly categoryUrl = '/api/categories';

  // Signals for reactive state
  public products = signal<Product[]>([]);
  public categories = signal<Category[]>([]);
  public selectedProduct = signal<ProductDetails | null>(null);
  public isLoading = signal<boolean>(false);
  public error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  loadProducts(): Observable<Product[]> {
    this.isLoading.set(true);
    this.error.set(null);
    
    return this.http.get<Product[]>(this.apiUrl).pipe(
      tap((products) => {
        this.products.set(products);
        this.isLoading.set(false);
      }),
      catchError((err) => {
        console.error('Error loading products:', err);
        this.error.set('Ürünler yüklenirken bir hata oluştu');
        this.isLoading.set(false);
        return of([]);
      })
    );
  }

  getProduct(id: number): Observable<ProductDetails | null> {
    this.isLoading.set(true);
    this.error.set(null);
    
    return this.http.get<ProductDetails>(`${this.apiUrl}/${id}`).pipe(
      tap((product) => {
        this.selectedProduct.set(product);
        this.isLoading.set(false);
      }),
      catchError((err) => {
        console.error('Error loading product:', err);
        this.error.set('Ürün yüklenirken bir hata oluştu');
        this.isLoading.set(false);
        return of(null);
      })
    );
  }

  getProductsBySku(skus: string[]): Observable<Product[]> {
    const params = skus.map(sku => `sku=${encodeURIComponent(sku)}`).join('&');
    return this.http.get<Product[]>(`${this.apiUrl}/by?${params}`).pipe(
      catchError((err) => {
        console.error('Error loading products by SKU:', err);
        return of([]);
      })
    );
  }

  loadCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoryUrl).pipe(
      tap((categories) => {
        this.categories.set(categories);
      }),
      catchError((err) => {
        console.error('Error loading categories:', err);
        return of([]);
      })
    );
  }

  formatPrice(priceCents: number, currency: string = 'TRY'): string {
    const price = priceCents / 100;
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency
    }).format(price);
  }
}
