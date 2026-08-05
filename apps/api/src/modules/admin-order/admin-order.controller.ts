import type { Request, Response } from "express";
import { updateAdminOrderStatus } from "./admin-order.service";
import { prisma } from "../../../../../packages/database/src/client";

interface AuthRequest extends Request {
  user?: { id: string };
}

export const listAdminOrdersEndpoint = async (_req: AuthRequest, res: Response) => {
  try {
    const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } , include : { user : true, Address : true , delivery : true , statusHistory : true} });
    return res.status(200).json({ orders ,success : true});
  } catch (error: any) {
    return res.status(400).json({ message: error.message ?? "Failed to fetch orders" , success : false});
  }
};

export const getAdminOrderEndpoint = async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.findUnique({ where: { id: req.params.id as string } , include : { Address : true , user : true , delivery : true , items : {include : {
      variant : {
        include : {
          product : true
        }
      }
    }} , payment : true }  });
    return res.status(200).json({ order,success : true });
  } catch (error: any) {
    return res.status(400).json({ message: error.message ?? "Failed to fetch order" ,success : false});
  }
};

export const updateAdminOrderStatusEndpoint = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const orderId = req.params.id as string;
    const status = req.body?.status;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    if (!orderId) {
      return res.status(400).json({ message: "Order id is required", success: false });
    }

    if (!status) {
      return res.status(400).json({ message: "Order status is required", success: false });
    }

    const order = await updateAdminOrderStatus(userId, orderId, status);
    return res.status(200).json({ order, success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update order status";
    return res.status(400).json({ message, success: false });
  }
};
