import { findInventory, findInventoryByVariantId } from "../inventory/inventory.repository";
import { findById as findProductById, findProductByVarId } from "../products/products.repository";
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
  const items = (cart?.items ?? []).map((item: any) => {
    const variant = item.variant;
    const product = variant.product;

    const unitPrice = Number(variant.price);

    return {
      id: item.id,

      quantity: item.quantity,

      lineTotal: Number((unitPrice * item.quantity).toFixed(2)),

      variant: {
        id: variant.id,
        title: variant.title,
        sku: variant.sku,
        price: unitPrice,
      },

      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        category: product.category?.name,

        images: product.images.map((image: any) => ({
          id: image.id,
          url: image.url,
          alt: image.alt,
        })),
      },

      inventory: {
        stock: variant.inventory?.stock ?? 0,
      },
    };
  });

  const subtotal = items.reduce(
    (sum: number, item: any) => sum + item.lineTotal,
    0
  );

  return {
    id: cart?.id,
    userId: cart?.userId,

    itemCount: items.reduce(
      (sum: number, item: any) => sum + item.quantity,
      0
    ),

    totalUniqueItems: items.length,

    subtotal: Number(subtotal.toFixed(2)),

    items,
  };
}

export async function getCart(userId: string) {
  const cart = await findCartByUser(userId);
  return toCartResponse(cart);
}

export async function addItemToCart(userId: string, payload: AddToCartDTO) {
  const data = addToCartSchema.parse(payload);
  const product = await findProductByVarId(data.variantId);

  if (!product) {
    throw new Error("Product not found");
  }

  
  const inventory = await findInventory(product.product.inventoryId as string);
  if (!inventory || inventory.stock < data.quantity) {
    throw new Error("Insufficient stock");
  }

  let cart = await findCartByUser(userId);
  if (!cart) {
    cart = await createCart(userId) as any;
  }

  const existingItem = await findCartItem((cart as any).id, product.id);
  const requestedQuantity = existingItem ? existingItem.quantity + data.quantity : data.quantity;

  if (inventory.stock < requestedQuantity) {
    throw new Error("Insufficient stock for the requested quantity");
  }

  if (existingItem) {
    await updateItem(existingItem.id, requestedQuantity);
  } else {
    await addItem((cart as any).id, product.id, data.quantity);
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


  const inventory = await findInventoryByVariantId(item.variantId);
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
