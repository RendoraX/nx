import React from 'react';
import { Product } from '@/types/product';

interface SubProps { data: Partial<Product>; onChange: (fields: Partial<Product>) => void; }

export function ProductPricing({ data, onChange }: SubProps) {
  return (
    <div className="space-y-4">
      <div><h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Financial Valuation Pricing</h3><p className="text-xs text-gray-400">Manage tax distributions, costs, and selling margins securely.</p></div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Selling Price ($)</label>
          <input type="number" min="0" step="0.01" value={data.price || ''} onChange={e => onChange({ price: Number(e.target.value) })} className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-emerald-500 font-semibold" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Compare Price / MRP ($)</label>
          <input type="number" min="0" step="0.01" value={data.comparePrice || ''} onChange={e => onChange({ comparePrice: Number(e.target.value) })} className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-emerald-500 text-gray-500" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Cost Price ($) <span className="text-[10px] text-amber-600 font-mono">(Admin Vault Protection View Only)</span></label>
        <input type="number" value={data.comparePrice || ''} onChange={e => onChange({ comparePrice: Number(e.target.value) })} className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-emerald-500 font-medium bg-gray-50/50" placeholder="Internal purchase asset acquisition cost profile" />
      </div>
    </div>
  );
}