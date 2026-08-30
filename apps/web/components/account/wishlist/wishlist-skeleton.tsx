import React from 'react';

export function WishlistSkeleton() {
  return (
    <div className="w-full bg-white border border-[#EAE3D2] p-2.5 sm:p-4 rounded-2xs sm:rounded-sm animate-pulse space-y-3">
      {/* Image Skeleton */}
      <div className="w-full aspect-square bg-[#EAE3D2]/40 rounded-2xs" />
      
      {/* Details Skeleton */}
      <div className="space-y-2 pt-1">
        <div className="h-2.5 w-1/3 bg-[#EAE3D2]/60 rounded-2xs" />
        <div className="h-4 w-4/5 bg-[#EAE3D2]/80 rounded-2xs" />
        <div className="h-3 w-1/2 bg-[#EAE3D2]/60 rounded-2xs" />
      </div>

      {/* Button Actions Skeleton */}
      <div className="pt-2 flex items-center gap-2">
        <div className="h-9 flex-1 bg-[#EAE3D2]/60 rounded-2xs" />
        <div className="h-9 w-9 bg-[#EAE3D2]/40 rounded-2xs shrink-0" />
      </div>
    </div>
  );
}