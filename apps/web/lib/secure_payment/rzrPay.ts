// lib/secure_payment/rzrPay.ts
import { VerifyPaymentPayload } from "@/types/checkout";
import { paymentService } from "@/services/payment.service";

export interface OpenRazorpayOptions {
  orderId: string;
  razorpayOrderId: string;
  amount: number;
  currency?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  onSuccess?: (response: any) => void;
  onFailure?: (error: any) => void;
}

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && (window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const openRazorpay = async ({
  orderId,
  razorpayOrderId,
  amount,
  currency = "INR",
  prefill,
  onSuccess,
  onFailure,
}: OpenRazorpayOptions): Promise<void> => {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    const errorMsg = "Razorpay SDK failed to load. Please check your internet connection.";
    if (onFailure) onFailure(new Error(errorMsg));
    return;
  }

  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_TK2vyHVBYCcW9v",
    amount: amount,
    currency: currency,
    name: "Luxury Vault",
    description: `Payment for Order #${orderId}`,
    order_id: razorpayOrderId,
    prefill: {
      name: prefill?.name || "",
      email: prefill?.email || "",
      contact: prefill?.contact || "",
    },
    theme: { color: "#1B3B2B" },

    handler: async (response: VerifyPaymentPayload) => {
      try {
        const verifyRes = await paymentService.verifyPayment({...response , amount  : String(amount)});
        if (onSuccess) onSuccess(verifyRes);
      } catch (err: any) {
        await paymentService.failPayment(orderId, { reason: "verification_failed", err });
        if (onFailure) onFailure(err);
      }
    },

    modal: {
      ondismiss: async () => {
        await paymentService.failPayment(orderId, { reason: "user_cancelled" });
        if (onFailure) onFailure(new Error("Payment cancelled by user."));
      },
    },
  };

  const rzp = new (window as any).Razorpay(options);
  rzp.open();
};

export default openRazorpay;