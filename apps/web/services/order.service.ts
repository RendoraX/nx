// services/order.service.ts
import api from "@/lib/axios";
import { CreateOrderPayload, OrderResponse } from "@/types/checkout";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL as string
export const orderService = {
  createOrder: async (payload: CreateOrderPayload): Promise<OrderResponse> => {
    const response = await api.post<OrderResponse>(`${BASE_URL}/api/orders`, payload);
    return response.data;
  },

  getOrder: async (id: string): Promise<OrderResponse> => {
    const response = await api.get<OrderResponse>(`${BASE_URL}/api/orders/${id}`);
    console.log("Order by id",response.data.order)
    return response.data;
  },

  listOrders: async (): Promise<OrderResponse[]> => {
    const response = await api.get<OrderResponse[]>(`${BASE_URL}/api/orders`);
    return response.data;
  },

  cancelOrder: async (id: string): Promise<OrderResponse> => {
    console.log("order id ::: " , id)
    const response = await api.post<OrderResponse>(`${BASE_URL}/api/orders/${id}/cancel`);
    return response.data;
  },
};