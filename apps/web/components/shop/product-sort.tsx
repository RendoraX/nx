'use client';

import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

interface ProductSortProps {
  currentSort: string;
  onSortChange: (value: any) => void;
  totalItems: number;
}

export function ProductSort({ currentSort, onSortChange, totalItems }: ProductSortProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-gray-100 w-full">
      <div className="text-xs text-gray-500 font-medium tracking-wide">
        Showing <span className="font-mono font-bold text-gray-800">{totalItems}</span> signature premium products
      </div>
      
      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        <div className="relative flex items-center bg-[#FAF8F3]/60 border border-[#E6D5B8]/60 rounded-lg px-3 py-1.5 text-xs text-gray-700 font-medium">
          <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400 mr-2 stroke-[1.5]" />
          <label htmlFor="catalog-sorting-select" className="sr-only">Sort products matrix</label>
          <select
            id="catalog-sorting-select"
            value={currentSort}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-transparent focus:outline-none text-xs font-semibold cursor-pointer text-gray-800 accent-white"
          >
            <option value="featured">Featured Collection</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Customer Rated</option>
            <option value="newest">Newly Discovered</option>
          </select>
        </div>
      </div>
    </div>
  );
}