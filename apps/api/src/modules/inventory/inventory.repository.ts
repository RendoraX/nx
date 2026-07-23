import { prisma } from "../../../../../packages/database/src/client";

export async function findInventory(inventoryId: string) {
  return prisma.inventory.findUnique({
    where: { id: inventoryId },
    include: { variant: true },
  });
}

export async function updateStock(inventoryId: string, stock: number) {
  return prisma.inventory.update({
    where: { id: inventoryId },
    data: { stock },
  });
}

export async function increaseStock(inventoryId: string, amount: number) {
  return prisma.inventory.update({
    where: { id: inventoryId },
    data: { stock: { increment: amount } },
  });
}

export async function decreaseStock(inventoryId: string, amount: number) {
  const inv = await prisma.inventory.findUnique({ where: { id: inventoryId } });
  if (!inv || inv.stock < amount) {
    throw new Error("Insufficient stock");
  }

  return prisma.inventory.update({
    where: { id: inventoryId },
    data: { stock: { decrement: amount } },
  });
}

export async function reserveStock(inventoryId: string, amount: number) {
  return prisma.$transaction(async (tx) => {
    const inv = await tx.inventory.findUnique({ where: { id: inventoryId } });
    if (!inv || inv.stock < amount) throw new Error("Insufficient stock to reserve");

    await tx.inventory.update({
      where: { id: inventoryId },
      data: {
        stock: { decrement: amount },
        reserved: { increment: amount },
      },
    });

    return tx.inventory.findUnique({ where: { id: inventoryId } });
  });
}

export async function releaseStock(inventoryId: string, amount: number) {
  return prisma.$transaction(async (tx) => {
    const inv = await tx.inventory.findUnique({ where: { id: inventoryId } });
    if (!inv || inv.reserved < amount) throw new Error("Reserved amount less than release amount");

    await tx.inventory.update({
      where: { id: inventoryId },
      data: {
        stock: { increment: amount },
        reserved: { decrement: amount },
      },
    });

    return tx.inventory.findUnique({ where: { id: inventoryId } });
  });
}

export async function getAllInventory() {
  return prisma.inventory.findMany({
    include: {
      variant: {
        include: {
          product: {
            include: {
              category: true,
              images: true,
            },
          },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getInventorySummary() {
  return prisma.$transaction(async (tx) => {
    const totalHealthyCount = await tx.inventory.count({
      where: {
        stock: {
          gte: 10,
        },
      },
    });

    const lowStockAlert = await tx.inventory.count({
      where: {
        stock: {
          lt: 20,
          gte: 10,
        },
      },
    });

    const outOfStock = await tx.inventory.count({
      where: {
        stock: {
          equals: 0,
        },
      },
    });

    const totalProducts = await tx.inventory.count();

    return {
      totalHealthyCount,
      lowStockAlert,
      outOfStock,
      totalProducts,
    };
  });
}

export async function getInventoryHistory() {
  return prisma.auditLog.findMany({
    where: {
      entity: "inventory",
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}