// @/hooks/useCustomerKit.ts
import { useState, useEffect, useCallback } from 'react';
import { 
  CustomerKitService, 
  CustomerRitualKit, 
  CustomerKitItem, 
  CustomerProductVariant,
  CreateKitOrderPayload,
  CustomerInfo,
  OrderResponse
} from '@/services/customerKit.service';

export function useCustomerKit(kitSlug?: string) {
  const [catalogKits, setCatalogKits] = useState<CustomerRitualKit[]>([]);
  const [activeKit, setActiveKit] = useState<CustomerRitualKit | null>(null);
  const [customizedItems, setCustomizedItems] = useState<CustomerKitItem[]>([]);
  const [dynamicTotalPrice, setDynamicTotalPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch a specific kit by slug directly via CustomerKitService
   */
  const getKitBySlug = useCallback(async (slug: string): Promise<CustomerRitualKit | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const kit = await CustomerKitService.getKitBySlug(slug);
      if (kit) {
        setActiveKit(kit);
        setCustomizedItems(kit.defaultItems || []);
      }
      return kit;
    } catch (err: any) {
      console.error(`Failed to load kit template matrix (${slug}):`, err);
      const message = err.response?.data?.message || err.message || "Requested configuration container could not be parsed.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 1. Load entire catalog array if no specific slug is target initialized
  useEffect(() => {
    if (kitSlug) return;

    let isMounted = true;
    const loadCatalog = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await CustomerKitService.getActiveCatalogKits();
        if (isMounted) {
          setCatalogKits(data || []);
          if (data && data.length > 0 && !activeKit) {
            setActiveKit(data[0]);
            setCustomizedItems(data[0].defaultItems || []);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to load customer catalog:", err);
          setError("Unable to retrieve catalog collections. Please try again.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCatalog();

    return () => {
      isMounted = false;
    };
  }, [kitSlug]);

  // 2. Load and initialize a targeted kit configuration for modification using getKitBySlug
  useEffect(() => {
    if (!kitSlug) return;

    let isMounted = true;
    const loadTargetKit = async () => {
      try {
        await getKitBySlug(kitSlug);
      } catch (err) {
        // Error state already captured inside getKitBySlug
      }
    };

    loadTargetKit();

    return () => {
      isMounted = false;
    };
  }, [kitSlug, getKitBySlug]);

  // 3. Select active kit programmatically from available catalog
  const selectKit = useCallback((kitIdOrSlug: string) => {
    const found = catalogKits.find(k => k.id === kitIdOrSlug || k.slug === kitIdOrSlug);
    if (found) {
      setActiveKit(found);
      setCustomizedItems(found.defaultItems || []);
    }
  }, [catalogKits]);

  // 4. Keep running calculations accurate based on customized additions or deletions
  useEffect(() => {
    if (!activeKit) {
      setDynamicTotalPrice(0);
      return;
    }

    const basePrice = Number(activeKit.baseBoxPrice) || 0;

    // If admin locked the pricing, use the base allocation
    if (activeKit.isManualPrice) {
      setDynamicTotalPrice(basePrice);
      return;
    }

    // Accumulate sum matrix based on customer selections
    const itemsSum = customizedItems.reduce((acc, item) => {
      const activePrice = item.selectedVariant 
        ? Number(item.selectedVariant.price) 
        : Number(item.product?.price || 0);
      return acc + (activePrice * item.quantity);
    }, 0);

    setDynamicTotalPrice(basePrice + itemsSum);
  }, [customizedItems, activeKit]);

  /**
   * Modify line-item item counts smoothly (supports setting 0 or re-adding items)
   */
  const updateItemQuantity = useCallback((productId: string, variantId: string | null, newQty: number) => {
    setCustomizedItems(prev => {
      const itemIndex = prev.findIndex(item => item.productId === productId && (item.variantId ?? null) === variantId);
      
      if (itemIndex > -1) {
        if (newQty <= 0) {
          return prev.filter((_, idx) => idx !== itemIndex);
        }
        return prev.map((item, idx) => idx === itemIndex ? { ...item, quantity: newQty } : item);
      } else if (newQty > 0) {
        const defaultItem = activeKit?.defaultItems?.find(
          i => i.productId === productId && (i.variantId ?? null) === variantId
        );
        if (defaultItem) {
          return [...prev, { ...defaultItem, quantity: newQty }];
        }
      }
      return prev;
    });
  }, [activeKit]);

  /**
   * Swap out variant selections dynamically
   */
  const updateItemVariant = useCallback((productId: string, currentVariantId: string | null, targetVariant: CustomerProductVariant | null) => {
    setCustomizedItems(prev =>
      prev.map(item => {
        if (item.productId === productId && item.variantId === currentVariantId) {
          return { 
            ...item, 
            variantId: targetVariant ? targetVariant.id : null,
            selectedVariant: targetVariant
          };
        }
        return item;
      })
    );
  }, []);

  /**
   * Drop item configurations
   */
  const removeItemFromKit = useCallback((productId: string, variantId: string | null) => {
    setCustomizedItems(prev =>
      prev.filter(item => !(item.productId === productId && item.variantId === variantId))
    );
  }, []);

  /**
   * Reset customized kit back to default configuration
   */
  const resetToDefaults = useCallback(() => {
    if (activeKit) {
      setCustomizedItems(activeKit.defaultItems || []);
    }
  }, [activeKit]);

  /**
   * Execute create order request with current kit state
   */
  const createOrder = useCallback(async (details?: { customerInfo?: CustomerInfo; paymentMethod?: string }): Promise<OrderResponse> => {
    if (!activeKit) {
      throw new Error("No active kit selected to process order.");
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload: CreateKitOrderPayload = {
        kitId: activeKit.id,
        kitSlug: activeKit.slug,
        items: customizedItems.map(item => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          unitPrice: item.selectedVariant 
            ? Number(item.selectedVariant.price) 
            : Number(item.product?.price || 0)
        })),
        totalPrice: dynamicTotalPrice,
        customerInfo: details?.customerInfo,
        paymentMethod: details?.paymentMethod
      };

      const order = await CustomerKitService.createOrder(payload);
      return order;
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "Failed to process kit order.";
      setError(message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [activeKit, customizedItems, dynamicTotalPrice]);

  return {
    catalogKits,
    activeKit,
    customizedItems,
    dynamicTotalPrice,
    isLoading,
    isSubmitting,
    error,
    getKitBySlug,
    selectKit,
 updateItemQuantity,
    updateItemVariant,
    removeItemFromKit,
    resetToDefaults,
    createOrder
  };
}