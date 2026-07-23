// components/product/empty-products.tsx
'use client';

import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyProductsProps {
  onClearFilters?: () => void;
}

export default function EmptyProducts({ onClearFilters }: EmptyProductsProps) {
  return (
    <div className="w-full text-center py-16 px-4 bg-white border border-stone-200/80 rounded-xl max-w-xl mx-auto my-8 shadow-sm">
      <div className="w-12 h-12 rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center mx-auto text-stone-400 mb-4">
        <Inbox className="w-5 h-5" />
      </div>
      <h3 className="font-serif text-[18.2px] font-bold text-stone-800 mb-1">No products found</h3>
      <p className="text-stone-500 text-[14.1px] mb-6 max-w-xs mx-auto leading-relaxed">
        We couldn&apos;t find matching items. Try refining or clearing your applied filter selection criteria.
      </p>
      {onClearFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="px-5 py-2.5 bg-stone-900 hover:bg-amber-900 text-white font-medium text-[14.1px] rounded-lg shadow-sm transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-amber-900"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
}