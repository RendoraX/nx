// components/product/price-filter.tsx
'use client';

import React from 'react';

interface PriceFilterProps {
  currentMin: string;
  currentMax: string;
  onSelectPriceRange: (min: string, max: string) => void;
}

const PRICE_TIERS = [
  { label: 'All Prices', min: '', max: '' },
  { label: 'Under ₹500', min: '0', max: '500' },
  { label: '₹500 – ₹1,000', min: '500', max: '1000' },
  { label: '₹1,000 – ₹5,000', min: '1000', max: '5000' },
  { label: '₹5,000 & Above', min: '5000', max: '99999' }
];

export default function PriceFilter({ currentMin, currentMax, onSelectPriceRange }: PriceFilterProps) {
  return (
    <div className="space-y-3 text-left">
      <h3 className="font-serif text-[16.2px] font-bold text-stone-900 tracking-tight">
        Filter by Price
      </h3>
      <div className="h-[1px] bg-stone-200/60 w-full" />
      <div className="flex flex-col gap-1">
        {PRICE_TIERS.map((tier, idx) => {
          const isActive = currentMin === tier.min && currentMax === tier.max;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectPriceRange(tier.min, tier.max)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-[14.1px] font-medium rounded-lg transition-colors text-left ${
                isActive
                  ? 'text-amber-950 font-bold bg-amber-50/60'
                  : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
              }`}
            >
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                isActive ? 'border-amber-900 bg-amber-900' : 'border-stone-300 bg-white'
              }`}>
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
              <span className="tracking-wide">{tier.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}