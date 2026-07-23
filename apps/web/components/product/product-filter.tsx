// components/product/product-filters.tsx
'use client';

import React from 'react';
import CategoryFilter from './category-filter';
import PriceFilter from './price-filter';
import { FilterState } from '../../hooks/useProductFilters';

interface ProductFiltersProps {
  filters: FilterState;
  setFilters: (updates: Partial<FilterState>) => void;
  onClearFilters: () => void;
}

export default function ProductFilters({ filters, setFilters, onClearFilters }: ProductFiltersProps) {
  const hasActiveFilters = filters.category || filters.minPrice || filters.maxPrice;

  return (
    <div className="space-y-8">
      
      {/* HEADER CONTROLS ACTIONS MODULE */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between bg-amber-50/40 border border-amber-200/40 p-3 rounded-lg">
          <span className="text-amber-950 text-xs font-bold uppercase tracking-wider">Active Criteria</span>
          <button
            type="button"
            onClick={onClearFilters}
            className="text-amber-900 hover:text-amber-700 text-xs font-bold underline transition-colors"
          >
            Reset All
          </button>
        </div>
      )}

      {/* FILTER STACK */}
      <CategoryFilter
        currentCategory={filters.category}
        onSelectCategory={(category) => setFilters({ category })}
      />

      <PriceFilter
        currentMin={filters.minPrice}
        currentMax={filters.maxPrice}
        onSelectPriceRange={(minPrice, maxPrice) => setFilters({ minPrice, maxPrice })}
      />

    </div>
  );
}