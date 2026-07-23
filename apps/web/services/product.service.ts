// apps/web/services/product.service.ts
import api from "@/lib/axios";

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface FilterFacet {
  categories: { id: string; name: string; slug: string; count: number }[];
  priceRange: { min: number; max: number };
}

export interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  sort?: 'price_asc' | 'price_desc' | 'rating' | 'newest';
  minPrice?: number;
  maxPrice?: number;
}

export interface GetProductsResponse {
  products: Product[];
  pagination: PaginationMeta;
  filters: FilterFacet;
}


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
  variants ?: any;

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
export const ProductService = {
  /**
   * Fetches an optimized list of storefront products mapped to query facets using Axios interceptor parameters
   */
  async getProducts(params: GetProductsParams = {}): Promise<GetProductsResponse> {
    const apiParams: Record<string, any> = {};
    
    if (params.page) apiParams.page = params.page;
    if (params.limit) apiParams.limit = params.limit;
    if (params.search) apiParams.search = params.search;
    if (params.categoryId) apiParams.categoryId = params.categoryId;
    
    if (params.sort) {
      const [field, order] = params.sort.split('_');
      apiParams.sort = field;
      apiParams.order = order || 'desc';
    }
    
    if (params.minPrice !== undefined) apiParams.minPrice = params.minPrice;
    if (params.maxPrice !== undefined) apiParams.maxPrice = params.maxPrice;

    try {
      const response = await api.get<GetProductsResponse>('/api/products', { params: apiParams });
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to retrieve product data catalog parameters.');
    }
  },

  /**
   * Retrieves a single product configuration profile by its unique structural slug
   */
  async getProduct(slug: string): Promise<Product> {
    try {
      const response = await api.get<Product>(`/products/${slug}`);
      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 404) {
        throw new Error('Requested product ritual variant could not be located.');
      }
      throw new Error(error?.response?.data?.message || 'Server encountered a runtime verification issue processing product records.');
    }
  },

  /**
   * Fetches contextual related products sharing identical category identities
   */
  async getRelatedProducts(categoryId: string, limit = 4): Promise<Product[]> {
    try {
      const response = await api.get<Partial<{products : Product[]}>>(`/api/products/related/${categoryId}`, {
        params: { limit },
      });
      return response.data.products as any;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Could not pull comparable product sets.');
    }
  },

  async getProductBySlug(slug : string){
    try {
      const response= await api.get(`/api/products/${slug}`);

      console.log(response.data)
      return response.data.product 
    } catch (error : any) {
      throw new Error(error.response.data.message || "Can't get product by slug");
    }
  }
};