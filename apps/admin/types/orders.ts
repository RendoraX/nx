export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PACKED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  price: number;
}

export interface OrderLog {
  id: string;
  fromStatus: OrderStatus | 'INIT';
  toStatus: OrderStatus;
  note?: string;
  createdAt: string;
}

export interface OrderDetails {
  id: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  items: OrderItem[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  payment: {
    method: string;
    status: PaymentStatus;
    transactionId?: string;
  };
  status: OrderStatus;
  amount: number;
  createdAt: string;
  timeline: OrderLog[];
}

export interface OrderSummary {
  PENDING: number;
  CONFIRMED: number;
  PACKED: number;
  SHIPPED: number;
  DELIVERED: number;
  CANCELLED: number;
}

// Immutable FSM State Map Matrix Guardrail configuration
export const ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PACKED', 'CANCELLED'],
  PACKED: ['SHIPPED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
};