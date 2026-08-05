import type { Request, Response } from "express";
import { cancelUserOrder, createOrderForUser, getOrderById, getOrdersForUser, updateOrderStatus } from "./orders.service";

interface AuthRequest extends Request {
  user?: { id: string };
}

export const createOrderEndpoint = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const order = await createOrderForUser(userId, await req.body);
    return res.status(201).json({ message: "Order created", order , success : true});
  } catch (error: any) {
    console.log(error.message)
    return res.status(400).json({ message: error.message ?? "Failed to create order" , success : false });
  }
};

export const listOrdersEndpoint = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const orders = await getOrdersForUser(userId);
    return res.status(200).json({ orders });
  } catch (error: any) {
    return res.status(400).json({ message: error.message ?? "Failed to fetch orders" });
  }
};

export const getOrderEndpoint = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const order = await getOrderById(userId, req.params.id as string);
    return res.status(200).json({ order  , message  : "Order with id fetched !!" , success : true});
  } catch (error: any) {
    return res.status(400).json({ message: error.message ?? "Failed to fetch order"  , error : error.message || error , success : false});
  }
};

export const cancelOrderEndpoint = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const order = await cancelUserOrder(userId, req.params.id as string);
    return res.status(200).json({ message: "Order cancelled", order });
  } catch (error: any) {
    return res.status(400).json({ message: error.message ?? "Failed to cancel order" });
  }
};
