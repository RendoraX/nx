import { prisma } from "../../../../packages/database/src/client";

export async function createAuditLog(
  userId: string | null | undefined,
  action: string,
  entity: string,
  entityId?: string | null,
  metadata?: Record<string, unknown>,
) {
  return prisma.auditLog.create({
    data: {
      userId: userId ?? null,
      action,
      entity,
      entityId: entityId ?? null,
      metadata: metadata as any,
    },
  });
}
