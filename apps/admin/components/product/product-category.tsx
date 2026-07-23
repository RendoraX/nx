import React from 'react';
import { Product } from '@/types/product';
import { useCategories } from '@/hooks/useCategories';

interface SubProps { data: Partial<Product>; onChange: (fields: Partial<Product>) => void; }

export function ProductCategory({ data, onChange }: SubProps) {
  const { categories } = useCategories();

  return (
    <div className="space-y-4">
      <div><h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Catalog Architecture Node</h3><p className="text-xs text-gray-400">Map this product instance structure securely to your catalog categories tree.</p></div>
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Primary System Allocation Category *</label>
        <select value={data.categoryId || ''} onChange={e => onChange({ categoryId: e.target.value })} className="w-full text-xs p-2.5 border border-gray-200 rounded-lg bg-white focus:outline-emerald-500 font-semibold text-gray-800">
          <option value="">Choose organizational terminal category group</option>
          {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
        </select>
      </div>
    </div>
  );
}