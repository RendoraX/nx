import { useState, useCallback } from "react";
import { orderService } from "@/services/order.service";
import { CreateOrderPayload, OrderResponse } from "@/types/checkout";

export const useOrders = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = useCallback(async (payload: CreateOrderPayload): Promise<OrderResponse> => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderService.createOrder(payload);
      return response;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to create order.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const getOrder = useCallback(async (id: string): Promise<OrderResponse> => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderService.getOrder(id);
      return response;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to fetch order.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const listOrders = useCallback(async (): Promise<OrderResponse[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderService.listOrders();
      return response;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to list orders.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelOrder = useCallback(async (id: string): Promise<OrderResponse> => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderService.cancelOrder(id);
      return response;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to cancel order.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  return { createOrder, getOrder, listOrders, cancelOrder, loading, error };
};