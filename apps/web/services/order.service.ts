// services/order.service.ts
import api from "@/lib/axios";
import { CreateOrderPayload, OrderResponse } from "@/types/checkout";

const BASE_URL = "http://localhost:4000/api"
export const orderService = {
  createOrder: async (payload: CreateOrderPayload): Promise<OrderResponse> => {
    const response = await api.post<OrderResponse>(`${BASE_URL}/orders`, payload);
    return response.data;
  },

  getOrder: async (id: string): Promise<OrderResponse> => {
    const response = await api.get<OrderResponse>(`${BASE_URL}/orders/${id}`);
    console.log("Order by id",response.data.order)
    return response.data;
  },

  listOrders: async (): Promise<OrderResponse[]> => {
    const response = await api.get<OrderResponse[]>(`${BASE_URL}/orders`);
    return response.data;
  },

  cancelOrder: async (id: string): Promise<OrderResponse> => {
    const response = await api.post<OrderResponse>(`${BASE_URL}/orders/${id}/cancel`);
    return response.data;
  },
};