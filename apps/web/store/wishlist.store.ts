import { create } from "zustand";
import type { WishlistItem, WishlistResponse } from "@/services/wishlist.service";

interface WishlistState {
  wishlistId: string | null;
  ownerId: string | null;
  items: WishlistItem[];
  setWishlist: (wishlist: WishlistResponse | null, ownerId: string | null) => void;
  addItemOptimistically: (item: WishlistItem) => void;
  removeItemOptimistically: (productId: string, variantId: string) => void;
  clearItemsOptimistically: () => void;
  restore: (snapshot: Pick<WishlistState, "wishlistId" | "ownerId" | "items">) => void;
  reset: () => void;
}

const initialState = {
  wishlistId: null,
  ownerId: null,
  items: [],
};

export const useWishlistStore = create<WishlistState>((set) => ({
  ...initialState,
  setWishlist: (wishlist, ownerId) =>
    set({
      wishlistId: wishlist?.id ?? null,
      ownerId,
      items: wishlist?.items ?? [],
    }),
  addItemOptimistically: (item) =>
    set((state) => {
      const exists = state.items.some(
        (savedItem) =>
          savedItem.productId === item.productId &&
          savedItem.variantId === item.variantId,
      );

      return exists ? state : { items: [...state.items, item] };
    }),
  removeItemOptimistically: (productId, variantId) =>
    set((state) => ({
      items: state.items.filter(
        (item) =>
          item.productId !== productId || item.variantId !== variantId,
      ),
    })),
  clearItemsOptimistically: () => set({ items: [] }),
  restore: (snapshot) => set(snapshot),
  reset: () => set(initialState),
}));
