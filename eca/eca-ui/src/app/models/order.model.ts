export type OrderStatus = 'new' | 'awaiting_stock' | 'awaiting_payment' | 'paid' | 'cancelled' | 'fulfilled';

export interface Order {
  id: number;
  userId: string;
  status: OrderStatus;
  totalCents: number;
  currency: string;
  paymentStatus: string;
  createdAt?: string;
  updatedAt?: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  orderId: number;
  productSku: string;
  quantity: number;
  unitPriceCents: number;
  subtotalCents: number;
}

export interface ProductQuantity {
  productSku: string;
  quantity: number;
}

export interface CreateOrderRequest {
  userId: string;
  currency: string;
  products: ProductQuantity[];
}
