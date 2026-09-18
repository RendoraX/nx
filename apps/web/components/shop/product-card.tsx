// apps/web/components/shop/product-card.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingBag, ArrowRight } from 'lucide-react';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: string | number;
    comparePrice?: string | number | null;
    images: Array<{ id?: string; url: string; [key: string]: any }> | string[];
    inventory?: { stock: number; [key: string]: any } | null;
    rating?: number;
    variants ?: any
  };
  onAddToCart?: (productId: string) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { name, slug, description, price, comparePrice, images, inventory, rating = 5 } = product;
  
  // Normalize Decimal types arriving as string parameters from the database layer
  const parsedPrice = typeof price === 'string' ? parseFloat(price) : price;
  const parsedComparePrice = comparePrice ? (typeof comparePrice === 'string' ? parseFloat(comparePrice) : comparePrice) : null;
  
  const hasDiscount = parsedComparePrice && parsedComparePrice > parsedPrice;
  const discountPercentage = hasDiscount ? Math.round(((parsedComparePrice! - parsedPrice) / parsedComparePrice!) * 100) : 0;
  
  // Map standard inventory schema indicators directly to corporate status
  const inStock = inventory ? inventory.stock > 0 : false;

  // Safely resolve the polymorphic database image structures
  const resolvedImageUrl = images && images.length > 0 
    ? (typeof images[0] === 'string' ? images[0] : images[0]?.url) 
    : '/images/placeholder-apothecary.jpg';

  const handleCartAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart && inStock) {
      onAddToCart(product.id);
    }
  };

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-[#E6D5B8]/40 bg-[#FAF8F3]/40 shadow-[0_4px_18px_rgba(27,59,43,0.03)] transition-all duration-500 ease-out hover:-translate-y-1 hover:border-[#1F5E3B]/40 hover:bg-white hover:shadow-[0_16px_30px_rgba(27,59,43,0.1)]">
      
      {/* Visual Asset Container Panel */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#FAF8F3]">
        {hasDiscount && (
          <div className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-[#C89B3C] text-[#FAF8F3] text-[9px] font-bold uppercase tracking-widest rounded">
            Save {discountPercentage}%
          </div>
        )}
        {!inStock && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-[1px]">
            <span className="rounded bg-gray-900 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-white">
              Currently unavailable
            </span>
          </div>
        )}
        
        <Link href={`/products/${slug}`} className="block w-full h-full relative">
          <Image
            src={resolvedImageUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>
      </div>

      {/* Product Information Context Array */}
      <div className="p-3 min-[420px]:p-5 flex-1 flex flex-col justify-between space-y-3 min-[420px]:space-y-4">
        <div className="space-y-1.5 text-left">
          {/* Rating Matrix Header */}
          <div className="flex items-center gap-1">
            <div className="flex text-[#C89B3C]">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3 h-3 ${i < Math.floor(rating) ? 'fill-current' : 'stroke-[1.25]'}`} 
                />
              ))}
            </div>
            <span className="text-[10px] text-gray-400 font-mono mt-0.5">({rating.toFixed(1)})</span>
          </div>

          {/* Core Descriptive Text Identity */}
          <Link href={`/products/${slug}`} className="block group/title">
            <h3 className="text-xs min-[420px]:text-sm font-serif font-bold text-gray-800 group-hover/title:text-[#1F5E3B] transition-colors duration-300 line-clamp-2 min-[420px]:line-clamp-1">
              {name}
            </h3>
          </Link>
          <p className="text-[11px] text-gray-500 font-medium line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Pricing Actions Matrix Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-[#E6D5B8]/20">
          <div className="flex flex-col text-left">
            {hasDiscount && (
              <span className="text-[10px] text-gray-400 line-through tracking-wider font-mono">
                ₹{parsedComparePrice?.toFixed(2)}
              </span>
            )}
            <span className="text-[11px] min-[420px]:text-xs font-bold text-gray-900 font-mono tracking-wide">
              ₹{parsedPrice.toFixed(2)}
            </span>
          </div>

          {inStock ? (
            <button
              onClick={handleCartAction}
              className="h-8 w-8 rounded-lg border border-[#E6D5B8] group-hover:border-[#1F5E3B] group-hover:bg-[#1F5E3B] text-gray-600 group-hover:text-white transition-all duration-300 flex items-center justify-center cursor-pointer"
              title="Add to cart"
            >
              <ShoppingBag className="w-3.5 h-3.5 stroke-[1.5]" />
            </button>
          ) : (
            <Link 
              href={`/products/${slug}`}
              className="text-[9px] font-bold uppercase tracking-wider text-gray-400 hover:text-[#1F5E3B] flex items-center gap-1 transition-colors"
            >
              <span>View details</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}