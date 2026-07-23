'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services/product.service';
import { Product } from '@/types/product';

export function useCreateProduct() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (newProduct: Partial<Product>) => productService.createProduct(newProduct),
    onSuccess: () => {
      // Invalidate full collection stack instantly
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  
  return {
    createProduct: mutateAsync,
    isCreating: isPending,
  };
}