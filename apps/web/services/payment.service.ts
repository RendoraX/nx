// services/payment.service.ts
import axios from "axios";
import {
  CreatePaymentOrderPayload,
  RazorpayOrderResponse,
  VerifyPaymentPayload,
  VerifyPaymentResponse,
} from "@/types/checkout";

const API = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api` || "http://localhost:4000/api",
  withCredentials: true,
});

export const paymentService = {
  createPaymentOrder: async (
    payload: CreatePaymentOrderPayload
  ): Promise<RazorpayOrderResponse> => {
    const response = await API.post<RazorpayOrderResponse>("/payments/create-order", payload);
    return response.data;
  },

  verifyPayment: async (
    payload: VerifyPaymentPayload
  ): Promise<VerifyPaymentResponse> => {
    const response = await API.post<VerifyPaymentResponse>("/payments/verify", payload);
    return response.data;
  },

  failPayment: async (orderId: string, errorDetails?: any): Promise<any> => {
    const response = await API.post(`/payments/${orderId}/fail`, { errorDetails });
    return response.data;
  },

  getPaymentDetails: async (orderId: string): Promise<any> => {
    const response = await API.get(`/payments/${orderId}`);
    return response.data;
  },
};