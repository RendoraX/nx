// components/product/product-grid.tsx
'use client';

import React from 'react';
import ProductCard from './product-card';
import { Product } from '../../types/product';
import EmptyProducts from './empty-products';
import { Sparkles, Compass, ShieldCheck } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  onClearFilters?: () => void;
}

export default function ProductGrid({ products, onClearFilters }: ProductGridProps) {
  if (!products || products.length === 0) {
    return <EmptyProducts onClearFilters={onClearFilters} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 items-stretch">
      {products.map((product, index) => {
        return (
          <React.Fragment key={product.id}>
            {/* INJECT HIGH-END PREMIUM CONTENT BANNER AT SYSTEM INDEX POSITION 2 */}
            {index === 2 && (
              <div className="sm:col-span-2 xl:col-span-2 bg-[#1F5E3B] text-[#FAF8F3] rounded-xl p-8 md:p-10 flex flex-col justify-between border border-[#C89B3C]/20 shadow-[0_4px_20px_rgba(31,94,59,0.08)] relative overflow-hidden group min-h-[340px]">
                
                {/* Micro Ambient Glow Accents */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute top-0 right-16 w-[1px] h-full bg-gradient-to-b from-[#C89B3C]/20 via-transparent to-transparent hidden md:block" />

                <div className="space-y-4 max-w-lg z-10 text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/10 rounded-md text-[10px] font-bold text-[#E6D5B8] uppercase tracking-[0.2em]">
                    <Sparkles className="w-3.5 h-3.5 text-[#C89B3C]" /> Purity Manifesto
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl font-normal text-white leading-tight tracking-tight">
                    Untouched by haste. <br />
                    <span className="italic font-light text-[#E6D5B8]">Validated by legacy knowledge.</span>
                  </h3>
                  <p className="text-[#FAF8F3]/80 text-xs md:text-sm leading-relaxed max-w-md font-medium">
                    We refuse to accept cut-rate components or unverified fast processing methods. Every single botanical harvest is indexed under rigorous ceremonial and chemical cleanliness benchmarks.
                  </p>
                </div>

                <div className="pt-6 border-t border-white/10 flex flex-wrap gap-6 items-center text-[10px] font-bold text-[#FAF8F3] uppercase tracking-widest z-10">
                  <span className="flex items-center gap-1.5"><Compass className="w-3.5 h-3.5 text-[#C89B3C]" /> 100% Traceable</span>
                  <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[#C89B3C]" /> Honest Fair Margins</span>
                </div>
              </div>
            )}

            {/* Standard Product Card */}
            <ProductCard product={product} />
          </React.Fragment>
        );
      })}
    </div>
  );
}