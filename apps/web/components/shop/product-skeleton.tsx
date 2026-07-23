// apps/web/components/shop/product-skeleton.tsx
import React from 'react';

export function ProductSkeleton() {
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden flex flex-col h-full animate-pulse">
      <div className="aspect-square w-full bg-gray-100" />
      <div className="p-5 flex-1 space-y-4">
        <div className="space-y-2">
          <div className="h-3 w-1/4 bg-gray-100 rounded" />
          <div className="h-4 w-3/4 bg-gray-100 rounded" />
          <div className="space-y-1 pt-1">
            <div className="h-2.5 w-full bg-gray-100 rounded" />
            <div className="h-2.5 w-5/6 bg-gray-100 rounded" />
          </div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="h-4 w-1/3 bg-gray-100 rounded" />
          <div className="h-7 w-7 bg-gray-100 rounded-lg" />
        </div>
      </div>
    </div>
  );
}