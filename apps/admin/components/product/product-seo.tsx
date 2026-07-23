import React from 'react';
import { Product } from '@/types/product';

interface SubProps { data: Partial<Product>; onChange: (fields: Partial<Product>) => void; }

export function ProductSeo({ data, onChange }: SubProps) {
  return (
    <div className="space-y-4">
      <div><h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">SEO Engine Controls</h3><p className="text-xs text-gray-400">Feed semantic configurations perfectly out to your consumer frontend routes layout meta arrays layers.</p></div>
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Meta Injection Title</label>
        <input type="text" value={data.metaTitle || ''} onChange={e => onChange({ metaTitle: e.target.value })} className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-emerald-500 font-medium" placeholder="Target structured keyword title context" />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Meta Context Index Description</label>
        <textarea rows={3} value={data.metaDescription || ''} onChange={e => onChange({ metaDescription: e.target.value })} className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-emerald-500 font-medium" placeholder="Max 160 structural characters recommendation layout..." />
      </div>
    </div>
  );
}