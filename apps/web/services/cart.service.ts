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

const API_BASE = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart`;

export const CartService = {
  getCart: async (): Promise<CartResponse> => {
    const res = await api.get(`${API_BASE}`);
    console.log("cart ", res.data.cart)
    if (!res.data.success) {
      throw new Error(res.data.message || 'An error occurred while retrieving the cart.');
    }
    return res.data.cart;
  },

  addToCart: async (payload: AddToCartDTO): Promise<CartResponse> => {
    const res = await api.post(`${API_BASE}/items`, payload);
    if (!res.data.success) {
      throw new Error(res.data.message || 'An error occurred while adding item to cart.');
    }
    return res.data.cart;
  },

  updateQuantity: async ({ itemId, quantity }: UpdateCartItemDTO): Promise<CartResponse> => {
    const res = await api.patch(`${API_BASE}/items/${itemId}`, { quantity });
    if (!res.data.success) {
      throw new Error(res.data.message || 'An error occurred while updating cart item quantity.');
    }
    return res.data.cart;
  },

  removeFromCart: async (itemId: string): Promise<CartResponse> => {
    const res = await api.delete(`${API_BASE}/items/${itemId}`);
    if (!res.data.success) {
      throw new Error(res.data.message || 'An error occurred while removing item from cart.');
    }
    return res.data.cart;
  },

  clearCart: async (): Promise<{ success: boolean }> => {
    const res = await api.delete(`${API_BASE}`);
    if (!res.data.success) {
      throw new Error(res.data.message || 'An error occurred while clearing cart.');
    }
    return res.data;
  },
};