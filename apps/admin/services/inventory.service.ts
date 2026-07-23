import api from '@/lib/interceptor/axiosRES';
import { 
  InventoryItem, 
  InventorySummary, 
  InventoryHistoryLog, 
  StockAdjustmentPayload, 
  BulkAdjustmentPayload 
} from '@/types/inventory';
import axios from 'axios';

class InventoryService {
  private baseUrl = 'http://localhost:4000/api/admin/inventory';

  async getInventoryList(filters?: Record<string, string>): Promise<InventoryItem[]> {
    const params = new URLSearchParams(filters);
    const res = await api.get(`${this.baseUrl}${params.toString() ? `?${params.toString()}` : ''}`, { withCredentials : true});
    if (!res.data) throw new Error('Failed to retrieve inventory master ledger.');
    return res.data.inventory.map((item: any) => ({
      ...item,
      productId: item.variant?.product?.id ?? item.productId,
      product: item.variant?.product ? {
        id: item.variant.product.id,
        name: item.variant.product.name,
        sku: item.variant.product.sku,
        slug: item.variant.product.slug,
        description: item.variant.product.description,
        price: item.variant.product.price,
        comparePrice: item.variant.product.comparePrice,
        isActive: item.variant.product.isActive,
        categoryId: item.variant.product.categoryId,
      } : undefined,
      status: item.stock <= 0 ? 'out_of_stock' : item.stock <= 10 ? 'low_stock' : 'in_stock',
    }));
  }

  async getInventorySummary(): Promise<InventorySummary> {
    const res = await api.get(`${this.baseUrl}/summary`, { withCredentials : true});
    if (!res.data) throw new Error('Failed to compute metrics summary data.');
    return res.data.summary;
  }

  async getHistoryLog(filters?: Record<string, string>): Promise<InventoryHistoryLog[]> {
    const params = new URLSearchParams(filters);
    const res = await api.get(`${this.baseUrl}/history` , {withCredentials : true});
    if (!res.data) throw new Error('Failed to fetch ledger audit history trails.');
    return res.data.invHistory;
  }

  async adjustStock(payload: StockAdjustmentPayload): Promise<InventoryItem> {

    const res = await api.patch(`${this.baseUrl}/adjust` , payload , {
      withCredentials : true
    })
    if (!res.data) {
      const errData = await res.data.catch(() => ({}));
      throw new Error(errData.message || 'Validation failure during stock transaction adjustment.');
    }
    return res.data.inventory;
  }

  async bulkUpdateStock(payload: BulkAdjustmentPayload): Promise<{ adjustedCount: number }> {
    const res = await fetch(`${this.baseUrl}/bulk-adjust`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to execute atomic batch inventory operations.');
    return res.json();
  }
}

export const inventoryService = new InventoryService();