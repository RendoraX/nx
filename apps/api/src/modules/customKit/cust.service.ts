import { prisma } from "../../../../../packages/database/src/client";
import { custOrderScheme } from "./cust.schema";
import { createKitOrder, getCustomKitById } from "./cust.repository";
import type { CreateCustomKitOrder, PricedCustomKitOrderItem } from "./cust.types";

export async function placeKitOrder(payload: CreateCustomKitOrder, userId: string) {
  const data = custOrderScheme.parse(payload);

  return prisma.$transaction(async (tx) => {
    const [address, kit] = await Promise.all([
      tx.address.findFirst({
        where: { id: data.addressId, userId, isDeleted: false },
        select: { id: true },
      }),
      getCustomKitById(data.kitId, tx),
    ]);

    if (!address) {
      throw new Error("Selected delivery address does not belong to this account.");
    }
    if (!kit || !kit.isActive) {
      throw new Error("This custom kit is not available for ordering.");
    }

    const orderItems: PricedCustomKitOrderItem[] = [];
    for (const requestedItem of data.items) {
      const allowedTemplateItem = kit.defaultItems.find(
        (templateItem) =>
          templateItem.productId === requestedItem.productId &&
          (!templateItem.variantId || templateItem.variantId === requestedItem.variantId),
      );
      if (!allowedTemplateItem) {
        throw new Error("The selected product or variant is not part of this kit.");
      }

      const variant = allowedTemplateItem.product.variants.find(
        (productVariant) => productVariant.id === requestedItem.variantId,
      );
      if (!variant || !variant.inventory || !allowedTemplateItem.product.isActive) {
        throw new Error(`The selected variant for "${allowedTemplateItem.product.name}" is unavailable.`);
      }

      const reserved = await tx.inventory.updateMany({
        where: {
          id: variant.inventory.id,
          stock: { gte: requestedItem.quantity },
        },
        data: {
          stock: { decrement: requestedItem.quantity },
          reserved: { increment: requestedItem.quantity },
        },
      });
      if (reserved.count !== 1) {
        throw new Error(`Insufficient stock for "${allowedTemplateItem.product.name}".`);
      }

      orderItems.push({
        ...requestedItem,
        price: Number(variant.price),
      });
    }

    const kitBasePrice = Number(kit.baseBoxPrice);
    let includedQuantity = kit.isManualPrice ? 0 : 1;
    const itemTotal = orderItems.reduce((total, item) => {
      const included = Math.min(includedQuantity, item.quantity);
      includedQuantity -= included;
      return total + (item.quantity - included) * item.price;
    }, 0);
    const subtotal = kit.isManualPrice ? kitBasePrice : kitBasePrice + itemTotal;

    return createKitOrder(
      {
        userId,
        addressId: data.addressId,
        kitName: kit.name,
        kitSlug: kit.slug,
        kitBasePrice,
        subtotal,
        totalAmount: subtotal,
        paymentMethod: data.paymentMethod,
        items: orderItems,
      },
      tx,
    );
  });
}