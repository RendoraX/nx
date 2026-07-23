import { createAuditLog } from "../../lib/audit";
import * as repo from "./inventory.repository";
import type { BulkInventoryUpdate, updateInventory } from "./inventory.types";

export async function increaseStock(inventoryId: string, amount: number) {
  if (amount <= 0) throw new Error("Amount must be positive");
  return repo.increaseStock(inventoryId, amount);
}

export async function decreaseStock(inventoryId: string, amount: number) {
  amount *= -1;
  if (amount <= 0) throw new Error("Amount must be positive");
  return repo.decreaseStock(inventoryId, amount);
}

export async function reserveStock(inventoryId: string, amount: number) {
  if (amount <= 0) throw new Error("Amount must be positive");
  return repo.reserveStock(inventoryId, amount);
}

export async function releaseStock(inventoryId: string, amount: number) {
  if (amount <= 0) throw new Error("Amount must be positive");
  return repo.releaseStock(inventoryId, amount);
}

export async function getInventory(inventoryId: string) {
  return repo.findInventory(inventoryId);
}

export async function getAllInventory() {
  return repo.getAllInventory();
}

export async function getInventorySummarySer() {
  return repo.getInventorySummary();
};

export async function updateInventory(payload : updateInventory) {
  let updatedInventory;

  if (payload.direction === "add") {
    updatedInventory = await increaseStock(payload.inventoryId, payload.quantity);
  } else if (payload.direction === "remove") {
    updatedInventory = await decreaseStock(payload.inventoryId, payload.quantity);
  }

  await createAuditLog(null, payload.type as string, "inventory", payload.inventoryId, {
    ...payload,
    updatedStock: updatedInventory?.stock ?? null,
  });

  return updatedInventory;
}

export async function inventoryHistory(){
  return await repo.getInventoryHistory();
}

export async function bulkUpdateInventory(payload: BulkInventoryUpdate) {
  const adjustments = [] as Array<{ inventoryId: string; updatedStock: number | null }>;

  for (const inventoryId of payload.inventoryIds) {
    const action = payload.quantity >= 0 ? "add" : "remove";
    const amount = Math.abs(payload.quantity);
    const updatedInventory = action === "add"
      ? await increaseStock(inventoryId, amount)
      : await decreaseStock(inventoryId, amount);

    await createAuditLog(null, payload.type as string, "inventory", inventoryId, {
      reason: payload.reason,
      notes: payload.notes,
      direction: action,
      quantity: amount,
      updatedStock: updatedInventory?.stock ?? null,
    });

    adjustments.push({ inventoryId, updatedStock: updatedInventory?.stock ?? null });
  }

  return { adjustedCount: adjustments.length, adjustments };
}