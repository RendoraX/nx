import { OrderDetails, OrderSummary, OrderStatus } from '@/types/orders';

export interface OrderFilters {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

class OrderService {
  async getOrdersList(filters: OrderFilters = {}): Promise<{ data: OrderDetails[]; total: number }> {
    const params = new URLSearchParams(filters as any);
    const res = await fetch(`/api/admin/orders?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to resolve data node collection metrics.');
    return res.json();
  }

  async getOrderSummary(): Promise<OrderSummary> {
    const res = await fetch('/api/admin/orders/summary');
    if (!res.ok) throw new Error('Summary telemetry unreachable.');
    return res.json();
  }

  async getOrderDetails(id: string): Promise<OrderDetails> {
    const res = await fetch(`/api/admin/orders/${id}`);
    if (!res.ok) throw new Error('Target log identity parsing failed.');
    return res.json();
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<OrderDetails> {
    const res = await fetch(`/api/admin/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Transaction execution denied by host rule.');
    return res.json();
  }

  async cancelOrder(id: string): Promise<void> {
    const res = await fetch(`/api/admin/orders/${id}/cancel`, { method: 'PATCH' });
    if (!res.ok) throw new Error('Cancellation sequence abort fault.');
  }
}

export const orderService = new OrderService();