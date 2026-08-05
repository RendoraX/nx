'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartService } from '@/services/cart.service';

export interface Variant {
  id: string;
  title: string;
  sku: string;
  price: number;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
}

export interface CartProduct {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category: string;
  images: ProductImage[];
}

export interface Inventory {
  stock: number;
}

export interface CartItem {
  id: string;
  quantity: number;
  lineTotal: number;
  variant: Variant;
  product: CartProduct;
  inventory: Inventory;
}

export interface CartResponse {
  id: string;
  userId: string;
  itemCount: number;
  totalUniqueItems: number;
  subtotal: number;
  items: CartItem[];
}

interface CartContextType {
  cart: CartResponse | null;
  loading: boolean;
  error: string | null;
  addingToCart: boolean;
  refreshCart: () => Promise<void>;
  addToCart: (variantId: string, quantity?: number) => Promise<CartResponse>;
  updateQuantity: (itemId: string, quantity: number) => Promise<CartResponse>;
  removeFromCart: (itemId: string) => Promise<CartResponse>;
  clearCart: () => Promise<CartResponse>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [addingToCart, setAddingToCart] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refreshCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await CartService.getCart();
      setCart(data as unknown as CartResponse);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch cart.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (variantId: string, quantity: number = 1) => {
    try {
      setAddingToCart(true);
      setError(null);
      const updatedCart = await CartService.addToCart({ variantId, quantity });
      const cartData = updatedCart as unknown as CartResponse;
      setCart(cartData);
      return cartData;
    } catch (err: any) {
      setError(err?.message || 'Could not add item to cart.');
      throw err;
    } finally {
      setAddingToCart(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      setError(null);
      // Optimistic update
      setCart((prev) => {
        if (!prev) return null;
        const updatedItems = prev.items.map((item) => {
          if (item.id === itemId) {
            const unitPrice = item.variant?.price || 0;
            return { ...item, quantity, lineTotal: unitPrice * quantity };
          }
          return item;
        });
        const newSubtotal = updatedItems.reduce((acc, item) => acc + item.lineTotal, 0);
        const newItemCount = updatedItems.reduce((acc, item) => acc + item.quantity, 0);
        return { ...prev, items: updatedItems, subtotal: newSubtotal, itemCount: newItemCount };
      });

      const updatedCart = await CartService.updateQuantity({ itemId, quantity });
      const cartData = updatedCart as unknown as CartResponse;
      setCart(cartData);
      return cartData;
    } catch (err: any) {
      setError(err?.message || 'Could not update quantity.');
      refreshCart();
      throw err;
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      setError(null);
      // Optimistic update
      setCart((prev) => {
        if (!prev) return null;
        const updatedItems = prev.items.filter((item) => item.id !== itemId);
        const newSubtotal = updatedItems.reduce((acc, item) => acc + item.lineTotal, 0);
        const newItemCount = updatedItems.reduce((acc, item) => acc + item.quantity, 0);
        return { ...prev, items: updatedItems, subtotal: newSubtotal, itemCount: newItemCount, totalUniqueItems: updatedItems.length };
      });

      const updatedCart = await CartService.removeFromCart(itemId);
      const cartData = updatedCart as unknown as CartResponse;
      setCart(cartData);
      return cartData;
    } catch (err: any) {
      setError(err?.message || 'Could not remove item.');
      refreshCart();
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      setError(null);
      setCart((prev) => prev ? { ...prev, items: [], subtotal: 0, itemCount: 0, totalUniqueItems: 0 } : null);
      const updatedCart = await CartService.clearCart();
      const cartData = updatedCart as unknown as CartResponse;
      setCart(cartData);
      return cartData;
    } catch (err: any) {
      setError(err?.message || 'Could not clear cart.');
      refreshCart();
      throw err;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        addingToCart,
        refreshCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}