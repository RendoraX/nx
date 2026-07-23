// components/product/pagination.tsx
'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // Generate sequence ranges for numerical buttons dynamically
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Calculate sliding parameters around the currently selected active node boundary
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);

      if (currentPage <= 3) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav 
      role="navigation" 
      aria-label="Pagination Navigation" 
      className="flex items-center justify-center gap-1.5 py-8 border-t border-stone-200/60 mt-12"
    >
      
      {/* --- PREVIOUS BLOCK TRIGGER BUTTON --- */}
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="p-2.5 rounded-lg border border-stone-200 bg-white text-stone-600 disabled:bg-stone-50 disabled:text-stone-300 hover:bg-stone-50 transition-colors shadow-sm focus-visible:outline-2 focus-visible:outline-amber-900 focus-visible:outline-offset-2 cursor-pointer disabled:cursor-not-allowed"
        aria-label="Go to previous catalog page"
      >
        <ChevronLeft className="w-4 h-4" aria-hidden="true" />
      </button>

      {/* --- SYSTEM NUMERICAL STEPS ITERATION --- */}
      {pages[0] > 1 && (
        <>
          <button
            type="button"
            onClick={() => onPageChange(1)}
            className="min-w-[40px] h-10 flex items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-600 font-medium text-[14.1px] hover:bg-stone-50 transition-all focus-visible:outline-2 focus-visible:outline-amber-900"
            aria-label="Go to page 1"
          >
            1
          </button>
          {pages[0] > 2 && (
            <span className="px-1.5 text-stone-400 font-medium tracking-wider" aria-hidden="true">
              ...
            </span>
          )}
        </>
      )}

      {pages.map((page) => {
        const isActive = page === currentPage;
        return (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-current={isActive ? 'page' : undefined}
            className={`min-w-[40px] h-10 flex items-center justify-center rounded-lg text-[14.1px] font-bold tracking-wide transition-all shadow-sm focus-visible:outline-2 focus-visible:outline-amber-900 focus-visible:outline-offset-2 cursor-pointer ${
              isActive
                ? 'bg-amber-900 text-white border border-amber-900'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
            aria-label={`Go to page ${page}`}
          >
            {page}
          </button>
        );
      })}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && (
            <span className="px-1.5 text-stone-400 font-medium tracking-wider" aria-hidden="true">
              ...
            </span>
          )}
          <button
            type="button"
            onClick={() => onPageChange(totalPages)}
            className="min-w-[40px] h-10 flex items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-600 font-medium text-[14.1px] hover:bg-stone-50 transition-all focus-visible:outline-2 focus-visible:outline-amber-900"
            aria-label={`Go to final page ${totalPages}`}
          >
            {totalPages}
          </button>
        </>
      )}

      {/* --- NEXT BLOCK TRIGGER BUTTON --- */}
      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="p-2.5 rounded-lg border border-stone-200 bg-white text-stone-600 disabled:bg-stone-50 disabled:text-stone-300 hover:bg-stone-50 transition-colors shadow-sm focus-visible:outline-2 focus-visible:outline-amber-900 focus-visible:outline-offset-2 cursor-pointer disabled:cursor-not-allowed"
        aria-label="Go to next catalog page"
      >
        <ChevronRight className="w-4 h-4" aria-hidden="true" />
      </button>

    </nav>
  );
}