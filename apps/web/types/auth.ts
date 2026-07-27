export interface User {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  isVerified: boolean;
  phone: string | null;
  role: 'USER' | 'ADMIN' | 'DELIVERY' | 'SUPER_ADMIN';
  orders: Order[];
  cart: Cart | null;
  sessions: Session[];
  reviews : any;
  addresses: Address[];
  notifications : any
  currentSessionId : string
}

export interface Session {
  id: string;
  userId: string;
  refreshTokenHash: string | null;
  userAgent: string | null;
  ipAddress: string | null;
  revoked: boolean;
  createdAt: string | Date;
  lastUsedAt: string | Date | null;
  expiresAt: string | Date;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string | null;
  postalCode: string;
  isDefault: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
export interface Order {
  id: string;
  userId: string;
  status: 'PENDING' | 'CONFIRMED' | 'PACKED' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  subtotal: number | string;
  shippingAmount: number | string;
  totalAmount: number | string;
  addressId: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number | string;
  Product : product
}

export interface product{
  name : string
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
}