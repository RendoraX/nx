"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  AddWishlistVariables,
  RemoveWishlistVariables,
} from "@/services/wishlist.service";
import { wishlistService } from "@/services/wishlist.service";
import { useWishlistQuery } from "@/providers/WishlistProvider";
import { useWishlistStore } from "@/store/wishlist.store";

type WishlistSnapshot = Pick<
  ReturnType<typeof useWishlistStore.getState>,
  "wishlistId" | "ownerId" | "items"
>;

export function useWishlist() {
  const queryClient = useQueryClient();
  const query = useWishlistQuery();
  const items = useWishlistStore((state) => state.items);
  const wishlistId = useWishlistStore((state) => state.wishlistId);
  const addItemOptimistically = useWishlistStore(
    (state) => state.addItemOptimistically,
  );
  const removeItemOptimistically = useWishlistStore(
    (state) => state.removeItemOptimistically,
  );
  const clearItemsOptimistically = useWishlistStore(
    (state) => state.clearItemsOptimistically,
  );
  const restore = useWishlistStore((state) => state.restore);

  const addItemMutation = useMutation<
    void,
    Error,
    AddWishlistVariables,
    WishlistSnapshot
  >({
    mutationFn: wishlistService.addToWishlist,
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });
      const { wishlistId: currentWishlistId, ownerId, items: currentItems } =
        useWishlistStore.getState();
      const snapshot = {
        wishlistId: currentWishlistId,
        ownerId,
        items: currentItems,
      };

      addItemOptimistically({
        id: `temp-${Date.now()}`,
        wishlistId: currentWishlistId ?? "",
        productId: newItem.productId,
        variantId: newItem.variantId,
      });

      return snapshot;
    },
    onError: (_error, _variables, snapshot) => {
      if (snapshot) restore(snapshot);
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["wishlist"] }),
  });

  const removeItemMutation = useMutation<
    void,
    Error,
    RemoveWishlistVariables,
    WishlistSnapshot
  >({
    mutationFn: ({ id, productId, variantId }) => {
      const currentWishlistId = id ?? useWishlistStore.getState().wishlistId;
      if (!currentWishlistId) {
        throw new Error("Wishlist is not available.");
      }

      return wishlistService.removeFromWishlist({
        id: currentWishlistId,
        productId,
        variantId,
      });
    },
    onMutate: async ({ productId, variantId }) => {
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });
      const { wishlistId: currentWishlistId, ownerId, items: currentItems } =
        useWishlistStore.getState();
      const snapshot = {
        wishlistId: currentWishlistId,
        ownerId,
        items: currentItems,
      };

      removeItemOptimistically(productId, variantId);
      return snapshot;
    },
    onError: (_error, _variables, snapshot) => {
      if (snapshot) restore(snapshot);
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["wishlist"] }),
  });

  const clearMutation = useMutation<void, Error, void, WishlistSnapshot>({
    mutationFn: wishlistService.clearWishlist,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });
      const { wishlistId: currentWishlistId, ownerId, items: currentItems } =
        useWishlistStore.getState();
      const snapshot = {
        wishlistId: currentWishlistId,
        ownerId,
        items: currentItems,
      };

      clearItemsOptimistically();
      return snapshot;
    },
    onError: (_error, _variables, snapshot) => {
      if (snapshot) restore(snapshot);
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["wishlist"] }),
  });

  const isInWishlist = (productId?: string, variantId?: string) => {
    if (!productId) return false;
    return useWishlistStore.getState().items.some(
      (item) =>
        item.productId === productId &&
        (!variantId || item.variantId === variantId),
    );
  };

  return {
    items,
    totalItems: items.length,
    wishlistId,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    addItem: addItemMutation.mutate,
    addItemAsync: addItemMutation.mutateAsync,
    isAdding: addItemMutation.isPending,
    removeItem: removeItemMutation.mutate,
    removeItemAsync: removeItemMutation.mutateAsync,
    isRemoving: removeItemMutation.isPending,
    clearWishlist: clearMutation.mutate,
    clearWishlistAsync: clearMutation.mutateAsync,
    isClearing: clearMutation.isPending,
    isInWishlist,
  };
}
