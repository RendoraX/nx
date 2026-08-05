export type OrderStatus = (typeof ORDER_STATUS_FLOW)[number];
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName?: string;
  sku?: string;
  quantity: number;
  price: number | string;
  variantId?: string | null;
}

export interface OrderLog {
  id: string;
  fromStatus?: OrderStatus | 'INIT';
  toStatus?: OrderStatus;
  status?: OrderStatus;
  note?: string | null;
  changedBy?: string | null;
  orderId?: string;
  createdAt: string;
}

export interface OrderCustomer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  isVerified?: boolean;
}

export interface OrderAddress {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  id?: string;
  fullName?: string;
  line1?: string;
  line2?: string | null;
  postalCode?: string;
  phone?: string;
}

export interface OrderPayment {
  method?: string;
  provider?: string;
  status: PaymentStatus | string;
  transactionId?: string | null;
  amount?: number | string;
}

export interface OrderDetails {
  id: string;
  customer?: OrderCustomer;
  user?: OrderCustomer; // Mapped from backend Prisma relation
  userId?: string;
  items?: OrderItem[];
  shippingAddress?: OrderAddress;
  Address?: OrderAddress; // Mapped from backend Prisma relation
  addressId?: string;
  payment?: OrderPayment;
  status: OrderStatus;
  amount?: number | string;
  subtotal?: number | string;
  shippingAmount?: number | string;
  totalAmount?: number | string;
  createdAt: string;
  updatedAt?: string;
  timeline?: OrderLog[];
  statusHistory?: OrderLog[]; // Mapped from backend Prisma relation
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


export const ORDER_STATUS_FLOW = [
  'PENDING',
  'CONFIRMED',
  'PACKED',
  'SHIPPED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
] as const;


export const ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PACKED', 'CANCELLED'],
  PACKED: [ 'SHIPPED', 'CANCELLED'],
  SHIPPED: ['OUT_FOR_DELIVERY', 'CANCELLED'],
  OUT_FOR_DELIVERY: ['DELIVERED', 'CANCELLED'],
  DELIVERED: [],
  CANCELLED: [],
};