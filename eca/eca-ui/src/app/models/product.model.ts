export interface Product {
  id: number;
  sku: string;
  name: string;
  description: string;
  imageUrl: string;
  priceCents: number;
  currency: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductDetails extends Product {
  categories?: Category[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface CreateProductRequest {
  name: string;
  sku: string;
  description: string;
  imageUrl: string;
  priceCents: number;
  currency: string;
  isActive?: boolean;
  categoryIds?: number[];
}

export interface UpdateProductRequest extends CreateProductRequest {}

export interface CreateCategoryRequest {
  name: string;
}

export interface UpdateCategoryRequest {
  name: string;
}
