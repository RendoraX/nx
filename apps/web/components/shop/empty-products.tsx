// apps/web/components/shop/empty-products.tsx
'use client';

import React from 'react';
import { Leaf } from 'lucide-react';

interface EmptyProductsProps {
  onClearFilters: () => void;
}

export function EmptyProducts({ onClearFilters }: EmptyProductsProps) {
  return (
    <div className="w-full py-16 px-4 border border-dashed border-[#E6D5B8]/60 rounded-2xl bg-[#FAF8F3]/20 flex flex-col items-center justify-center text-center max-w-xl mx-auto animate-fade-in">
      <div className="w-12 h-12 rounded-full bg-[#FAF8F3] border border-[#E6D5B8]/40 text-[#C89B3C] flex items-center justify-center mb-4">
        <Leaf className="w-5 h-5 stroke-[1.25]" />
      </div>
      <h3 className="text-base font-serif font-bold text-gray-800 mb-1">No Formulations Located</h3>
      <p className="text-xs text-gray-500 max-w-sm font-medium leading-relaxed mb-5">
        We were unable to extract any traditional remedies matching your dynamic combination parameters. Try adjusting your constraints.
      </p>
      <button
        type="button"
        onClick={onClearFilters}
        className="h-10 px-5 bg-[#1F5E3B] hover:bg-[#16442A] text-[#FAF8F3] font-semibold text-xs uppercase tracking-widest rounded-lg shadow-sm transition-all cursor-pointer"
      >
        Reset Browse Filters
      </button>
    </div>
  );
}