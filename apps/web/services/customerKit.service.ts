// @/services/customerKit.service.ts
import api from "@/lib/axios";

export interface CustomerProductSummary {
  id: string;
  name: string;
  sku: string;
  price: number;
  description?: string;
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

export const CustomerKitService = {
  /**
   * Fetch all publicly active ritual kits for the customer catalog grid
   */
  async getActiveCatalogKits(): Promise<CustomerRitualKit[]> {
    const response = (await api.get<Partial<{kits : CustomerRitualKit[]}>>("http://localhost:4000/api/custkits/"));
    return response.data.kits as CustomerRitualKit[];
  },

  /**
   * Fetch details for a specific kit via its URL slug
   */
  async getKitBySlug(slug: string): Promise<CustomerRitualKit> {
    const response = await api.get<CustomerRitualKit>(`/custkits/slug/${slug}`);
    return response.data;
  }
};