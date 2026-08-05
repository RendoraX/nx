'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';

interface CheckoutButtonProps {
  onPlaceOrder: () => void;
  isSubmitting: boolean;
  isDisabled: boolean;
  isMobile?: boolean;
  label?: string;
}

export default function CheckoutButton({
  onPlaceOrder,
  isSubmitting,
  isDisabled,
  isMobile = false,
  label = "Confirm & Authorize",
}: CheckoutButtonProps) {
  if (isMobile) {
    return (
      <button
        disabled={isDisabled || isSubmitting}
        onClick={onPlaceOrder}
        className="flex-1 h-9 bg-[#C89B3C] active:bg-[#D4A747] text-[#1B3B2B] font-bold text-[10px] tracking-[0.16em] uppercase rounded-lg flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50 cursor-pointer transition-all"
      >
        {isSubmitting ? (
          <div className="w-3.5 h-3.5 border-2 border-[#1B3B2B] border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <span>{label}</span>
            <ChevronRight className="w-3 h-3" />
          </>
        )}
      </button>
    );
  }

  return (
    <button
      disabled={isDisabled || isSubmitting}
      onClick={onPlaceOrder}
      className="hidden sm:flex w-full h-11 bg-[#C89B3C] hover:bg-[#D4A747] text-[#1B3B2B] font-bold text-[11px] tracking-[0.18em] uppercase rounded-lg transition-all duration-300 shadow-md items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
    >
      {isSubmitting ? (
        <div className="w-4 h-4 border-2 border-[#1B3B2B] border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          <span>{label}</span>
          <ChevronRight className="w-4 h-4" />
        </>
      )}
    </button>
  );
}