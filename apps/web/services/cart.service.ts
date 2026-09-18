import api from "@/lib/axios";

export interface Variant {
  id: string;
  title: string;
  sku: string;
  price: number;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
}

export interface CartProduct {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category: string;
  images: ProductImage[];
}

export interface Inventory {
  stock: number;
}

export interface CartItem {
  id: string;
  quantity: number;
  lineTotal: number;
  variant: Variant;
  product: CartProduct;
  inventory: Inventory;
}

export interface CartResponse {
  id: string;
  userId: string;
  itemCount: number;
  totalUniqueItems: number;
  subtotal: number;
  items: CartItem[];
}

export interface AddToCartDTO {
  variantId: string;
  quantity: number;
}

export interface UpdateCartItemDTO {
  itemId: string;
  quantity: number;
}

// Fallback cart object to prevent UI crashes if backend returns null/undefined cart
const DEFAULT_EMPTY_CART: CartResponse = {
  id: "",
  userId: "",
  itemCount: 0,
  totalUniqueItems: 0,
  subtotal: 0,
  items: [],
};

export const CartService = {
  getCart: async (): Promise<CartResponse> => {
    try {
      const res = await api.get("/api/cart");
      
      if (!res.data || !res.data.success) {
        return DEFAULT_EMPTY_CART;
      }
      
      return res.data.cart ?? DEFAULT_EMPTY_CART;
    } catch (error: any) {
      console.error("Cart retrieval error:", error);
      // Return empty cart fallback instead of throwing uncaught 500 server errors to the page
      return DEFAULT_EMPTY_CART;
    }
  },

  addToCart: async (payload: AddToCartDTO): Promise<CartResponse> => {
    const res = await api.post("/api/cart/items", payload);
    if (!res.data?.success) {
      throw new Error(res.data?.message || 'An error occurred while adding item to cart.');
    }
    return res.data.cart;
  },

  updateQuantity: async ({ itemId, quantity }: UpdateCartItemDTO): Promise<CartResponse> => {
    const res = await api.patch(`/api/cart/items/${itemId}`, { quantity });
    if (!res.data?.success) {
      throw new Error(res.data?.message || 'An error occurred while updating cart item quantity.');
    }
    return res.data.cart;
  },

  removeFromCart: async (itemId: string): Promise<CartResponse> => {
    const res = await api.delete(`/api/cart/items/${itemId}`);
    if (!res.data?.success) {
      throw new Error(res.data?.message || 'An error occurred while removing item from cart.');
    }
    return res.data.cart;
  },

  clearCart: async (): Promise<{ success: boolean }> => {
    const res = await api.delete("/api/cart");
    if (!res.data?.success) {
      throw new Error(res.data?.message || 'An error occurred while clearing cart.');
    }
    return res.data;
  },
};