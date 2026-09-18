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
        className="relative flex h-11 min-w-[150px] flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#C89B3C] px-4 text-[10px] font-bold uppercase tracking-[0.16em] text-[#1B3B2B] shadow-md transition-all active:bg-[#D4A747] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#1B3B2B] border-t-transparent" />
        ) : (
          <>
            <span className="whitespace-nowrap">{label}</span>
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
      className="relative hidden h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#C89B3C] text-[11px] font-bold uppercase tracking-[0.18em] text-[#1B3B2B] shadow-md transition-all duration-300 hover:bg-[#D4A747] disabled:cursor-not-allowed disabled:opacity-50 sm:flex"
    >
      {isSubmitting ? (
        <div className="w-4 h-4 border-2 border-[#1B3B2B] border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          <span className="whitespace-nowrap">{label}</span>
          <ChevronRight className="w-4 h-4" />
        </>
      )}
    </button>
  );
}