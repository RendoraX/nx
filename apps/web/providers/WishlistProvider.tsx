"use client";

import React, { createContext, useContext, useEffect } from "react";
import {
  useQuery,
  type UseQueryResult,
} from "@tanstack/react-query";
import { useAuthContext } from "@/providers/AuthProviders";
import {
  wishlistService,
  type WishlistResponse,
} from "@/services/wishlist.service";
import { useWishlistStore } from "@/store/wishlist.store";

const WishlistQueryContext =
  createContext<UseQueryResult<WishlistResponse | null, Error> | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading, isAuthenticated } = useAuthContext();
  const userId = user?.id ?? null;
  const query = useQuery<WishlistResponse | null, Error>({
    queryKey: ["wishlist", userId],
    queryFn: wishlistService.getWishlist,
    enabled: !authLoading && isAuthenticated && !!userId,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
  const setWishlist = useWishlistStore((state) => state.setWishlist);
  const resetWishlist = useWishlistStore((state) => state.reset);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || !userId) {
      resetWishlist();
      return;
    }

    if (useWishlistStore.getState().ownerId !== userId) {
      resetWishlist();
    }
  }, [authLoading, isAuthenticated, resetWishlist, userId]);

  useEffect(() => {
    if (query.data !== undefined && userId) {
      setWishlist(query.data, userId);
    }
  }, [query.data, setWishlist, userId]);

  return (
    <WishlistQueryContext.Provider value={query}>
      {children}
    </WishlistQueryContext.Provider>
  );
}

export function useWishlistQuery() {
  const query = useContext(WishlistQueryContext);
  if (!query) {
    throw new Error("useWishlist must be used within a WishlistProvider.");
  }
  return query;
}
