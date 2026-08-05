import { useState, useCallback } from "react";
import { paymentService } from "@/services/payment.service";
import openRazorpay from "@/lib/secure_payment/rzrPay";

interface TriggerPaymentParams {
  orderId: string;
  amount: number;
  currency?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  onSuccess?: (res: any) => void;
  onFailure?: (err: any) => void;
}

export const usePayment = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const startPayment = useCallback(
    async ({ orderId, amount, currency = "INR", prefill, onSuccess, onFailure }: TriggerPaymentParams) => {
      setLoading(true);
      setError(null);

      try {
        // Step 1: Request backend to initialize Razorpay Order
        const rzpOrder = await paymentService.createPaymentOrder({ orderId, amount });

        // Extract valid Razorpay Order ID (starts with order_...)
        const razorpayOrderId = 
          (rzpOrder as any)?.payment?.razorpayOrderId || 
          (rzpOrder as any)?.payment?.transactionId || 
          (rzpOrder as any)?.razorpayOrderId;

        if (!razorpayOrderId || !razorpayOrderId.startsWith("order_")) {
          throw new Error("Invalid Razorpay Order ID returned from server.");
        }

        // Amount must be in paise for Razorpay frontend SDK
        const amountInPaise = Math.round(Number(amount) * 100);

        // Step 2: Pass options to openRazorpay helper
        await openRazorpay({
          orderId, // Internal DB Order ID (cms...)
          razorpayOrderId, // Valid Razorpay Order ID (order_...)
          amount: amountInPaise,
          currency,
          prefill,
          onSuccess: (res) => {
            setLoading(false);
            if (onSuccess) onSuccess(res);
          },
          onFailure: (err) => {
            setLoading(false);
            setError(err.message || "Payment processing failed.");
            if (onFailure) onFailure(err);
          },
        });
      } catch (err: any) {
        const msg = err.response?.data?.message || err.message || "Could not initiate payment.";
        setError(msg);
        setLoading(false);
        if (onFailure) onFailure(err);
      }
    },
    []
  );

  return { startPayment, loading, error };
};