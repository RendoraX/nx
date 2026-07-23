// components/product/sort-select.tsx
'use client';

import React from 'react';

interface SortSelectProps {
  currentSort: string;
  currentOrder: 'asc' | 'desc' | '';
  onSortChange: (sort: string, order: 'asc' | 'desc' | '') => void;
}

const SORT_OPTIONS = [
  { value: 'newest:desc', label: 'What\'s New' },
  { value: 'price:asc', label: 'Price: Low → High' },
  { value: 'price:desc', label: 'Price: High → Low' },
  { value: 'title:asc', label: 'Name: A → Z' },
  { value: 'title:desc', label: 'Name: Z → A' }
];

export default function SortSelect({ currentSort, currentOrder, onSortChange }: SortSelectProps) {
  // Convert combined component parameters into an active key identifier matching schema keys
  const activeValue = `${currentSort}:${currentOrder || 'desc'}`;

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [sortKey, orderValue] = e.target.value.split(':');
    onSortChange(sortKey, orderValue as 'asc' | 'desc');
  };

  return (
    <div className="flex items-center gap-2.5">
      <label htmlFor="grid-sort-select" className="text-stone-500 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
        Sort By:
      </label>
      <div className="relative">
        <select
          id="grid-sort-select"
          value={activeValue}
          onChange={handleSelect}
          className="bg-white border border-stone-200 text-stone-700 text-[14.1px] font-medium rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:border-amber-900 focus:ring-1 focus:ring-amber-900 shadow-sm appearance-none cursor-pointer"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-3.5 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-stone-500 pointer-events-none" />
      </div>
    </div>
  );
}