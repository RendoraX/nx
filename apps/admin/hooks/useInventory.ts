'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryService } from '@/services/inventory.service';
import { StockAdjustmentPayload, BulkAdjustmentPayload } from '@/types/inventory';

export function useInventory(filters?: Record<string, string>) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['inventory', filters],
    queryFn: () => inventoryService.getInventoryList(filters),
    
    // CRITICAL OPTIMIZATION FOR CLIENT-SIDE FILTERING:
    staleTime: 5 * 60 * 1000,   // Consider data fresh for 5 minutes (won't auto-fetch on typing)
    gcTime: 10 * 60 * 1000,      // Keep cache in memory for 10 minutes
    refetchOnWindowFocus: false, // Don't trigger a network call when clicking back on the window
    refetchOnMount: false,       // Don't auto-fetch if data is already in cache
  });

  return { inventory: data || [], loading: isLoading, refetch };
}

export function useInventorySummary() {
  const { data, isLoading } = useQuery({
    queryKey: ['inventory-summary'],
    queryFn: () => inventoryService.getInventorySummary(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  return { summary: data, loading: isLoading };
}

export function useInventoryHistory(filters?: Record<string, string>) {
  const { data, isLoading } = useQuery({
    queryKey: ['inventory-history', filters],
    queryFn: () => inventoryService.getHistoryLog(filters),
  });
  return { history: data || [], loading: isLoading };
}

export function useAdjustStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: StockAdjustmentPayload) => inventoryService.adjustStock(payload),
    onSuccess: () => {
      // Force refresh data ONLY when an actual modification mutation succeeds
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-summary'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-history'] });
    },
  });
}

export function useBulkStockUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BulkAdjustmentPayload) => inventoryService.bulkUpdateStock(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-summary'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-history'] });
    },
  });
}