// components/product/category-filter.tsx
'use client';

import React from 'react';

interface CategoryFilterProps {
  currentCategory: string;
  onSelectCategory: (category: string) => void;
}

// Fixed master schema parameters
const CATEGORY_OPTIONS = [
  { slug: '', name: 'All Categories', count: 486 },
  { slug: 'raw-herbs', name: 'Raw Herbs & Powders', count: 142 },
  { slug: 'cold-oils', name: 'Cold Pressed Oils', count: 12 },
  { slug: 'ayurvedic-medicines', name: 'Ayurvedic Medicines', count: 84 },
  { slug: 'ritual-essentials', name: 'Ritual Essentials', count: 203 },
  { slug: 'brass-items', name: 'Premium Brassware', count: 45 }
];

export default function CategoryFilter({ currentCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="space-y-3 text-left">
      <h3 className="font-serif text-[16.2px] font-bold text-stone-900 tracking-tight">
        Product Categories
      </h3>
      <div className="h-[1px] bg-stone-200/60 w-full" />
      <nav className="flex flex-col gap-1" aria-label="Filter by category">
        {CATEGORY_OPTIONS.map((cat) => {
          const isActive = currentCategory === cat.slug;
          return (
            <button
              key={cat.slug}
              type="button"
              onClick={() => onSelectCategory(cat.slug)}
              className={`w-full flex items-center justify-between px-3 py-2 text-[14.1px] font-medium rounded-lg transition-all text-left group ${
                isActive
                  ? 'bg-amber-50 text-amber-950 font-bold'
                  : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="truncate tracking-wide">{cat.name}</span>
              <span className={`text-[12.1px] font-mono px-2 py-0.5 rounded-full border ${
                isActive 
                  ? 'bg-amber-100/60 border-amber-200 text-amber-900' 
                  : 'bg-stone-50 border-stone-200/40 text-stone-400 group-hover:border-stone-200'
              }`}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}