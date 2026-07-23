'use client';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/product.service';
import { Product } from '@/types/product';

/**
 * Hook to retrieve all catalog items with dynamic query structural filtering.
 */
export function useProducts(filters?: { searchQuery?: string; statusFilter?: string }) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.getProducts(filters),
    placeholderData: (previousData) => previousData, // Prevents layout shifts during query modifications
  });

  return {
    products:  data || [],
    loading: isLoading,
    error,
    refetch,
  };
}

/**
 * Hook to extract a single target product entity by identity context.
 */
export function useProduct(id: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id),
    enabled: !!id, // Prevent unneeded server roundtrips if ID is null/undefined
  });

  return {
    product: data,
    loading: isLoading,
    error,
  };
}