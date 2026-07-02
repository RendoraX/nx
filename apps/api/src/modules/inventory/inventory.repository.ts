import { prisma } from "../../../../../packages/database/src/client";
import type { Inventory } from "@prisma/client";

export async function findInventory(productId: string) {
  return prisma.inventory.findUnique({ where: { productId } });
}

export async function updateStock(productId: string, stock: number) {
  return prisma.inventory.upsert({
    where: { productId },
    update: { stock },
    create: { productId, stock, reserved: 0 },
  });
}

export async function increaseStock(productId: string, amount: number) {
  return prisma.inventory.upsert({
    where: { productId },
    update: { stock: { increment: amount } },
    create: { productId, stock: amount, reserved: 0 },
  });
}

export async function decreaseStock(productId: string, amount: number) {
  const inv = await prisma.inventory.findUnique({ where: { productId } });
  if (!inv || inv.stock < amount) {
    throw new Error("Insufficient stock");
  }

  return prisma.inventory.update({
    where: { productId },
    data: { stock: { decrement: amount } },
  });
}

export async function reserveStock(productId: string, amount: number) {
  return prisma.$transaction(async (tx) => {
    const inv = await tx.inventory.findUnique({ where: { productId } });
    if (!inv || inv.stock < amount) throw new Error("Insufficient stock to reserve");

    await tx.inventory.update({
      where: { productId },
      data: {
        stock: { decrement: amount },
        reserved: { increment: amount },
      },
    });

    return tx.inventory.findUnique({ where: { productId } });
  });
}

export async function releaseStock(productId: string, amount: number) {
  return prisma.$transaction(async (tx) => {
    const inv = await tx.inventory.findUnique({ where: { productId } });
    if (!inv || inv.reserved < amount) throw new Error("Reserved amount less than release amount");

    await tx.inventory.update({
      where: { productId },
      data: {
        stock: { increment: amount },
        reserved: { decrement: amount },
      },
    });

    return tx.inventory.findUnique({ where: { productId } });
  });
}
