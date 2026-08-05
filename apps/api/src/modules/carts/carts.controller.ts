import type { Request, Response } from "express";
import {
  addItemToCart,
  clearUserCart,
  getCart,
  removeItemFromCart,
  updateCartItemQuantity,
} from "./carts.service";

interface AuthRequest extends Request {
  user?: {
    id: string;
    identifier?: string;
  };
}

export const getCartEndpoint = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const cart = await getCart(userId);
    return res.status(200).json({ message: "Cart fetched successfully", cart , success : true});
  } catch (error: any) {
    return res.status(400).json({ message: error.message ?? "Failed to fetch cart" , success : false});
  }
};

export const addToCartEndpoint = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const cart = await addItemToCart(userId, await req.body);
    return res.status(200).json({ message: "Item added to cart", cart , success : true});
  } catch (error: any) {
    console.log(error.message)
    return res.status(400).json({ message: error.message ?? "Failed to add item to cart"  ,  success : false});
  }
};

export const updateCartItemEndpoint = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const cart = await updateCartItemQuantity(userId, req.params.id as string, req.body);
    return res.status(200).json({ message: "Cart item updated", cart  , success : true});
  } catch (error: any) {
    console.log(error.message)
    return res.status(400).json({ message: error.message ?? "Failed to update cart item"  , success : false});
  }
};

export const removeCartItemEndpoint = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const cart = await removeItemFromCart(userId, { itemId: req.params.id as string });
    return res.status(200).json({ message: "Cart item removed", cart  , success : true});
  } catch (error: any) {
    return res.status(400).json({ message: error.message ?? "Failed to remove cart item" , success : false });
  }
};

export const clearCartEndpoint = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const response = await clearUserCart(userId);
    return res.status(200).json({
      ...response,
      success : true
    });
  } catch (error: any) {
    return res.status(400).json({ message: error.message ?? "Failed to clear cart" , success : false});
  }
};
