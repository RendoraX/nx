'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services/product.service';
import { Product } from '@/types/product';


export function useDeleteProduct() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  return {
    deleteProduct: mutateAsync,
    isDeleting: isPending,
  };
}