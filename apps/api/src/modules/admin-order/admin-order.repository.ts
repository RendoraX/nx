import { prisma } from "../../../../../packages/database/src/client";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PACKED"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export async function findById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: { payment: true },
  });
}

export async function updateStatus(id: string, status: OrderStatus) {
  const normalizedStatus = status.toUpperCase();

  return prisma.$transaction(async (tx: any) => {
    const existingOrder = await tx.order.findUnique({
      where: { id },
      include: { payment: true },
    });

    if (!existingOrder) throw new Error("Order not found");

    const updatedOrder = await tx.order.update({
      where: { id },
      data: { status: normalizedStatus as any },
    });

    if (existingOrder.payment) {
      if (normalizedStatus === "DELIVERED") {
        await tx.payment.update({
          where: { id: existingOrder.payment.id },
          data: { status: "SUCCESS" as any },
        });
      } else if (normalizedStatus === "CANCELLED") {
        await tx.payment.update({
          where: { id: existingOrder.payment.id },
          data: { status: "FAILED" as any },
        });
      }
    }

    await tx.orderStatusHistory.create({
      data: {
        orderId: id,
        status: normalizedStatus as any,
        note: `Order status updated to ${normalizedStatus}`,
      },
    });

    return updatedOrder;
  });
}