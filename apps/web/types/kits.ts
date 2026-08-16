export interface ProductVariant {
  id: string;
  productId: string;
  size: string;
  sku: string;
  price: number;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  alt?: string | null;
  position: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number | null;
  sku: string;
  isActive: boolean;
  categoryId: string;
  images?: ProductImage[];
  variants?: ProductVariant[];
}

export interface TemplateItem {
  id: string;
  templateId: string;
  productId: string;
  quantity: number;
  product?: Product;
  selectedVariant?: ProductVariant | null;
}

export interface RitualTemplate {
  id: string;
  name: string;
  slug: string;
  description: string;
  curatedBy: string;
  baseBoxPrice: number;
  isActive: boolean;
  isManualPrice?: boolean;
  defaultItems: TemplateItem[];
}

export interface CustomizedItem {
  productId: string;
  quantity: number;
  variantId?: string;
}

export interface CreateBespokeKitPayload {
  templateId: string;
  templateName: string;
  baseBoxPrice: number;
  items: CustomizedItem[];
  totalPrice: number;
}