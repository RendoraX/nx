// /Users/swapnilnade/Project/shri_vishwanath/apps/web/hooks/useWishlist.ts
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  wishlistService,
  WishlistItem,
  WishlistResponse,
  AddWishlistVariables,
  RemoveWishlistVariables,
} from "@/services/wishlist.service";

export function useWishlist() {
  const queryClient = useQueryClient();

  // 1. Fetch Wishlist Data
  const {
    data: wishlistData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<WishlistResponse | null, Error>({
    queryKey: ["wishlist"],
    queryFn: wishlistService.getWishlist,
    staleTime: 1000 * 60 * 5,
  });

  // Local state mirror to eliminate UI flicker/revert
  const [localItems, setLocalItems] = useState<WishlistItem[]>([]);

  // Keep local state synced with incoming server data
  useEffect(() => {
    if (wishlistData?.items) {
      setLocalItems(wishlistData.items);
    }
  }, [wishlistData]);

  const wishlistId: string | null = wishlistData?.id ?? null;

  // 2. Add Mutation
  const addItemMutation = useMutation<WishlistItem, Error, AddWishlistVariables>({
    mutationFn: wishlistService.addToWishlist,
    onMutate: async (newItem) => {
      // 1. Instantly update local react state
      const tempItem: WishlistItem = {
        id: `temp-${Date.now()}`,
        wishlistId: wishlistId || "",
        productId: newItem.productId,
        variantId: newItem.variantId,
      };
      setLocalItems((prev) => [...prev, tempItem]);
    },
    onSuccess: () => {
      // Delay refetch slightly so database finishes writing
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      }, 500);
    },
    onError: () => {
      // Revert local state on real backend error
      if (wishlistData?.items) setLocalItems(wishlistData.items);
    },
  });

  // 3. Remove Mutation
  const removeItemMutation = useMutation<void, Error, RemoveWishlistVariables>({
    mutationFn: (variables) =>
      wishlistService.removeFromWishlist({
        id: variables.id || wishlistId || "",
        productId: variables.productId,
        variantId: variables.variantId,
      }),
    onMutate: async ({ productId, variantId }) => {
      // 1. Instantly remove from local react state
      setLocalItems((prev) =>
        prev.filter(
          (item) => !(item.productId === productId && (!variantId || item.variantId === variantId))
        )
      );
    },
    onSuccess: () => {
      // Delay refetch slightly so database finishes deleting
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      }, 500);
    },
    onError: () => {
      // Revert local state on real backend error
      if (wishlistData?.items) setLocalItems(wishlistData.items);
    },
  });

  // Helper function to check if item is in wishlist using localItems
  const isInWishlist = (productId?: string, variantId?: string) => {
    if (!productId) return false;
    return localItems.some(
      (item) =>
        item.productId === productId &&
        (!variantId || item.variantId === variantId)
    );
  };
// Add inside useWishlist hook in /Users/swapnilnade/Project/shri_vishwanath/apps/web/hooks/useWishlist.ts

  // Clear Mutation
  const clearMutation = useMutation<void, Error, void>({
    mutationFn: () => wishlistService.clearWishlist(),
    onMutate: async () => {
      setLocalItems([]);
    },
    onSuccess: () => {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      }, 500);
    },
    onError: () => {
      if (wishlistData?.items) setLocalItems(wishlistData.items);
    },
  });

  return {
    items: localItems,
    totalItems: localItems.length,
    wishlistId,
    isLoading,
    isError,
    error,
    refetch,

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