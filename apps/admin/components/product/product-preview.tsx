import React from 'react';
import { Product } from '@/types/product';

export function ProductPreview({ data }: { data: Partial<Product> }) {
  const coverImage = data.images?.find(img => img.position === 0) || data.images?.[0];

  return (
    <div className="space-y-4">
      <div><h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Storefront Presentation Preview</h3><p className="text-xs text-gray-400">Approximate viewport rendition computed directly from active form inputs memory bounds.</p></div>
      <div className="border border-gray-200 rounded-2xl bg-white p-4 max-w-sm mx-auto shadow-sm">
        <div className="aspect-square w-full rounded-xl bg-gray-100 overflow-hidden border border-gray-100">
          {coverImage ? <img src={coverImage.url} alt="Cover layout view" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 font-medium">No layout image provided</div>}
        </div>
        <div className="mt-4 space-y-1.5">
          <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Preview Instance</span>
          <h4 className="font-bold text-base text-gray-900 truncate mt-1">{data.name || 'Untitled framework entry node'}</h4>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-gray-900">${data.price || '0.00'}</span>
            {Number(data.comparePrice || 0) > 0 && <span className="text-xs text-gray-400 line-through font-medium">${data.comparePrice}</span>}
          </div>
          <p className="text-xs text-gray-500 font-medium line-clamp-2 pt-1">{data.description || 'No descriptive description data configured yet...'}</p>
        </div>
      </div>
    </div>
  );
}