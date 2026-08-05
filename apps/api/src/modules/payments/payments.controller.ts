import type { Request, Response } from "express";
import { createPaymentOrder, failPayment, handlePaymentWebhook, verifyPayment } from "./payments.service";

interface AuthRequest extends Request {
  user?: { id: string };
}


//completed
export const createPaymentOrderEndpoint = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const payment = await createPaymentOrder(userId, req.body);
    return res.status(201).json({ payment  , success : true});
  } catch (error: any) {
    console.log("Payment logger=========", error.message)
    return res.status(400).json({ message: error.message ?? "Failed to create payment order"  , success : false});
  }
};

//completed
export const verifyPaymentEndpoint = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const result = await verifyPayment(userId, req.body);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message ?? "Failed to verify payment" });
  }
};

//completed
export const webhookEndpoint = async (_req: Request, res: Response) => {
  try {
    const result = await handlePaymentWebhook(_req.body);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message ?? "Webhook failed" });
  }
};


//completed
export const paymentDetailsEndpoint = async (req: Request, res: Response) => {
  try {
    const payment = await (await import("./payments.repository")).findPaymentByOrderId(req.params.orderId as string);
    return res.status(200).json({ payment });
  } catch (error: any) {
    return res.status(400).json({ message: error.message ?? "Failed to fetch payment" });
  }
};


//completed
export const failPaymentEndpoint = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const result = await failPayment(userId, req.params.orderId as string);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message ?? "Failed to fail payment" });
  }
};
