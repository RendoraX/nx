export interface Address {
  id?: string | null;
  _id?: string | null;
  fullName: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  isDefault?: boolean;
}

export type AddressPayload = Address;

export interface OrderItemPayload {
  variantId: string;
  quantity: number;
  price: number;
}

export interface CreateOrderPayload {
  addressId: string;
  paymentMethod: "COD" | "ONLINE";
  items?: OrderItemPayload[];
}

export interface OrderResponse {
  _id: string;
  orderId: string;
  totalAmount: number;
  order : any;
  paymentMethod: "COD" | "ONLINE";
  status: string;
  addressId: string;
  createdAt: string;
}

export interface CreatePaymentOrderPayload {
  orderId: string;
  amount: number;
  provider?: string;
}

export interface RazorpayOrderResponse {
  razorpayOrderId: string;
  amount: number;
  currency: string;
}

export interface VerifyPaymentPayload {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  orderId?: string;
}
