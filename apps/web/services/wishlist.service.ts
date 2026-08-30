import api from "@/lib/axios";

export interface WishlistVariant {
  id: string;
  size?: string;
  sku?: string;
  price?: number;
}

export interface WishlistItem {
  id: string;
  wishlistId: string;
  productId: string;
  variantId: string;
  createdAt?: string;

  variant?: WishlistVariant;

  name?: string;
  slug?: string;
  price?: number;
  originalPrice?: number;
  imageUrl?: string;
  inStock?: boolean;
  category?: string;
  rating?: number;
}

export interface WishlistResponse {
  id: string;
  userId: string;
  items: WishlistItem[];
  totalItems: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddWishlistVariables {
  productId: string;
  variantId: string;
}

export interface RemoveWishlistVariables {
  id?: string;
  productId: string;
  variantId: string;
}

interface RawWishlistResponse {
  message: string;

  items: {
    id: string;
    userId: string;
    createdAt?: string;
    updatedAt?: string;

    items: WishlistItem[];
  } | null;
}

export const wishlistService = {
  // =========================
  // GET WISHLIST
  // =========================

  getWishlist: async (): Promise<WishlistResponse | null> => {
    const { data } = await api.get<RawWishlistResponse>(
      "/api/wishlist"
    );

    if (!data?.items) {
      return null;
    }

    return {
      id: data.items.id,
      userId: data.items.userId,
      items: data.items.items ?? [],
      totalItems: data.items.items?.length ?? 0,
      createdAt: data.items.createdAt,
      updatedAt: data.items.updatedAt,
    };
  },

  // =========================
  // ADD ITEM
  // =========================

  addToWishlist: async ({
    productId,
    variantId,
  }: AddWishlistVariables): Promise<WishlistItem> => {
    const { data } = await api.post(
      "/api/wishlist/ad",
      {
        productId,
        variantId,
      }
    );

    return data.item ?? data;
  },

  // =========================
  // REMOVE ITEM
  // =========================

removeFromWishlist: async ({
  id,
  productId,
  variantId,
}: RemoveWishlistVariables): Promise<void> => {
  await api.delete(
    id ? `/api/wishlist/${id}` : "/api/wishlist",
    {
      data: {
        productId,
        variantId,
      },
    }
  );
},

  // =========================
  // CLEAR WISHLIST
  // =========================

  clearWishlist: async (): Promise<void> => {
    await api.delete("/api/wishlist");
  },
};