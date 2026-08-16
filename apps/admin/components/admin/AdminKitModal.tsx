// AdminKitModal.tsx
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { X, Plus, Trash2, ShieldAlert, Sparkles, Layers } from 'lucide-react';
import Select, { SingleValue } from 'react-select';
import { AdminRitualTemplate } from '@/hooks/useAdminRitual';

interface ProductVariant {
  id: string;
  productId: string;
  size: string;
  sku: string;
  price: string | number;
  stock?: number;
}

interface ComprehensiveProduct {
  id: string;
  name: string;
  sku: string;
  price: string | number;
  description?: string;
  slug: string;
  comparePrice?: string | number;
  variants?: ProductVariant[];
}

interface AdminKitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  template: AdminRitualTemplate | null;
  allAvailableProducts: ComprehensiveProduct[]; 
  isMutating?: boolean;
}

interface ModalItemLine {
  productId: string;
  variantId: string;
  quantity: number;
}

interface OptionType {
  value: string;
  label: string;
}

export default function AdminKitModal({ 
  isOpen, 
  onClose, 
  onSave, 
  template, 
  allAvailableProducts = [],
  isMutating = false 
}: AdminKitModalProps) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [curatedBy, setCuratedBy] = useState('');
  const [baseBoxPrice, setBaseBoxPrice] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [isManualPrice, setIsManualPrice] = useState(false);
  const [items, setItems] = useState<ModalItemLine[]>([]);

  // ⚡ PERFORMANCE OPTIMIZATION 1: O(1) Map indexing for fast product lookups
  const productMap = useMemo(() => {
    const map = new Map<string, ComprehensiveProduct>();
    allAvailableProducts.forEach(p => map.set(p.id, p));
    return map;
  }, [allAvailableProducts]);

  // ⚡ PERFORMANCE OPTIMIZATION 2: Pre-format searchable options for React-Select
  const productOptions: OptionType[] = useMemo(() => {
    return allAvailableProducts.map(p => ({
      value: p.id,
      label: `${p.name} (SKU: ${p.sku}) - ₹${p.price}`
    }));
  }, [allAvailableProducts]);

  // Dynamic price calculation
  const calculateAutoSum = useCallback((currentItems: ModalItemLine[]) => {
    return currentItems.reduce((acc, currentItem) => {
      const parentProd = productMap.get(currentItem.productId);
      if (!parentProd) return acc;

      let itemPrice = Number(parentProd.price);
      if (currentItem.variantId && parentProd.variants?.length) {
        const matchingVariant = parentProd.variants.find(v => v.id === currentItem.variantId);
        if (matchingVariant) {
          itemPrice = Number(matchingVariant.price);
        }
      }
      return acc + (itemPrice * currentItem.quantity);
    }, 0);
  }, [productMap]);

  // Populate data when template or modal opens
  useEffect(() => {
    if (template && isOpen) {
      setName(template.name || '');
      setSlug(template.slug || '');
      setDescription(template.description || '');
      setCuratedBy(template.curatedBy || '');
      setBaseBoxPrice(Number(template.baseBoxPrice) || 0);
      setIsActive(template.isActive ?? true);
      setIsManualPrice(template.isManualPrice || false);
      
      setItems((template.defaultItems || []).map(i => {
        const matchingProduct = productMap.get(i.productId);
        const hasVariants = Boolean(matchingProduct?.variants?.length);
        
        let initialVariantId = i.variantId || '';
        if (hasVariants && matchingProduct?.variants) {
          const matchedVar = initialVariantId 
            ? matchingProduct.variants.find(v => v.id === initialVariantId)
            : matchingProduct.variants.find(v => v.sku === i.product?.sku);
            
          initialVariantId = matchedVar ? matchedVar.id : matchingProduct.variants[0].id;
        }

        return {
          productId: i.productId,
          variantId: initialVariantId,
          quantity: i.quantity || 1
        };
      }));
    } else if (!template && isOpen) {
      setName('');
      setSlug('');
      setDescription('');
      setCuratedBy('');
      setBaseBoxPrice(0);
      setIsActive(true);
      setIsManualPrice(false);
      setItems([]);
    }
  }, [template, isOpen, productMap]);

  // Recalculate box price if auto-pricing is enabled
  useEffect(() => {
    if (!isManualPrice && items.length > 0) {
      setBaseBoxPrice(calculateAutoSum(items));
    }
  }, [items, isManualPrice, calculateAutoSum]);

  if (!isOpen) return null;

  const handleNameChange = (newName: string) => {
    setName(newName);
    const calculatedSlug = newName
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')     
      .replace(/[\s_-]+/g, '-')     
      .replace(/^-+|-+$/g, '');     
    setSlug(calculatedSlug);
  };

  const handleAddItemRow = () => {
    if (allAvailableProducts.length === 0) return;

    setItems(prev => [
      ...prev,
      { productId: '', variantId: '', quantity: 1 }
    ]);
  };

  const handleUpdateItemRow = (index: number, field: keyof ModalItemLine, value: any) => {
    setItems(prev => {
      const updated = [...prev];
      if (field === 'productId') {
        const selectedProduct = productMap.get(value);
        const defaultVarId = selectedProduct?.variants?.length 
          ? selectedProduct.variants[0].id 
          : '';
        
        updated[index] = { productId: value, variantId: defaultVarId, quantity: updated[index].quantity };
      } else {
        updated[index] = { ...updated[index], [field]: field === 'quantity' ? Number(value) : value };
      }
      return updated;
    });
  };

  const handleRemoveItemRow = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      slug,
      description,
      curatedBy,
      baseBoxPrice,
      isActive,
      isManualPrice,
      defaultItems: items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        variantId: item.variantId || null 
      }))
    });
  };

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 transition-all duration-300 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[92vh] border border-stone-100 transform scale-100 animate-scaleUp">
        
        {/* Header */}
        <div className="px-6 py-5 bg-[#1B3B2B] text-white flex justify-between items-center border-b border-[#254f3a]">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-300 fill-amber-300/20" />
              <h3 className="font-serif text-base font-semibold tracking-wide">
                {template ? 'Modify Ritual Blueprint' : 'New Ritual Blueprint'}
              </h3>
            </div>
            <p className="text-[10px] text-stone-300 tracking-wider uppercase font-medium">
              {template ? `Editing Configuration Matrix: ${template.slug}` : 'Define structural template boundaries'}
            </p>
          </div>
          <button 
            onClick={onClose} 
            type="button"
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full cursor-pointer transition-all duration-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Input Configuration Workspace */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs text-left bg-stone-50/50">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-stone-600 tracking-tight">Blueprint Public Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => handleNameChange(e.target.value)} 
                required 
                className="w-full bg-white border border-stone-200 p-2.5 text-stone-800 rounded-lg shadow-2xs focus:outline-hidden focus:border-[#1B3B2B] focus:ring-2 focus:ring-[#1B3B2B]/10 transition-all font-medium" 
                placeholder="e.g., Durga Puja Premium Kit" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-stone-600 tracking-tight">Unique URL Slug (Auto Generated)</label>
              <input 
                type="text" 
                value={slug} 
                onChange={(e) => setSlug(e.target.value)} 
                required 
                className="w-full bg-stone-100/80 border border-stone-200 p-2.5 text-stone-600 rounded-lg shadow-2xs focus:outline-hidden focus:border-[#1B3B2B] focus:ring-2 focus:ring-[#1B3B2B]/10 transition-all font-mono" 
                placeholder="durga-puja-box" 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-stone-600 tracking-tight">Description Context</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
              className="w-full bg-white border border-stone-200 p-2.5 text-stone-800 rounded-lg shadow-2xs focus:outline-hidden focus:border-[#1B3B2B] focus:ring-2 focus:ring-[#1B3B2B]/10 transition-all h-20 resize-none leading-relaxed" 
              placeholder="Provide clean ritual alignment details..." 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-stone-600 tracking-tight">Curating Pandit Authority</label>
              <input 
                type="text" 
                value={curatedBy} 
                onChange={(e) => setCuratedBy(e.target.value)} 
                required 
                className="w-full bg-white border border-stone-200 p-2.5 text-stone-800 rounded-lg shadow-2xs focus:outline-hidden focus:border-[#1B3B2B] focus:ring-2 focus:ring-[#1B3B2B]/10 transition-all font-medium" 
                placeholder="Pt. K. Sharma (Varanasi)" 
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-stone-600 tracking-tight">Container Base Price (₹)</label>
                <div className="flex items-center gap-1 cursor-pointer">
                  <input 
                    type="checkbox"
                    id="isManualPrice"
                    checked={isManualPrice}
                    onChange={(e) => setIsManualPrice(e.target.checked)}
                    className="rounded border-stone-300 h-3 w-3 text-[#1B3B2B] focus:ring-0"
                  />
                  <label htmlFor="isManualPrice" className="text-[10px] tracking-tight font-medium text-stone-500 cursor-pointer select-none">Manual Edit</label>
                </div>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-stone-400 font-medium">₹</span>
                <input 
                  type="number" 
                  value={baseBoxPrice || ''} 
                  onChange={(e) => setBaseBoxPrice(Number(e.target.value))} 
                  disabled={!isManualPrice}
                  required 
                  className={`w-full border border-stone-200 py-2.5 pl-7 pr-3 text-stone-800 rounded-lg shadow-2xs focus:outline-hidden focus:border-[#1B3B2B] focus:ring-2 focus:ring-[#1B3B2B]/10 transition-all font-semibold ${!isManualPrice ? 'bg-stone-100 font-mono text-stone-500 cursor-not-allowed' : 'bg-white'}`} 
                  min="0"
                />
              </div>
            </div>
          </div>

          <label htmlFor="isActive" className="flex items-start gap-3 p-3 bg-white border border-stone-200 rounded-xl cursor-pointer hover:bg-stone-50 transition-all shadow-2xs group">
            <input 
              type="checkbox" 
              id="isActive" 
              checked={isActive} 
              onChange={(e) => setIsActive(e.target.checked)} 
              className="mt-0.5 rounded border-stone-300 text-[#1B3B2B] focus:ring-offset-0 focus:ring-0 h-4 w-4 cursor-pointer transition-all" 
            />
            <div className="space-y-0.5">
              <span className="font-semibold text-stone-800 group-hover:text-stone-900 transition-colors">Publish Blueprint live instantly</span>
              <p className="text-[11px] text-stone-500">Makes this specific blueprint discoverable on the retail catalog storefront immediately.</p>
            </div>
          </label>

          {/* Associated Items Section */}
          <div className="border-t border-stone-200/80 pt-5 space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-[#1B3B2B]" />
                <h4 className="font-serif text-sm text-[#1B3B2B] font-semibold">Inventory Manifest Allocations</h4>
              </div>
              <button 
                type="button" 
                onClick={handleAddItemRow} 
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white bg-[#1B3B2B] hover:bg-[#132a1e] px-3 py-1.5 rounded-lg cursor-pointer transition-all shadow-xs hover:shadow-sm"
              >
                <Plus className="h-3 w-3" /> Add Item Line
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-8 border-2 border-dashed border-stone-200 rounded-xl text-stone-500 bg-white px-4 space-y-2">
                <ShieldAlert className="h-5 w-5 text-stone-400 stroke-[1.5]" />
                <p className="italic font-medium">No components currently mapped to this configuration container.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                {items.map((item, idx) => {
                  const selectedProduct = productMap.get(item.productId);
                  const productVariants = selectedProduct?.variants || [];
                  const hasVariants = productVariants.length > 0;

                  let singleUnitCost = selectedProduct ? Number(selectedProduct.price) : 0;
                  let stockKeepingUnit = selectedProduct ? selectedProduct.sku : '';
                  
                  if (hasVariants && item.variantId) {
                    const matchedVar = productVariants.find(v => v.id === item.variantId);
                    if (matchedVar) {
                      singleUnitCost = Number(matchedVar.price);
                      stockKeepingUnit = matchedVar.sku;
                    }
                  }

                  const selectedOption = productOptions.find(opt => opt.value === item.productId) || null;

                  return (
                    <div key={idx} className="bg-white p-3 rounded-xl border border-stone-200 shadow-2xs space-y-2 group hover:border-stone-400 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
                        
                        {/* ⚡ Fast Searchable Product Picker */}
                        <div className="flex-1 min-w-[200px]">
                          <Select<OptionType>
                            options={productOptions}
                            value={selectedOption}
                            onChange={(selected: SingleValue<OptionType>) => {
                              if (selected) handleUpdateItemRow(idx, 'productId', selected.value);
                            }}
                            placeholder="Search product..."
                            isSearchable
                            className="text-xs"
                            styles={{
                              control: (base) => ({
                                ...base,
                                borderColor: '#e7e5e4',
                                borderRadius: '0.5rem',
                                padding: '2px',
                                boxShadow: 'none',
                                '&:hover': { borderColor: '#1B3B2B' }
                              }),
                              menuPortal: base => ({ ...base, zIndex: 9999 })
                            }}
                            menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                          />
                        </div>

                        {/* Variant Selector */}
                        {hasVariants && (
                          <select
                            value={item.variantId}
                            onChange={(e) => handleUpdateItemRow(idx, 'variantId', e.target.value)}
                            className="flex-1 min-w-[140px] bg-amber-50/30 border border-amber-200 p-2 text-stone-800 rounded-lg focus:outline-hidden focus:border-[#1B3B2B] focus:bg-white cursor-pointer transition-all font-medium text-[11px]"
                          >
                            {productVariants.map(v => (
                              <option key={v.id} value={v.id}>
                                {v.size || v.sku} — (₹{v.price})
                              </option>
                            ))}
                          </select>
                        )}
                        
                        <div className="flex items-center justify-end gap-2.5">
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider pr-1">Qty</span>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleUpdateItemRow(idx, 'quantity', e.target.value)}
                              className="w-14 bg-stone-50/50 border border-stone-200 p-2 rounded-lg text-center focus:outline-hidden focus:border-[#1B3B2B] focus:bg-white font-semibold font-mono"
                            />
                          </div>

                          <button 
                            type="button" 
                            onClick={() => handleRemoveItemRow(idx)} 
                            className="text-stone-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg cursor-pointer transition-all"
                            title="Delete assignment"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Summary Information Block */}
                      {selectedProduct && (
                        <div className="bg-stone-50 p-2 rounded-lg border border-stone-100 grid grid-cols-3 gap-2 text-[10px] font-medium text-stone-500">
                          <div>
                            <span className="text-stone-400 block uppercase tracking-tight text-[9px] font-bold">Dynamic Price</span>
                            <span className="text-stone-800 font-semibold font-mono">₹{singleUnitCost * item.quantity}</span> 
                            {item.quantity > 1 && <span className="text-[9px] text-stone-400 block font-normal">(₹{singleUnitCost} each)</span>}
                          </div>
                          <div>
                            <span className="text-stone-400 block uppercase tracking-tight text-[9px] font-bold">SKU Matrix Code</span>
                            <span className="font-mono bg-stone-200/60 px-1 py-0.2 rounded text-stone-700 block truncate" title={stockKeepingUnit}>{stockKeepingUnit}</span>
                          </div>
                          <div>
                            <span className="text-stone-400 block uppercase tracking-tight text-[9px] font-bold">Product Context</span>
                            <span className="truncate block text-stone-600 italic" title={selectedProduct.description}>
                              {selectedProduct.description || 'No description context'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action Interface Footer */}
          <div className="pt-4 border-t border-stone-200/80 flex justify-end gap-2.5 bg-transparent">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2.5 border border-stone-200 text-stone-600 bg-white rounded-xl font-semibold hover:bg-stone-50 active:bg-stone-100 transition-all cursor-pointer shadow-2xs"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isMutating}
              className="px-5 py-2.5 bg-[#1B3B2B] text-white rounded-xl font-semibold hover:bg-[#132a1e] active:scale-[0.98] transition-all cursor-pointer shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isMutating ? 'Saving Layout Changes...' : 'Save Template Matrix'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}