import { prisma } from "../../../../../packages/database/src/client";

export async function findCartByUser(userId: string) {
  return prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          variant: {
            include: {
              inventory: true,
              product: {
                include: {
                  images: {
                    orderBy: {
                      position: "asc",
                    },
                  },
                  category: true,
                },
              },
            },
          },
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

export async function findCartItem(cartId: string, variantId: string) {
  return prisma.cartItem.findFirst({
    where: { cartId, variantId},
  });
}

export async function findCartItemById(itemId: string) {
  return prisma.cartItem.findUnique({
    where: { id: itemId },
  });
}

export async function addItem(cartId: string,     variantId: string, quantity: number) {
  return prisma.cartItem.create({
    data: {
      cartId,
      variantId,
      quantity
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
