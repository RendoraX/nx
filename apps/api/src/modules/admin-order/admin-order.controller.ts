import type { Request, Response } from "express";
import { updateAdminOrderStatus } from "./admin-order.service";
import { prisma } from "../../../../../packages/database/src/client";

interface AuthRequest extends Request {
  user?: { id: string };
}

export const listAdminOrdersEndpoint = async (_req: AuthRequest, res: Response) => {
  try {
    const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } });
    return res.status(200).json({ orders });
  } catch (error: any) {
    return res.status(400).json({ message: error.message ?? "Failed to fetch orders" });
  }
};

export const getAdminOrderEndpoint = async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.findUnique({ where: { id: req.params.id as string } });
    return res.status(200).json({ order });
  } catch (error: any) {
    return res.status(400).json({ message: error.message ?? "Failed to fetch order" });
  }
};

export const updateAdminOrderStatusEndpoint = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const order = await updateAdminOrderStatus(userId, req.params.id as string, req.body.status);
    return res.status(200).json({ order });
  } catch (error: any) {
    return res.status(400).json({ message: error.message ?? "Failed to update order status" });
  }
};
