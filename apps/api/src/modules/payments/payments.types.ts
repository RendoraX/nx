export interface CreatePaymentOrderDTO {
  orderId: string;
  amount: string;
  provider?: "RAZORPAY" | "COD";
}

export interface VerifyPaymentDTO {
  paymentId: string;
  orderId: string;
  amount: string;
  signature: string;
}

export interface PaymentWebhookDTO {
  paymentId?: string;
  orderId?: string;
  status?: string;
  signature?: string;
}
