'use client';

import React, { useState } from 'react';
import { Product, ProductVariant } from '@/types/product';
import { Plus, Trash2, Layers, Tag } from 'lucide-react';

interface SubProps { 
  data: Partial<Product>; 
  onChange: (fields: Partial<Product>) => void; 
}

export function ProductInventory({ data, onChange }: SubProps) {
  const variants = data.variants || [];
  
  // Local state slices for variant generation tracking
  const [varSize, setVarSize] = useState('');
  const [varUnit, setVarUnit] = useState<ProductVariant['sizeUnit']>('ml');
  const [varStock, setVarStock] = useState<number>(0);
  const [varPrice, setVarPrice] = useState<number>(0);
  const [varComparePrice, setVarComparePrice] = useState<number>(0);

  /**
   * Appends a fully validated variant object to the master configuration data array
   */
  const addVariantNode = () => {
    // 1. Structural base validations
    if (!varSize || !varPrice) {
      return alert('Fill metric size and target selling price parameters.');
    }

    // 2. Business Logic Validation: comparePrice must represent a genuine markdown discount context
    if (varComparePrice > 0 && varComparePrice <= varPrice) {
      return alert('The Compare Price (original MSRP) must be strictly greater than the current active selling price.');
    }

    const generatedVariantSKU = `${data.sku || 'PROD'}-${varSize.trim().replace(/\s+/g, '')}${varUnit.toUpperCase()}`;

    // Check for SKU collisions within local runtime state list arrays
    if (variants.some(v => v.sku.toLowerCase() === generatedVariantSKU.toLowerCase())) {
      return alert(`A variant matrix node with SKU "${generatedVariantSKU}" already exists inside this configuration context.`);
    }
    
    const newVariant: ProductVariant = {
      sku: generatedVariantSKU,
      sizeValue: varSize.trim(),
      sizeUnit: varUnit,
      stock: varStock,
      price: varPrice,
      comparePrice: varComparePrice > 0 ? varComparePrice : null
    };

    onChange({
      variants: [...variants, newVariant],
      hasVariants: true
    });

    // Reset standard input elements to initial tracking state structures
    setVarSize('');
    setVarStock(0);
    setVarPrice(0);
    setVarComparePrice(0);
  };

  /**
   * Filters out a selected item index point from the matrix stack list
   */
  const deleteVariant = (index: number) => {
    const list = variants.filter((_, i) => i !== index);
    onChange({ 
      variants: list, 
      hasVariants: list.length > 0 
    });
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Inventory & Dimension Metrics</h3>
        <p className="text-xs text-gray-400">Configure sizing structures and comparative promotional prices for universal packaging configurations.</p>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Auto-Generated Master SKU</label>
        <input 
          type="text" 
          readOnly 
          value={data.sku || ''} 
          className="w-full text-xs p-2.5 border border-gray-200 rounded-lg bg-gray-50 font-mono font-bold text-gray-500" 
        />
      </div>

      <div className="border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Product Configurations / Sizing Matrix</h4>
          </div>
        </div>

        {/* VARIANT INPUT ROW GENERATOR BLOCK */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 items-end bg-gray-50 p-3 rounded-xl border border-gray-200">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Size/Value</label>
            <input 
              type="text" 
              placeholder="e.g. 250 or 30" 
              value={varSize} 
              onChange={e => setVarSize(e.target.value)} 
              className="w-full text-xs p-2 bg-white border border-gray-200 rounded-md focus:outline-emerald-500" 
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Packaging Unit</label>
            <select 
              value={varUnit} 
              onChange={e => setVarUnit(e.target.value as ProductVariant['sizeUnit'])} 
              className="w-full text-xs p-2 bg-white border border-gray-200 rounded-md focus:outline-emerald-500"
            >
              <option value="ml">ml (Milliliters)</option>
              <option value="g">g (Grams)</option>
              <option value="kg">kg (Kilograms)</option>
              <option value="oz">oz (Ounces)</option>
              <option value="sachet">Sachet</option>
              <option value="pouch">Pouch</option>
              <option value="bottle">Bottle</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Stock Vol</label>
            <input 
              type="number" 
              min="0"
              value={varStock || ''} 
              onChange={e => setVarStock(Math.max(0, Number(e.target.value)))} 
              className="w-full text-xs p-2 bg-white border border-gray-200 rounded-md focus:outline-emerald-500 font-mono" 
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Price ($)</label>
            <input 
              type="number" 
              min="0"
              step="0.01"
              placeholder="0.00"
              value={varPrice || ''} 
              onChange={e => setVarPrice(Math.max(0, Number(e.target.value)))} 
              className="w-full text-xs p-2 bg-white border border-gray-200 rounded-md focus:outline-emerald-500 font-mono font-bold" 
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-1 flex items-center gap-0.5">
              <Tag className="w-2.5 h-2.5" /> Compare ($)
            </label>
            <input 
              type="number" 
              min="0"
              step="0.01"
              placeholder="MSRP / Original"
              value={varComparePrice || ''} 
              onChange={e => setVarComparePrice(Math.max(0, Number(e.target.value)))} 
              className="w-full text-xs p-2 bg-white border border-gray-200 rounded-md focus:outline-emerald-500 font-mono text-gray-500 line-through" 
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <button 
              type="button" 
              onClick={addVariantNode} 
              className="w-full py-2 bg-gray-900 text-white rounded-md text-xs font-bold hover:bg-gray-800 flex items-center justify-center gap-1 cursor-pointer transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Append
            </button>
          </div>
        </div>

        {/* ACTIVE MULTI-VARIATION MATRIX DATATABLE */}
        {variants.length > 0 && (
          <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <table className="w-full text-left text-[11px] bg-white">
              <thead className="bg-gray-100 font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="p-2.5 border-r border-gray-200/60">Variant Specs</th>
                  <th className="p-2.5 border-r border-gray-200/60">Generated Variant SKU</th>
                  <th className="p-2.5 text-center border-r border-gray-200/60">Stock</th>
                  <th className="p-2.5 text-right border-r border-gray-200/60">Retail Price</th>
                  <th className="p-2.5 text-right border-r border-gray-200/60">Compare MSRP</th>
                  <th className="p-2.5 text-center w-12">Remove</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {variants.map((v, i) => {
                  const hasDiscount = v.comparePrice && v.comparePrice > v.price;
                  const discountPercentage = hasDiscount 
                    ? Math.round(((v.comparePrice! - v.price) / v.comparePrice!) * 100) 
                    : 0;

                  return (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-2.5 border-r border-gray-100">
                        <span className="px-2 py-0.5 bg-gray-200 text-gray-800 rounded-md font-bold font-mono">
                          {v.sizeValue}{v.sizeUnit}
                        </span>
                      </td>
                      <td className="p-2.5 font-mono text-gray-500 border-r border-gray-100">{v.sku}</td>
                      <td className="p-2.5 text-center font-bold border-r border-gray-100">
                        <span className={v.stock === 0 ? "text-rose-600" : "text-gray-700"}>
                          {v.stock} units
                        </span>
                      </td>
                      <td className="p-2.5 text-right font-bold text-gray-900 border-r border-gray-100 font-mono">
                        ${v.price}
                      </td>
                      <td className="p-2.5 text-right font-mono border-r border-gray-100">
                        {hasDiscount ? (
                          <div className="flex flex-col items-end">
                            <span className="text-gray-400 line-through text-[10px]">${v.comparePrice!.toFixed(2)}</span>
                            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded">
                              Save {discountPercentage}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="p-2.5 text-center">
                        <button 
                          type="button" 
                          onClick={() => deleteVariant(i)} 
                          className="text-rose-600 hover:text-rose-800 p-1 hover:bg-rose-50 rounded transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}