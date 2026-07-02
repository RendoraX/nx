import type { Request, Response } from "express";
import { validateCoupon } from "./coupons.service";

export const validateCouponEndpoint = async (req: Request, res: Response) => {
  try {
    const result = await validateCoupon(req.body, req.body.subtotal ?? 0);
    return res.status(200).json({ message: "Coupon validated", ...result });
  } catch (error: any) {
    return res.status(400).json({ message: error.message ?? "Failed to validate coupon" });
  }
};
