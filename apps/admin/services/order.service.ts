import api from '@/lib/interceptor/axiosRES';
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
    const res = await api.get(`/api/admin/orders?${params.toString()}`);
    if (!res.data.success) throw new Error('Failed to resolve data node collection metrics.');
    return res.data.orders;
  }

  async getOrderSummary(): Promise<OrderSummary> {
    const res = await api.get(`/api/admin/orders/summary`);
    if (!res.data.success) throw new Error('Summary telemetry unreachable.');
    return res.data;
  }

  async getOrderDetails(id: string): Promise<OrderDetails> {
    const res = await api.get(`/api/admin/orders/${id}`);
    if (!res.data.success) throw new Error('Target log identity parsing failed.');
    return res.data.order;
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<OrderDetails> {
    const res = await api.patch(`/api/admin/orders/${id}/status`, { status });
    if (!res.data.success) throw new Error('Transaction execution denied by host rule.');
    return res.data.order;
  }

  async cancelOrder(id: string): Promise<void> {
    const res = await api.patch(`/api/admin/orders/${id}/cancel`, { method: 'PATCH' });
    if (!res.data.success) throw new Error('Cancellation sequence abort fault.');
  }
}

export const orderService = new OrderService();