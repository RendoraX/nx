export type PaymentMethod = "COD" | "ONLINE";

export interface CreateCustomKitOrder {
  kitId: string;
  addressId: string;
  paymentMethod: PaymentMethod;
  items: CustomKitOrderItem[];
}

export interface CustomKitOrderItem {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface PricedCustomKitOrderItem extends CustomKitOrderItem {
  price: number;
}