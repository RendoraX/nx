'use client';

import { useState, useEffect, useCallback } from 'react';
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

export interface AddToCartDTO {
  variantId: string;
  quantity: number;
}

export interface UpdateCartItemDTO {
  itemId: string;
  quantity: number;
}

// Global Custom Event Key to sync instances across the application
const CART_UPDATED_EVENT = 'app_cart_updated_event';

/**
 * Helper to dispatch a global event to notify all `useCart` hook instances to re-sync
 */
export const notifyCartUpdated = (updatedCart?: CartResponse | null) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(CART_UPDATED_EVENT, { detail: updatedCart })
    );
  }
};

export function useCart() {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState<boolean>(false);

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

  const clearCart = useCallback(async () => {
    try {
      setIsClearing(true);
      setError(null);
      const updatedCart = await CartService.clearCart();
      const cartData =
        updatedCart && typeof updatedCart === 'object' && 'items' in updatedCart
          ? (updatedCart as unknown as CartResponse)
          : {
              id: '',
              userId: '',
              itemCount: 0,
              totalUniqueItems: 0,
              subtotal: 0,
              items: [],
            };

      setCart(cartData);
      notifyCartUpdated(cartData);
    } catch (err: any) {
      setError(err?.message || 'Could not clear cart.');
    } finally {
      setIsClearing(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();

    // Listen for cart mutations dispatched from useAddToCart / useUpdateCartItem / useRemoveFromCart
    const handleCartSync = (event: Event) => {
      const customEvent = event as CustomEvent<CartResponse | null>;
      if (customEvent.detail) {
        setCart(customEvent.detail);
      } else {
        refreshCart();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener(CART_UPDATED_EVENT, handleCartSync);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener(CART_UPDATED_EVENT, handleCartSync);
      }
    };
  }, [refreshCart]);

  return { cart, loading, error, refreshCart, setCart, clearCart, isClearing };
}

export function useAddToCart(onSuccess?: (cart: CartResponse) => void) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addToCart = async (variantId: string, quantity: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const updatedCart = await CartService.addToCart({ variantId, quantity });
      const cartData = updatedCart as unknown as CartResponse;

      // Broadcast update across all useCart listeners immediately
      notifyCartUpdated(cartData);

      if (onSuccess && updatedCart) onSuccess(cartData);
      return updatedCart;
    } catch (err: any) {
      setError(err?.message || 'Could not add item to cart.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addToCart, loading, error };
}

export function useUpdateCartItem(
  setCart?: React.Dispatch<React.SetStateAction<CartResponse | null>>,
  onSuccess?: (cart: CartResponse) => void
) {
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      setLoadingItemId(itemId);
      setError(null);

      // Optimistic update
      if (setCart) {
        setCart((prev) => {
          if (!prev) return null;
          const updatedItems = prev.items.map((item) => {
            if (item.id === itemId) {
              const unitPrice = item.variant?.price || 0;
              return {
                ...item,
                quantity,
                lineTotal: unitPrice * quantity,
              };
            }
            return item;
          });

          const newSubtotal = updatedItems.reduce((acc, item) => acc + item.lineTotal, 0);
          const newItemCount = updatedItems.reduce((acc, item) => acc + item.quantity, 0);

          const optimisticState = {
            ...prev,
            items: updatedItems,
            subtotal: newSubtotal,
            itemCount: newItemCount,
          };

          notifyCartUpdated(optimisticState);
          return optimisticState;
        });
      }

      const updatedCart = await CartService.updateQuantity({ itemId, quantity });
      if (updatedCart && typeof updatedCart === 'object' && 'items' in updatedCart) {
        const cartData = updatedCart as unknown as CartResponse;
        if (setCart) setCart(cartData);
        notifyCartUpdated(cartData);
        if (onSuccess) onSuccess(cartData);
      }
      return updatedCart;
    } catch (err: any) {
      setError(err?.message || 'Could not update item quantity.');
      throw err;
    } finally {
      setLoadingItemId(null);
    }
  };

  return { updateQuantity, loadingItemId, error };
}

export function useRemoveFromCart(
  setCart?: React.Dispatch<React.SetStateAction<CartResponse | null>>,
  onSuccess?: (cart: CartResponse) => void
) {
  const [removingItemId, setRemovingItemId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const removeFromCart = async (itemId: string) => {
    try {
      setRemovingItemId(itemId);
      setError(null);

      // Optimistic update
      if (setCart) {
        setCart((prev) => {
          if (!prev) return null;
          const updatedItems = prev.items.filter((item) => item.id !== itemId);
          const newSubtotal = updatedItems.reduce((acc, item) => acc + item.lineTotal, 0);
          const newItemCount = updatedItems.reduce((acc, item) => acc + item.quantity, 0);

          const optimisticState = {
            ...prev,
            items: updatedItems,
            subtotal: newSubtotal,
            itemCount: newItemCount,
            totalUniqueItems: updatedItems.length,
          };

          notifyCartUpdated(optimisticState);
          return optimisticState;
        });
      }

      const updatedCart = await CartService.removeFromCart(itemId);
      if (updatedCart && typeof updatedCart === 'object' && 'items' in updatedCart) {
        const cartData = updatedCart as unknown as CartResponse;
        if (setCart) setCart(cartData);
        notifyCartUpdated(cartData);
        if (onSuccess) onSuccess(cartData);
      }
      return updatedCart;
    } catch (err: any) {
      setError(err?.message || 'Could not remove item.');
      throw err;
    } finally {
      setRemovingItemId(null);
    }
  };

  return { removeFromCart, removingItemId, error };
}

export function useClearCart(
  setCart?: React.Dispatch<React.SetStateAction<CartResponse | null>>,
  onSuccess?: (cart: CartResponse) => void
) {
  const [isClearing, setIsClearing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearCart = async () => {
    try {
      setIsClearing(true);
      setError(null);

      // Optimistic update
      if (setCart) {
        setCart((prev) => {
          if (!prev) return null;
          const optimisticState = {
            ...prev,
            items: [],
            subtotal: 0,
            itemCount: 0,
            totalUniqueItems: 0,
          };
          notifyCartUpdated(optimisticState);
          return optimisticState;
        });
      }

      const updatedCart = await CartService.clearCart();
      if (updatedCart && typeof updatedCart === 'object' && 'items' in updatedCart) {
        const cartData = updatedCart as unknown as CartResponse;
        if (setCart) setCart(cartData);
        notifyCartUpdated(cartData);
        if (onSuccess) onSuccess(cartData);
      }
      return updatedCart;
    } catch (err: any) {
      setError(err?.message || 'Could not clear cart.');
      throw err;
    } finally {
      setIsClearing(false);
    }
  };

  return { clearCart, isClearing, error };
}