export interface ProductVariant {
  id?: string;
  sku: string;
  sizeValue: string; // e.g., "250", "30"
  sizeUnit: 'ml' | 'g' | 'kg' | 'oz' | 'sachet' | 'pouch' | 'bottle'; 
  stock: number;
  price: number;
  comparePrice?: number | null;
  size ?: string
}

export interface ProductImage {
  id?: string;
  url: string;
  alt?: string | null;
  position: number;
  file?: File;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice: number | null;
  sku: string;
  isActive: boolean;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
  hasVariants: boolean;
  variants: ProductVariant[]; // Holds your 250ml bottles, 30g pouches, etc.
  shortDescription?: string;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  status?: 'draft' | 'published' | 'archived';
}