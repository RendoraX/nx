'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services/product.service';
import { Product } from '@/types/product';

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) => 
      productService.updateProduct(id, data),
    onSuccess: (_, variables) => {
      // Intelligently clean both the active master collection view and the single node cache simultaneously
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
    },
  });

  return {
    updateProduct: mutateAsync,
    isUpdating: isPending,
  };
}