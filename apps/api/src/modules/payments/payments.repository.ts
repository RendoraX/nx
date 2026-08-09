import { prisma } from "../../../../../packages/database/src/client";

//completed
export async function findPaymentByOrderId(orderId: string) {
  return prisma.payment.findUnique({ where: { orderId } });
}

export async function findPaymentByTransactionId(transactionId: string) {
  return prisma.payment.findFirst({ where: { transactionId } });
}

//completed 
export async function createPayment(data: any) {
  return prisma.payment.create({ data });
}


//completed
export async function updatePayment(id: string, data: { status?: string; transactionId?: string | null }) {
  return prisma.payment.update({
    where: { id },
    data: {
      ...(data.status && { status: data.status as any }),
      ...(data.transactionId !== undefined && { transactionId: data.transactionId }),
    },
  });
}

//completed
export async function findPaymentById(id: string) {
  return prisma.payment.findUnique({ where: { id } });
}
