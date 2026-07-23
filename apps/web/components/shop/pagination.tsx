// apps/web/components/shop/pagination.tsx
'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationMeta } from '@/services/product.service';

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function Pagination({ meta, onPageChange }: PaginationProps) {
  const { currentPage, totalPages, hasNextPage, hasPrevPage } = meta;

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 pt-8 border-t border-gray-100 w-full">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevPage}
        className="h-9 px-3 border border-[#E6D5B8]/60 rounded-lg text-gray-600 hover:text-[#1F5E3B] hover:border-[#1F5E3B] disabled:opacity-40 disabled:hover:text-gray-600 disabled:hover:border-[#E6D5B8]/60 disabled:cursor-not-allowed transition-all flex items-center justify-center text-xs font-semibold gap-1 cursor-pointer"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        <span>Previous</span>
      </button>

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`h-9 w-9 text-xs font-mono font-bold rounded-lg transition-all flex items-center justify-center ${currentPage === page ? 'bg-[#1F5E3B] text-white shadow-sm' : 'border border-transparent text-gray-600 hover:bg-[#FAF8F3] hover:border-[#E6D5B8]/40'}`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className="h-9 px-3 border border-[#E6D5B8]/60 rounded-lg text-gray-600 hover:text-[#1F5E3B] hover:border-[#1F5E3B] disabled:opacity-40 disabled:hover:text-gray-600 disabled:hover:border-[#E6D5B8]/60 disabled:cursor-not-allowed transition-all flex items-center justify-center text-xs font-semibold gap-1 cursor-pointer"
      >
        <span>Next</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}