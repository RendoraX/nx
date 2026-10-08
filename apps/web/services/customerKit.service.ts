// @/services/customerKit.service.ts
import api from "@/lib/axios";

export interface CustomerProductSummary {
  id: string;
  name: string;
  sku: string;
  price: number;
  description?: string;
  images?: { url: string; alt?: string | null }[];
  variants?: CustomerProductVariant[];
}

export interface CustomerProductVariant {
  id: string;
  productId: string;
  size: string;
  sku: string;
  price: number;
  stock?: number;
}

export interface CustomerKitItem {
  id: string;
  productId: string;
  quantity: number;
  variantId: string | null;
  product: CustomerProductSummary;
  selectedVariant?: CustomerProductVariant | null;
}

export interface CustomerRitualKit {
  id: string;
  name: string;
  slug: string;
  description: string;
  curatedBy: string;
  baseBoxPrice: number;
  isManualPrice: boolean;
  isActive: boolean;
  defaultItems: CustomerKitItem[];
}

export interface CustomerInfo {
  name?: string;
  email?: string;
  phone?: string;
  shippingAddress?: string;
}

export interface CreateKitOrderPayload {
  kitId: string;
  addressId: string;
  paymentMethod: "COD" | "ONLINE";
  items: {
    productId: string;
    variantId: string;
    quantity: number;
  }[];
}

export interface KitOrderResponse {
  success: boolean;
  order: {
    id: string;
    type: "KIT";
    kitName: string;
    subtotal: number | string;
    totalAmount: number | string;
    status: string;
    createdAt: string;
  };
}

export const CustomerKitService = {
  /**
   * Fetch all publicly active ritual kits for the customer catalog grid
   */
  async getActiveCatalogKits(): Promise<CustomerRitualKit[]> {
    const response = await api.get<{ kits: CustomerRitualKit[] }>("/api/custkits");
    return (response.data.kits ?? []).filter((kit) => kit.isActive);
  },

  /**
   * Fetch details for a specific kit via its URL slug
   */
  async getKitBySlug(slug: string): Promise<CustomerRitualKit> {
    const response = await api.get<Partial<{kit : CustomerRitualKit}>>(`/api/custkits/slug/${slug}`);
    return response.data.kit as CustomerRitualKit;
  },

  /**
   * Create an order for a customized kit
   */
  async createOrder(payload: CreateKitOrderPayload): Promise<KitOrderResponse> {
    const response = await api.post<KitOrderResponse>("/api/custkits/order", payload);
    return response.data;
  }
};