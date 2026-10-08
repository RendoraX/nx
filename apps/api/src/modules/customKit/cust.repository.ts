import type { Prisma } from "../../../../../packages/database/generated/client/client";
import type { PricedCustomKitOrderItem, PaymentMethod } from "./cust.types";

export async function getCustomKitById(
  id: string,
  tx: Prisma.TransactionClient,
) {
  return tx.ritualTemplate.findUnique({
    where: { id },
    include: {
      defaultItems: {
        include: {
          variant: true,
          product: {
            include: {
              variants: { include: { inventory: true } },
            },
          },
        },
      },
    },
  });
}

export async function createKitOrder(
  data: {
    userId: string;
    addressId: string;
    kitName: string;
    kitSlug: string;
    kitBasePrice: number;
    subtotal: number;
    totalAmount: number;
    paymentMethod: PaymentMethod;
    items: PricedCustomKitOrderItem[];
  },
  tx: Prisma.TransactionClient,
) {
  return tx.order.create({
    data: {
      userId: data.userId,
      addressId: data.addressId,
      type: "KIT",
      kitName: data.kitName,
      kitSlug: data.kitSlug,
      kitBasePrice: data.kitBasePrice,
      subtotal: data.subtotal,
      shippingAmount: 0,
      totalAmount: data.totalAmount,
      status: "PENDING",
      items: {
        create: data.items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
      payment: {
        create: {
          status: "PENDING",
          amount: data.totalAmount,
          provider: data.paymentMethod === "COD" ? "COD" : "RAZORPAY",
        },
      },
      statusHistory: {
        create: {
          status: "PENDING",
          note: `Custom kit order created for ${data.kitName}.`,
        },
      },
    },
    include: {
      Address: true,
      items: {
        include: {
          variant: { include: { product: true, inventory: true } },
        },
      },
      payment: true,
    },
  });
}
