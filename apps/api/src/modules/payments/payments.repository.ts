import { prisma } from "../../../../../packages/database/src/client";

//completed
export async function findPaymentByOrderId(orderId: string) {
  return prisma.payment.findUnique({ where: { orderId } });
}


//completed 
export async function createPayment(data: any) {
  return prisma.payment.create({ data });
}


//completed
export async function updatePaymentStatus(orderId: string, status: string, transactionId?: string | null) {
  return prisma.payment.update({
    where: { orderId },
    data: { status: status as any, transactionId: transactionId ?? undefined },
  });
}

//completed
export async function findPaymentById(id: string) {
  return prisma.payment.findUnique({ where: { id } });
}
