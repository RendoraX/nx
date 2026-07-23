import React from 'react';
import { Product } from '@/types/product';

interface SubProps { data: Partial<Product>; onChange: (fields: Partial<Product>) => void; }

export function ProductBasic({ data, onChange }: SubProps) {
  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
    onChange({ name, slug });
  };

  return (
    <div className="space-y-4">
      <div><h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">General Information</h3><p className="text-xs text-gray-400">Core parameters describing the inventory node context.</p></div>
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Product Title Name *</label>
        <input type="text" required value={data.name || ''} onChange={e => handleNameChange(e.target.value)} className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-emerald-500 font-medium" placeholder="e.g. Keychron Q1 Max Mechanical Keyboard" />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Core Permalink Slug Route</label>
        <input type="text" value={data.slug || ''} onChange={e => onChange({ slug: e.target.value })} className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-emerald-500 font-mono text-gray-500" />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Comprehensive Long Description Context</label>
        <textarea rows={5} value={data.description || ''} onChange={e => onChange({ description: e.target.value })} className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-emerald-500 font-medium leading-relaxed" placeholder="Write standard markup layout details..." />
      </div>
    </div>
  );
}