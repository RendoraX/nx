'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService, OrderFilters } from '@/services/order.service';
import { OrderStatus } from '@/types/orders';
import { toast } from 'sonner';

export function useOrders(filters: OrderFilters) {
  return useQuery({
    queryKey: ['orders', filters],
    queryFn: () => orderService.getOrdersList(filters),
    staleTime: 30000,
    placeholderData: (previousData) => previousData,
  });
}

export function useOrderSummary() {
  return useQuery({
    queryKey: ['orders-summary'],
    queryFn: () => orderService.getOrderSummary(),
    staleTime: 60000,
  });
}

export function useOrderDetails(id: string) {
  return useQuery({
    queryKey: ['order-details', id],
    queryFn: () => orderService.getOrderDetails(id),
    enabled: !!id,
  });
}

export function useUpdateOrderStatus(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: OrderStatus) => orderService.updateOrderStatus(id, status),
    onSuccess: () => {
      toast.success('State transition log successfully updated.');
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orders-summary'] });
      queryClient.invalidateQueries({ queryKey: ['order-details', id] });
    },
    onError: (err: any) => toast.error(err.message),
  });
}