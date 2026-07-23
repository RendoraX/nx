// apps/web/components/shop/product-filter.tsx
'use client';

import React from 'react';

interface FilterFacets {
  categories: { id: string; name: string; slug: string; count: number }[];
  priceRange: { min: number; max: number };
}

interface ProductFilterProps {
  facets?: FilterFacets;
  selectedCategory?: string;
  selectedPriceRange: { min: number; max: number };
  onCategoryChange: (slug: string | undefined) => void;
  onPriceChange: (min: number, max: number) => void;
  onReset: () => void;
}

export function ProductFilter({
  facets,
  selectedCategory,
  selectedPriceRange,
  onCategoryChange,
  onPriceChange,
  onReset
}: ProductFilterProps) {
  const categories = facets?.categories || [];
  const maxAvailablePrice = facets?.priceRange.max || 2000;

  return (
    <div className="w-full space-y-12 text-left bg-[#FCFAF7] p-8 border border-[#EAE3D2]/60 backdrop-blur-xs shadow-xs">
      
      {/* 1. ELEGANT EDITORIAL CATEGORY REGISTRY */}
      <div className="space-y-6">
        <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.25em] text-[#2B2B2B] border-b border-[#EAE3D2] pb-3">
          <span>The Collections</span>
        </div>
        
        <div className="flex flex-col space-y-4 pt-1">
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); onCategoryChange(undefined); }}
            className={`group flex items-center justify-between text-[13px] tracking-wide transition-all text-left cursor-pointer duration-300 ${
              !selectedCategory ? 'text-[#1F5E3B] font-medium' : 'text-[#7C7467] hover:text-[#2B2B2B]'
            }`}
          >
            <span className="relative py-1 flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full bg-[#1F5E3B] transition-all duration-300 ${!selectedCategory ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} />
              All Formulations
            </span>
          </button>
          
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={(e) => { e.preventDefault(); onCategoryChange(cat.slug); }}
                className={`group flex items-center justify-between text-[13px] tracking-wide transition-all text-left cursor-pointer duration-300 ${
                  isSelected ? 'text-[#1F5E3B] font-medium' : 'text-[#7C7467] hover:text-[#2B2B2B]'
                }`}
              >
                <span className="relative py-1 flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full bg-[#1F5E3B] transition-all duration-300 ${isSelected ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} />
                  {cat.name}
                </span>
                <span className="text-[10px] font-light tracking-wider text-[#A39785] transition-colors group-hover:text-[#2B2B2B]">
                  [{cat.count}]
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. MINIMALIST SINGLE-LINE DYNAMIC PRICE TRACKER */}
      <div className="space-y-6">
        <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.25em] text-[#2B2B2B] border-b border-[#EAE3D2] pb-3">
          <span>Price Spectrum</span>
          <span className="text-[11px] tracking-wider font-light text-[#A39785] lowercase">
            up to <span className="font-normal text-[#2B2B2B] text-xs font-serif">₹{selectedPriceRange.max}</span>
          </span>
        </div>
        <div className="space-y-4 pt-2">
          <div className="relative w-full flex items-center">
            <input
              type="range"
              min={0}
              max={maxAvailablePrice}
              step={10}
              value={selectedPriceRange.max}
              onChange={(e) => onPriceChange(selectedPriceRange.min, Number(e.target.value))}
              className="w-full accent-[#1F5E3B] h-[1px] bg-[#EAE3D2] rounded-none cursor-pointer appearance-none outline-none"
            />
          </div>
          <div className="flex justify-between items-center text-[10px] tracking-widest text-[#A39785] font-light">
            <span>₹0</span>
            <span>₹{maxAvailablePrice}</span>
          </div>
        </div>
      </div>

      {/* 3. LUXURY RESET ACTION TRIGGER */}
      <div className="pt-4">
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); onReset(); }}
          className="w-full py-4 border border-[#1F5E3B] text-[#1F5E3B] hover:bg-[#1F5E3B] hover:text-[#FCFAF7] text-[11px] font-medium uppercase tracking-[0.25em] transition-all duration-500 cursor-pointer focus:outline-none bg-transparent"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}