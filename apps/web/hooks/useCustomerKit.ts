// @/hooks/useCustomerKit.ts
import { useState, useEffect, useCallback } from 'react';
import { CustomerKitService, CustomerRitualKit, CustomerKitItem } from '@/services/customerKit.service';

export function useCustomerKit(kitSlug?: string) {
  const [catalogKits, setCatalogKits] = useState<CustomerRitualKit[]>([]);
  const [activeKit, setActiveKit] = useState<CustomerRitualKit | null>(null);
  const [customizedItems, setCustomizedItems] = useState<CustomerKitItem[]>([]);
  const [dynamicTotalPrice, setDynamicTotalPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Load entire catalog array if no specific slug is target initialized
  useEffect(() => {
    if (kitSlug) return;
    
    const loadCatalog = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await CustomerKitService.getActiveCatalogKits();
        setCatalogKits(data);
      } catch (err) {
        console.error("Failed to load customer catalog:", err);
        setError("Unable to retrieve catalog collections. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadCatalog();
  }, [kitSlug]);

  // 2. Load and initialize a targeted kit configuration for modification
  useEffect(() => {
    if (!kitSlug) return;

    const loadTargetKit = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const kit = await CustomerKitService.getKitBySlug(kitSlug);
        setActiveKit(kit);
        setCustomizedItems(kit.defaultItems || []);
      } catch (err) {
        console.error(`Failed to load kit template matrix (${kitSlug}):`, err);
        setError("Requested configuration container could not be parsed.");
      } finally {
        setIsLoading(false);
      }
    };

    loadTargetKit();
  }, [kitSlug]);

  // 3. Keep running calculations accurate based on customized additions or deletions
  useEffect(() => {
    if (!activeKit) {
      setDynamicTotalPrice(0);
      return;
    }

    // If admin locked the pricing, use the base allocation
    if (activeKit.isManualPrice) {
      setDynamicTotalPrice(Number(activeKit.baseBoxPrice));
      return;
    }

    // Accumulate sum matrix based on customer selections
    const calculatedSum = customizedItems.reduce((acc, item) => {
      const activePrice = item.selectedVariant 
        ? Number(item.selectedVariant.price) 
        : Number(item.product.price);
      return acc + (activePrice * item.quantity);
    }, 0);

    setDynamicTotalPrice(calculatedSum);
  }, [customizedItems, activeKit]);

  /**
   * Modify the line-item item counts smoothly
   */
  const updateItemQuantity = useCallback((productId: string, variantId: string | null, newQty: number) => {
    if (newQty < 1) return;
    setCustomizedItems(prev => prev.map(item => {
      if (item.productId === productId && item.variantId === variantId) {
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  }, []);

  /**
   * Swap out variant selections (e.g., matching size upgrades) dynamically
   */
  const updateItemVariant = useCallback((productId: string, currentVariantId: string | null, targetVariant: any) => {
    setCustomizedItems(prev => prev.map(item => {
      if (item.productId === productId && item.variantId === currentVariantId) {
        return { 
          ...item, 
          variantId: targetVariant ? targetVariant.id : null,
          selectedVariant: targetVariant
        };
      }
      return item;
    }));
  }, []);

  /**
   * Drop item configurations with zero click-interception layout confirm elements
   */
  const removeItemFromKit = useCallback((productId: string, variantId: string | null) => {
    setCustomizedItems(prev => prev.filter(item => 
      !(item.productId === productId && item.variantId === variantId)
    ));
  }, []);

  return {
    catalogKits,
    activeKit,
    customizedItems,
    dynamicTotalPrice,
    isLoading,
    error,
    updateItemQuantity,
    updateItemVariant,
    removeItemFromKit
  };
}