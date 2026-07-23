// components/product/product-toolbar.tsx
'use client';

import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import SortSelect from './sort-select';

interface ProductToolbarProps {
  totalItems: number;
  currentSort: string;
  currentOrder: 'asc' | 'desc' | '';
  onSortChange: (sort: string, order: 'asc' | 'desc' | '') => void;
  onOpenMobileFilters: () => void;
}

export default function ProductToolbar({
  totalItems,
  currentSort,
  currentOrder,
  onSortChange,
  onOpenMobileFilters,
}: ProductToolbarProps) {
  return (
    <div className="bg-white border border-stone-200/80 rounded-xl p-4 flex items-center justify-between gap-4 shadow-sm">
      
      {/* COUNTER & INTERFACE STATE CONTROL */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileFilters}
          className="lg:hidden flex items-center gap-2 px-3.5 py-2 border border-stone-200 text-stone-700 text-[14.1px] font-medium rounded-lg hover:bg-stone-50 transition-colors focus-visible:outline-2 focus-visible:outline-amber-900"
        >
          <SlidersHorizontal className="w-4 h-4 text-amber-900" />
          Filters
        </button>
        <span className="text-stone-600 text-[14.1px] font-medium hidden sm:inline">
          Showing <strong className="text-stone-900 font-bold">{totalItems}</strong> pristine products
        </span>
      </div>

      {/* SORT CONTROLS CAPABILITY ROW */}
      <SortSelect
        currentSort={currentSort}
        currentOrder={currentOrder}
        onSortChange={onSortChange}
      />

    </div>
  );
}