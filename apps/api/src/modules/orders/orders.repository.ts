import { prisma } from "../../../../../packages/database/src/client";

export async function createOrder(data: any) {
  return prisma.order.create({ data });
}

export async function findById(id: string) {
  return prisma.order.findUnique({ where: { id } });
}

export async function findByUser(userId: string) {
  return prisma.order.findMany({ where: { userId } });
}

export async function updateStatus(id: string, status: string) {
  return prisma.order.update({ where: { id }, data: { status: status as any } });
}

export async function cancelOrder(id: string) {
  return prisma.order.update({ where: { id }, data: { status: "CANCELLED" as any } });
}
