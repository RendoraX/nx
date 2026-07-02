import * as repo from "./inventory.repository";

export async function increaseStock(productId: string, amount: number) {
  if (amount <= 0) throw new Error("Amount must be positive");
  return repo.increaseStock(productId, amount);
}

export async function decreaseStock(productId: string, amount: number) {
  if (amount <= 0) throw new Error("Amount must be positive");
  return repo.decreaseStock(productId, amount);
}

export async function reserveStock(productId: string, amount: number) {
  if (amount <= 0) throw new Error("Amount must be positive");
  return repo.reserveStock(productId, amount);
}

export async function releaseStock(productId: string, amount: number) {
  if (amount <= 0) throw new Error("Amount must be positive");
  return repo.releaseStock(productId, amount);
}

export async function getInventory(productId: string) {
  return repo.findInventory(productId);
}
