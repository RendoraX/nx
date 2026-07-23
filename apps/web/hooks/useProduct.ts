// apps/web/hooks/useProducts.ts
'use client';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { ProductService, GetProductsParams } from '../services/product.service';

/**
 * Custom hook to control product browsing matrices with advanced cache invalidation
 */
export function useProducts(params: GetProductsParams) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => ProductService.getProducts(params),
    placeholderData: keepPreviousData, // Smooth UX transition: locks current viewport metrics during next-page queries
    staleTime: 1000 * 60 * 5, // 5 Minutes data freshness validation window
    gcTime: 1000 * 60 * 30,   // Retain unreferenced query assets for 30 minutes
  });
}

/**
 * Custom hook to manage target specific descriptive configurations
 */
export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => ProductService.getProduct(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 10, // Product structural specs change infrequently
  });
}

/**
 * Custom hook providing contextual recommendations based on categorical overlaps
 */
export function useRelatedProducts(slug: string, limit?: number) {
  return useQuery({
    queryKey: ['products', 'related', slug, limit],
    queryFn: () => ProductService.getRelatedProducts(slug, limit),
    enabled: !!slug,
    staleTime: 1000 * 60 * 15,
  });
}