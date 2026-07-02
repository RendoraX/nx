import type { Request, Response } from "express";
import { acceptDeliveryAssignment, assignDeliveryToOrder, listAssignedDeliveries, markDelivered, markOutForDelivery, markPickedUp } from "./delivery.service";

interface AuthRequest extends Request {
  user?: { id: string };
}

//completed
export const listAssignedDeliveriesEndpoint = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const deliveries = await listAssignedDeliveries(userId);
    return res.status(200).json({ deliveries });
  } catch (error: any) {
    return res.status(400).json({ message: error.message ?? "Failed to fetch deliveries" });
  }
};

//completed
export const acceptDeliveryAssignmentEndpoint = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const result = await acceptDeliveryAssignment(userId, req.params.id as string);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message ?? "Failed to accept delivery" });
  }
};

//completed
export const pickupDeliveryEndpoint = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const result = await markPickedUp(userId, req.params.id as string);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message ?? "Failed to mark pickup" });
  }
};

//completed
export const outForDeliveryEndpoint = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const result = await markOutForDelivery(userId, req.params.id as string);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message ?? "Failed to mark out for delivery" });
  }
};

//completed
export const deliveredEndpoint = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const result = await markDelivered(userId, req.params.id as string);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message ?? "Failed to mark delivered" });
  }
};

//completed
export const assignDeliveryEndpoint = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const result = await assignDeliveryToOrder(userId, req.params.id as string, req.body.deliveryBoyId);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message ?? "Failed to assign delivery" });
  }
};
