// page.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { ShoppingBag, Check, Info, Sparkles, Plus, Minus, RotateCcw } from 'lucide-react';
import { useCustomerKit } from '@/hooks/useCustomerKit';
import { useRouter } from 'next/navigation';

export default function BespokeKitBuilder() {
  const {
    catalogKits,
    activeKit,
    customizedItems,
    dynamicTotalPrice,
    isLoading,
    isSubmitting: isHookSubmitting,
    error,
    selectKit,
    updateItemQuantity,
    resetToDefaults,
    createOrder
  } = useCustomerKit();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  // Compute total item count dynamically directly from customizedItems
  const totalItemCount = useMemo(() => {
    return customizedItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [customizedItems]);

  const handleUpdateQuantity = (productId: string, variantId: string | null, delta: number) => {
    const currentItem = customizedItems.find(
      (i) => i.productId === productId && (i.variantId ?? null) === variantId
    );
    const currentQty = currentItem ? currentItem.quantity : 0;
    const nextQty = Math.max(0, currentQty + delta);
    updateItemQuantity(productId, variantId, nextQty);
  };

  const router = useRouter()
 const handleCreateorder  = () => {
    if (!activeKit) return;

    const payload = {
      templateId: activeKit.id,
      items: customizedItems
        .filter((item) => item.quantity > 0)
        .map((item) => ({
          productId: item.productId,
          variantId: item.variantId ?? undefined,
          quantity: item.quantity,
        })),
    };

    localStorage.setItem('active_custom_kit', JSON.stringify(payload));
    router.push('/account/kit/checkout');
  };

  if (isLoading && catalogKits.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center text-stone-500 font-serif">
        Loading ritual box catalog configurations...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-red-600 font-medium">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 text-left">
      {/* Structural Header Banner */}
      <div className="bg-[#1B3B2B] border border-[#1B3B2B] rounded-xl p-8 mb-12 relative overflow-hidden shadow-sm">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#FCFAF7_1px,transparent_1px),linear-gradient(to_bottom,#FCFAF7_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#C89B3C] uppercase tracking-widest bg-[#C89B3C]/10 border border-[#C89B3C]/20 px-2.5 py-1 rounded-full">
            <Sparkles className="h-3 w-3" /> Brahman-Verified Layouts
          </div>
          <h1 className="font-serif text-3xl font-semibold text-[#FCFAF7] tracking-tight">Custom Ritual Box Builder</h1>
          <p className="text-sm text-[#EAE3D2] font-light leading-relaxed">
            Select a verified foundation blueprint designed by expert pandits. Have some items at home? Simply reduce their quantities to exclude them and save. Need extras? Customize instantly.
          </p>
        </div>
      </div>

      {orderSuccess && (
        <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-medium flex items-center justify-between">
          <span>{orderSuccess}</span>
          <button onClick={() => setOrderSuccess(null)} className="text-emerald-600 hover:text-emerald-900 text-xs underline">
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Step Customizer Engine */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Section 1: Select Ritual Base Theme */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg text-[#1B3B2B] font-medium flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#1B3B2B] text-white flex items-center justify-center text-xs">1</span>
              Choose Ritual Blueprint Purpose
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {catalogKits.map((tmpl) => {
                const isCurrent = activeKit?.id === tmpl.id;
                return (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => selectKit(tmpl.id)}
                    className={`border rounded-xl p-5 text-left transition-all relative flex flex-col justify-between h-44 cursor-pointer ${
                      isCurrent ? 'border-[#C89B3C] bg-[#FCFAF7] shadow-sm' : 'border-[#EAE3D2] bg-white hover:border-[#1B3B2B]/20'
                    }`}
                  >
                    {isCurrent && (
                      <span className="absolute top-3 right-3 w-5 h-5 bg-[#C89B3C] text-white rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </span>
                    )}
                    <div className="space-y-1">
                      <h4 className="font-serif font-semibold text-sm text-[#1A1A1A]">{tmpl.name}</h4>
                      <p className="text-[10px] text-[#C89B3C] font-semibold">{tmpl.curatedBy}</p>
                      <p className="text-[11px] text-[#7C7467] font-light leading-tight pt-1 line-clamp-2">{tmpl.description}</p>
                    </div>
                    <div className="pt-2 border-t border-[#EAE3D2]/60 w-full flex justify-between items-baseline text-xs text-[#7C7467]">
                      <span>Box Base: ₹{tmpl.baseBoxPrice}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Edit Inventory / Subtract Items Owned At Home */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#EAE3D2] pb-2">
              <h3 className="font-serif text-lg text-[#1B3B2B] font-medium flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#1B3B2B] text-white flex items-center justify-center text-xs">2</span>
                Customize Box Inventory Elements
              </h3>
              <button
                type="button"
                onClick={resetToDefaults}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-[#7C7467] hover:text-[#1B3B2B] bg-white border border-[#EAE3D2] px-2.5 py-1 rounded-md transition-all self-start cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" /> Reset to Pandit Recommended
              </button>
            </div>

            {activeKit?.defaultItems?.map((defaultItem) => {
              const item = defaultItem.product;
              if (!item) return null;

              const variantId = defaultItem.variantId ?? null;
              const activeItem = customizedItems.find(
                (i) => i.productId === item.id && (i.variantId ?? null) === variantId
              );
              const quantity = activeItem ? activeItem.quantity : 0;
              const defaultQty = defaultItem.quantity;

              return (
                <div 
                  key={item.id} 
                  className={`border rounded-xl p-4 flex items-center justify-between gap-4 transition-all ${
                    quantity > 0 
                      ? 'border-[#EAE3D2] bg-white shadow-sm' 
                      : 'border-[#EAE3D2]/40 bg-[#FCFAF7]/40 opacity-60'
                  }`}
                >
                  <div className="space-y-1 max-w-[65%]">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <h5 className="font-serif font-medium text-xs text-[#1A1A1A]">{item.name}</h5>
                      <span className="text-[9px] font-bold text-[#1B3B2B] bg-[#1B3B2B]/5 px-1.5 py-0.5 rounded border border-[#1B3B2B]/10">
                        Pandit Choice ({defaultQty})
                      </span>
                    </div>
                    <p className="text-[10px] text-[#7C7467] font-light line-clamp-1">{item.description || 'Essential ritual component'}</p>
                    <p className="text-xs font-mono font-medium text-[#1B3B2B] pt-0.5">₹{item.price}</p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1.5">
                    <div className="flex items-center border border-[#EAE3D2] rounded-lg bg-[#FCFAF7] overflow-hidden">
                      <button 
                        type="button"
                        onClick={() => handleUpdateQuantity(item.id, variantId, -1)}
                        className="px-2 py-1 text-xs font-bold hover:bg-[#EAE3D2]/40 text-[#7C7467] cursor-pointer"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-3 text-xs font-mono font-bold text-[#1A1A1A] min-w-[24px] text-center">
                        {quantity}
                      </span>
                      <button 
                        type="button"
                        onClick={() => handleUpdateQuantity(item.id, variantId, 1)}
                        className="px-2 py-1 text-xs font-bold hover:bg-[#EAE3D2]/40 text-[#7C7467] cursor-pointer"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    
                    {quantity > 0 && quantity !== defaultQty && (
                      <span className="text-[9px] text-[#C89B3C] font-mono">Modified</span>
                    )}
                    {quantity === 0 && (
                      <span className="text-[9px] text-red-600 font-medium">Excluded (Own at Home)</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Custom Pricing Compilation Checklist Sidebar Container */}
        <div className="lg:sticky lg:top-8 bg-[#FCFAF7] border border-[#EAE3D2] rounded-xl p-6 shadow-sm space-y-6">
          <div>
            <h4 className="font-serif text-base text-[#1B3B2B] font-medium flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-[#C89B3C]" /> Box Manifest Breakdown
            </h4>
            <p className="text-[10px] text-[#7C7467] font-light mt-0.5">Live visualization of your custom ritual package manifest</p>
          </div>
          
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center text-[#7C7467]">
              <span>Ritual Box Base Layout</span>
              <span className="font-mono font-medium text-[#1A1A1A]">₹{activeKit?.baseBoxPrice || 0}</span>
            </div>

            {customizedItems.length > 0 ? (
              <div className="pt-3 border-t border-[#EAE3D2]/60 space-y-2 max-h-56 overflow-y-auto pr-1">
                {customizedItems.map(item => {
                  const defaultItem = activeKit?.defaultItems?.find(i => i.productId === item.productId);
                  const defaultQty = defaultItem?.quantity || 0;
                  const isModified = defaultQty !== item.quantity;
                  const unitPrice = item.selectedVariant ? Number(item.selectedVariant.price) : Number(item.product?.price || 0);

                  return (
                    <div key={`${item.productId}-${item.variantId}`} className="flex justify-between items-start text-[11px] text-[#7C7467]">
                      <div className="max-w-[70%]">
                        <p className="truncate text-[#1A1A1A] font-medium">{item.product?.name}</p>
                        <p className="text-[9px] font-mono">
                          Qty: {item.quantity} {isModified && <span className="text-[#C89B3C] ml-1">(Custom)</span>}
                        </p>
                      </div>
                      <span className="font-mono pt-0.5">₹{unitPrice * item.quantity}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="pt-3 border-t border-[#EAE3D2]/60 text-center py-4 text-[#7C7467] italic text-[11px]">
                All items excluded. Box is currently empty.
              </div>
            )}

            <div className="pt-4 border-t border-[#EAE3D2] flex justify-between items-baseline">
              <span className="text-sm font-medium text-[#1B3B2B]">Estimated Total</span>
              <span className="text-xl font-serif font-bold text-[#1B3B2B]">₹{dynamicTotalPrice}</span>
            </div>
          </div>

          <button
            type="button"
            disabled={isSubmitting || isHookSubmitting || totalItemCount === 0}
            onClick={handleCreateorder}
            className="w-full py-3 bg-[#1B3B2B] hover:bg-[#132a1e] text-white disabled:bg-[#7C7467]/30 disabled:cursor-not-allowed text-xs font-bold uppercase tracking-widest rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting || isHookSubmitting ? 'Processing Order...' : 'Place Kit Order'}
          </button>
          
          <div className="text-[10px] text-[#A39785] font-light leading-snug space-y-1.5 bg-white p-3 rounded-lg border border-[#EAE3D2]/60">
            <div className="flex items-start gap-1.5">
              <Info className="h-3 w-3 text-[#C89B3C] flex-shrink-0 mt-0.5" />
              <span>Items lowered to zero will not be packed in your container. Perfect if you have brass artifacts or powders remaining from prior home celebrations.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}