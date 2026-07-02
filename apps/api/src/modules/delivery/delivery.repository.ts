import { prisma } from "../../../../../packages/database/src/client";

//completed  
export async function getAssignedDeliveries(deliveryBoyId: string) {
  return prisma.deliveryAssignment.findMany({
    where: { deliveryBoyId },
    include: { order: true },
  });
}


//completed
export async function findAssignmentByOrderId(orderId: string) {
  return prisma.deliveryAssignment.findUnique({ where: { orderId } });
}

//completed
export async function assignDelivery(orderId: string, deliveryBoyId: string) {
  return prisma.deliveryAssignment.upsert({
    where: { orderId },
    update: { deliveryBoyId },
    create: { orderId, deliveryBoyId },
  });
}

//completed
export async function updateAssignment(id: string, data: any) {
  return prisma.deliveryAssignment.update({ where: { id }, data });
}
