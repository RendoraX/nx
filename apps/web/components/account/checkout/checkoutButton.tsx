'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';

interface CheckoutButtonProps {
  onPlaceOrder: () => void;
  isSubmitting: boolean;
  isDisabled: boolean;
  label?: string;
}

export default function CheckoutButton({
  onPlaceOrder,
  isSubmitting,
  isDisabled,
  label = "Confirm Order",
}: CheckoutButtonProps) {
  return (
    <button
      disabled={isDisabled || isSubmitting}
      onClick={onPlaceOrder}
      className="relative flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#C89B3C] text-[10px] font-bold uppercase tracking-[0.16em] text-[#1B3B2B] shadow-md transition-all duration-300 hover:bg-[#D4A747] disabled:cursor-not-allowed disabled:opacity-50 sm:text-[11px] sm:tracking-[0.18em]"
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