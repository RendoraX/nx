import { prisma } from "../../../../../packages/database/src/client";

export async function createOrder(data: {
  userId: string;
  addressId: string;
  subtotal: number;
  shippingAmount: number;
  totalAmount: number;
  paymentMethod?: string;
  items: Array<{
    productId: string;
    variantId: string | null;
    quantity: number;
    price: number;
  }>;
}, tx?: any) {

  return prisma.order.create({
    data: {
      userId: data.userId,
      addressId: data.addressId,
      subtotal: data.subtotal,
      shippingAmount: data.shippingAmount,
      totalAmount: data.totalAmount,
      status: "PENDING",
      items: {
        createMany : {
          data : data.items as any
        }
      },
      payment: {
        create: {
          status: "PENDING",
          amount: data.totalAmount,
          provider : data.paymentMethod === "COD" ? "COD" : "RAZORPAY" as any,
        },
      },
      statusHistory: {
        create: {
          status: "PENDING",
          note: "Order created and stock reserved successfully.",
        },
      },
    },
    include: {
      items: true,
      payment: true,
      Address: true,
    },
  });
}

export async function findById(id: string) {
  return prisma.order.findUnique({ where: { id },
    include : {
      Address : true,
      items : {
        include : {
          variant : {
            include : {
              product : true,
              inventory : true
            }
          }
        }
      },
      payment : true
    }
  });
}

export async function findByUser(userId: string) {
  return prisma.order.findMany({ where: { userId } });
}

export async function deleteOrderCascade(id: string) {
  return prisma.$transaction(async (tx: any) => {
    await tx.orderStatusHistory.deleteMany({ where: { orderId: id } });
    await tx.deliveryAssignment.deleteMany({ where: { orderId: id } });
    await tx.payment.deleteMany({ where: { orderId: id } });
    await tx.orderItem.deleteMany({ where: { orderId: id } });
    return tx.order.delete({ where: { id } });
  });
}

async function syncOrderLifecycle(id: string, status: string, note?: string, tx?: any) {
  const db = tx ?? prisma;
  const normalizedStatus = status.toUpperCase();

  const existingOrder = await db.order.findUnique({
    where: { id },
    include: { payment: true },
  });

  if (!existingOrder) throw new Error("Order not found");

  const updatedOrder = await db.order.update({
    where: { id },
    data: { status: normalizedStatus as any },
  });

  if (existingOrder.payment) {
    if (normalizedStatus === "DELIVERED") {
      await db.payment.update({
        where: { id: existingOrder.payment.id },
        data: { status: "SUCCESS" as any },
      });
    } else if (normalizedStatus === "CANCELLED") {
      await db.payment.update({
        where: { id: existingOrder.payment.id },
        data: { status: "FAILED" as any },
      });
    }
  }

  await db.orderStatusHistory.create({
    data: {
      orderId: id,
      status: normalizedStatus as any,
      note: note ?? `Order status updated to ${normalizedStatus}`,
    },
  });

  return updatedOrder;
}

export async function updateStatus(id: string, status: string) {
  return prisma.$transaction(async (tx: any) => syncOrderLifecycle(id, status, undefined, tx));
}

export async function cancelOrder(id: string) {
  return prisma.$transaction(async (tx: any) => syncOrderLifecycle(id, "CANCELLED", "Order cancelled", tx));
}
