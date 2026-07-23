// components/product/product-search.tsx
'use client';

import React from 'react';
import { Search, X } from 'lucide-react';

interface ProductSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ProductSearch({ value, onChange }: ProductSearchProps) {
  return (
    <div className="w-full relative">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
        <Search className="w-4 h-4" aria-hidden="true" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search for premium herbs, traditional ritual items, sanskrit names..."
        className="w-full bg-white border border-stone-200 text-stone-800 placeholder-stone-400 text-[14.1px] font-medium rounded-xl pl-10 pr-10 py-3.5 focus:outline-none focus:border-amber-900 focus:ring-1 focus:ring-amber-900 shadow-sm transition-all"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 transition-colors"
          aria-label="Clear search input"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}