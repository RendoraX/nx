import { findCoupon, incrementUsage } from "./coupons.repository";
import { validateCouponSchema } from "./coupons.schema";
import type { CouponRule, ValidateCouponDTO } from "./coupons.types";

export function calculateDiscount(coupon: Partial<CouponRule>, subtotal: number) {
  if (coupon.fixedAmount != null && coupon.fixedAmount > 0) {
    const discount = Math.min(coupon.fixedAmount, subtotal);
    return { discount, total: subtotal - discount };
  }

  if (coupon.percentage != null && coupon.percentage > 0) {
    const discount = subtotal * (coupon.percentage / 100);
    return { discount, total: subtotal - discount };
  }

  return { discount: 0, total: subtotal };
}

export async function validateCoupon(payload: ValidateCouponDTO | CouponRule, subtotal: number) {
  const data = validateCouponSchema.parse({ code: payload.code, subtotal });
  const coupon = await findCoupon(data.code);

  if (!coupon) {
    throw new Error("Coupon not found");
  }

  const now = new Date();
  if (coupon.startsAt > now || coupon.expiresAt < now) {
    throw new Error("Coupon is expired or not active yet");
  }

  if (coupon.usageLimit != null && coupon.usageLimit <= 0) {
    throw new Error("Coupon usage limit reached");
  }

  if (data.subtotal < 0) {
    throw new Error("Subtotal must be 0 or greater");
  }

  const result = calculateDiscount(coupon as CouponRule, data.subtotal);
  await incrementUsage(coupon.id);

  return {
    ...result,
    coupon: {
      id: coupon.id,
      code: coupon.code,
      percentage: coupon.percentage,
      fixedAmount: coupon.fixedAmount,
    },
  };
}
