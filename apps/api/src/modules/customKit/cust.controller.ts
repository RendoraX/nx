import type { Request, Response } from "express";
import { placeKitOrder } from "./cust.service";

interface AuthRequest extends Request {
  user?: { id: string };
}

export const createCustomKitOrderEndpoint = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }
    const order = await placeKitOrder(req.body, userId);
    return res.status(201).json({ message: "Custom kit order created.", order, success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create custom kit order.";
    return res.status(400).json({ message, success: false });
  }
};
