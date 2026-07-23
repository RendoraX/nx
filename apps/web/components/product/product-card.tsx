// components/product/product-card.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Eye, ShoppingBag, AlertCircle, Star } from 'lucide-react';
import { Product } from '../../types/product';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Calculate strict brand configuration parameters directly from active relational properties
  const stockConfig = (() => {
    const stock = product.inventory?.stock ?? 0;
    if (stock === 0) {
      return { 
        label: 'Out of Stock', 
        className: 'bg-stone-100 text-[#6B6B6B] border-stone-200', 
        isOutOfStock: true,
        isLowStock: false
      };
    }
    if (stock >= 10 && stock <= 20) {
      return { 
        label: `Only ${stock} Left`, 
        className: 'bg-amber-50 text-[#C89B3C] border-[#C89B3C]/20 animate-pulse', 
        isOutOfStock: false,
        isLowStock: true
      };
    }
    return { 
      label: 'In Stock', 
      className: 'bg-[#6FA36F]/10 text-[#6FA36F] border-[#6FA36F]/20', 
      isOutOfStock: false,
      isLowStock: false
    };
  })();

  return (
    <article className="group bg-white rounded-xl border border-[#E6D5B8]/60 p-5 shadow-[0_2px_8px_rgba(31,94,59,0.02)] hover:shadow-[0_12px_24px_rgba(31,94,59,0.05)] hover:-translate-y-1 transition-all duration-400 flex flex-col h-full relative">
      
      {/* BADGES METADATA LAYER */}
      <div className="absolute top-7 left-7 z-10 flex flex-col gap-1.5 items-start">
        {product.discount && (
          <span className="bg-[#1F5E3B] text-[#FAF8F3] text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-widest shadow-xs">
            {product.discount}
          </span>
        )}
        {product.purityBadge && (
          <span className="bg-white border border-[#C89B3C] text-[#C89B3C] text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-xs">
            {product.purityBadge}
          </span>
        )}
      </div>

      {/* WISHLIST ACTION TRIGGER */}
      <button
        type="button"
        onClick={() => setIsWishlisted(!isWishlisted)}
        className="absolute top-7 right-7 z-10 p-2.5 bg-white/90 backdrop-blur-xs rounded-full border border-[#E6D5B8]/40 shadow-xs hover:bg-white text-[#6B6B6B] hover:text-rose-600 transition-colors focus-visible:outline-2 focus-visible:outline-[#1F5E3B]"
        aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
      </button>

      {/* LUXURY HOVER CANVAS FOR MEDIA */}
      <Link 
        href={`/products/${product.slug}`} 
        className="block relative aspect-square w-full rounded-lg overflow-hidden bg-[#FAF8F3] mb-5 border border-[#E6D5B8]/30"
      >
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0].url}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transform scale-[1.01] group-hover:scale-[1.04] transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-stone-100 flex items-center justify-center text-[11px] text-stone-400 uppercase tracking-widest">
            No Image Provided
          </div>
        )}
        {/* VIEW DETAILS SMOOTH OVERLAY */}
        <div className="absolute inset-0 bg-[#1F5E3B]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="px-4 py-2.5 bg-white text-[#2B2B2B] font-medium rounded-lg text-xs shadow-md border border-[#E6D5B8]/40 flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <Eye className="w-3.5 h-3.5 text-[#C89B3C]" />
            View Product Details
          </span>
        </div>
      </Link>

      {/* CORE PRODUCT METRIC LABELS */}
      <div className="flex flex-col flex-grow text-left">
        <span className="text-[#C89B3C] text-[10px] font-bold uppercase tracking-[0.15em] mb-1.5 block">
          {product.category?.name}
        </span>
        
        <Link href={`/products/${product.id}`} className="focus-visible:outline-2 focus-visible:outline-[#1F5E3B] rounded mb-2">
          <h3 className="font-serif font-bold text-[17px] text-[#2B2B2B] leading-snug line-clamp-2 group-hover:text-[#1F5E3B] transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* STAR RATING WRAPPER */}
        <div className="flex items-center gap-1.5 mb-4">
          <div className="flex items-center text-[#C89B3C]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-current" />
            ))}
          </div>
          <span className="text-xs font-bold text-[#2B2B2B]">{product.rating || '4.8'}</span>
          <span className="text-[#E6D5B8] text-xs">|</span>
          <span className="text-xs text-[#6B6B6B]">({(product.reviewsCount ?? 0)} reviews)</span>
        </div>

        {/* STOCK STATUS FLAGS */}
        <div className="mb-5">
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold border tracking-wide uppercase ${stockConfig.className}`}>
            {stockConfig.isLowStock && <AlertCircle className="w-3 h-3" />}
            {stockConfig.label}
          </span>
        </div>

        {/* LUXURY PRICING AND ACTION MECHANIC ROW */}
        <div className="mt-auto pt-4 border-t border-[#FAF8F3] flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-[19px] text-[#2B2B2B] font-mono">{product.price}</span>
              {product.comparePrice && (
                <span className="text-xs text-[#6B6B6B] line-through font-mono">{product.comparePrice}</span>
              )}
            </div>
            {product.deliveryBadge && (
              <span className="text-[11px] text-[#6FA36F] font-bold block mt-0.5 tracking-wide">
                ✓ {product.deliveryBadge}
              </span>
            )}
          </div>

          <button
            type="button"
            disabled={stockConfig.isOutOfStock}
            className="px-4 py-2.5 bg-[#2B2B2B] hover:bg-[#1F5E3B] text-[#FAF8F3] disabled:bg-stone-100 disabled:text-stone-400 font-bold text-xs uppercase tracking-widest rounded-lg shadow-xs hover:shadow-md transition-all duration-300 flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-[#1F5E3B] cursor-pointer disabled:cursor-not-allowed"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Add To Cart
          </button>
        </div>
      </div>

    </article>
  );
}