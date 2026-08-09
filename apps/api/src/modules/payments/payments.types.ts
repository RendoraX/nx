export interface CreatePaymentOrderDTO {
  orderId: string;
  amount: string;
  provider?: "RAZORPAY" | "COD";
}

export interface VerifyPaymentDTO {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface PaymentWebhookDTO {
  paymentId?: string;
  orderId?: string;
  status?: string;
  signature?: string;
}
