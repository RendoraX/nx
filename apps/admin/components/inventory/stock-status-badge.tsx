import React from 'react';
import { InventoryStatus } from '@/types/inventory';

export function StockStatusBadge({ status }: { status: InventoryStatus }) {
  const config = {
    in_stock: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', text: 'In Stock' },
    low_stock: { bg: 'bg-amber-50 text-amber-700 border-amber-200', text: 'Low Stock' },
    out_of_stock: { bg: 'bg-rose-50 text-rose-700 border-rose-200', text: 'Out of Stock' },
  };

  const active = config[status] || config.out_of_stock;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 border text-[10px] font-bold rounded-full uppercase tracking-wider ${active.bg}`}>
      {active.text}
    </span>
  );
}