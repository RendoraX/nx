// types/product.ts

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  alt: string | null;
  position: number;
}

export interface Inventory {
  id: string;
  productId: string;
  stock: number;
  reserved: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

// Minimal stub definitions for relational dependencies to prevent compiler crashes
export interface OrderItem { id: string; productId: string; quantity: number; }
export interface CartItem { id: string; productId: string; quantity: number; }
export interface Review { id: string; productId: string; rating: number; comment: string; }

/**
 * The unified, production-ready Product definition.
 * Merges your custom UI components, backend database engine fields, and pagination metrics safely.
 */
export interface Product {
  // Database fields (Prisma Schema Matchers)
  id: string; 
  name: string;
  slug: string;
  description: string;
  price: string; // Transmitted safely as a high-precision string from database decimals
  comparePrice: string | null; // Transmitted safely as a high-precision string or null
  sku: string;
  isActive: boolean;
  categoryId: string;
  createdAt: string | Date;
  updatedAt: string | Date;

  // Database System Relations
  category: Category;
  images: ProductImage[];
  inventory: Inventory | null;
  orderItems?: OrderItem[];
  cartItems?: CartItem[];
  reviews?: Review[];
  

  // Micro-Frontend Application Component State Fields
  rating?: number;
  reviewsCount?: number; // Renamed or kept optionally to distinct from raw relations array
  purityBadge?: string;
  deliveryBadge?: string;
  discount?: string;
}

/**
 * Detailed structure for deep-dive application context
 */
export interface DetailedProduct extends Product {
  images: ProductImage[];
  inventory: Inventory;
  variants ?: any;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductListParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  slug?: string;
}

export interface ProductApiResponse {
  success: boolean;
  products: {
    items: Product[];
    pagination: PaginationMeta;
  };
}