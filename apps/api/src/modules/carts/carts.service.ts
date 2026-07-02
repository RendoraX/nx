import { findInventory } from "../inventory/inventory.repository";
import { findById as findProductById } from "../products/products.repository";
import {
  addItem,
  clearCart,
  createCart,
  findCartByUser,
  findCartItem,
  findCartItemById,
  removeItem,
  updateItem,
} from "./carts.repository";
import { addToCartSchema, removeItemSchema, updateQuantitySchema } from "./carts.schema";
import type { AddToCartDTO, RemoveCartItemDTO, UpdateCartItemDTO } from "./carts.types";

function toCartResponse(cart: any) {
  const items = (cart?.items ?? []).map((item: any) => ({
    id: item.id,
    productId: item.productId,
    quantity: item.quantity,
    product: item.product,
    lineTotal: Number(item.product?.price ?? 0) * item.quantity,
  }));

  const subtotal = items.reduce((sum: number, item: any) => sum + item.lineTotal, 0);

  return {
    id: cart?.id ?? null,
    userId: cart?.userId ?? null,
    items,
    itemCount: items.length,
    subtotal: Number(subtotal.toFixed(2)),
  };
}

export async function getCart(userId: string) {
  const cart = await findCartByUser(userId);
  return toCartResponse(cart);
}

export async function addItemToCart(userId: string, payload: AddToCartDTO) {
  const data = addToCartSchema.parse(payload);
  const product = await findProductById(data.productId);

  if (!product) {
    throw new Error("Product not found");
  }

  const inventory = await findInventory(data.productId);
  if (!inventory || inventory.stock < data.quantity) {
    throw new Error("Insufficient stock");
  }

  let cart = await findCartByUser(userId);
  if (!cart) {
    cart = await createCart(userId) as any;
  }

  const existingItem = await findCartItem((cart as any).id, data.productId);
  const requestedQuantity = existingItem ? existingItem.quantity + data.quantity : data.quantity;

  if (inventory.stock < requestedQuantity) {
    throw new Error("Insufficient stock for the requested quantity");
  }

  if (existingItem) {
    await updateItem(existingItem.id, requestedQuantity);
  } else {
    await addItem((cart as any).id, data.productId, data.quantity);
  }

  return getCart(userId);
}

export async function updateCartItemQuantity(userId: string, itemId: string, payload: UpdateCartItemDTO) {
  const data = updateQuantitySchema.parse(payload);
  const item = await findCartItemById(itemId);

  if (!item) {
    throw new Error("Cart item not found");
  }

  const cart = await findCartByUser(userId);
  if (!cart || !cart.items.some((cartItem: any) => cartItem.id === item.id)) {
    throw new Error("Cart item does not belong to this user");
  }

  const inventory = await findInventory(item.productId);
  if (!inventory || inventory.stock < data.quantity) {
    throw new Error("Insufficient stock");
  }

  await updateItem(item.id, data.quantity);
  return getCart(userId);
}

export async function removeItemFromCart(userId: string, payload: RemoveCartItemDTO) {
  const data = removeItemSchema.parse(payload);
  const item = await findCartItemById(data.itemId);

  if (!item) {
    throw new Error("Cart item not found");
  }

  const cart = await findCartByUser(userId);
  if (!cart || !cart.items.some((cartItem: any) => cartItem.id === item.id)) {
    throw new Error("Cart item does not belong to this user");
  }

  await removeItem(item.id);
  return getCart(userId);
}

export async function clearUserCart(userId: string) {
  const cart = await findCartByUser(userId);
  if (!cart) {
    return { message: "Cart already empty" };
  }

  await clearCart(cart.id);
  return { message: "Cart cleared" };
}
