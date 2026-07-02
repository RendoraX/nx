import { prisma } from "../../../../../packages/database/src/client";

export async function findCoupon(code: string) {
  return prisma.coupon.findUnique({ where: { code } });
}

export async function incrementUsage(couponId: string) {
  return prisma.coupon.update({
    where: { id: couponId },
    data: { usageLimit: { decrement: 1 } },
  });
}

export async function decrementUsage(couponId: string) {
  return prisma.coupon.update({
    where: { id: couponId },
    data: { usageLimit: { increment: 1 } },
  });
}
