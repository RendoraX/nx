import { prisma } from "../../../../../packages/database/src/client";

export async function findCartByUser(userId: string) {
  return prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
}

export async function createCart(userId: string) {
  return prisma.cart.create({
    data: { userId },
  });
}

export async function findCartItem(cartId: string, productId: string) {
  return prisma.cartItem.findFirst({
    where: { cartId, productId },
  });
}

export async function findCartItemById(itemId: string) {
  return prisma.cartItem.findUnique({
    where: { id: itemId },
  });
}

export async function addItem(cartId: string, productId: string, quantity: number) {
  return prisma.cartItem.create({
    data: {
      cartId,
      productId,
      quantity,
    },
  });
}

export async function updateItem(itemId: string, quantity: number) {
  return prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
  });
}

export async function removeItem(itemId: string) {
  return prisma.cartItem.delete({
    where: { id: itemId },
  });
}

export async function clearCart(cartId: string) {
  return prisma.cartItem.deleteMany({
    where: { cartId },
  });
}
