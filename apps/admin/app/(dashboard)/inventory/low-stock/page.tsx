'use client';
import React, { useState } from 'react';
import { useInventory } from '@/hooks/useInventory';
import { InventoryItem } from '@/types/inventory';
import { LowStockPanel } from '@/components/inventory/low-stock-card';
import { StockAdjustDialog } from '@/components/inventory/stock-adjust-dialog';
import Link from 'next/link';
import { ArrowLeft, FileDown } from 'lucide-react';
import { toast } from 'sonner';

export default function LowStockExhaustionRoute() {
  const { inventory, loading } = useInventory({ status: 'low_stock' });
  const [replenishTarget, setReplenishTarget] = useState<InventoryItem | null>(null);

  const exportReport = () => {
    toast.success('Compiling inventory replenishment manifest dataset CSV download stream...');
  };

  return (
    <div className="space-y-4 animate-in fade-in-50 duration-150 text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Link href="/inventory" className="p-2 border border-gray-200 bg-white hover:bg-gray-50 rounded-lg text-gray-600 transition-all group shadow-2xs">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          </Link>
          <div>
            <h2 className="text-base font-black text-gray-900 uppercase tracking-wider">Replenishment Operational Pipeline</h2>
            <p className="text-xs text-gray-400">Critical matrix isolating all SKU lines dipping past baseline tolerances.</p>
          </div>
        </div>

        <button 
          onClick={exportReport}
          className="flex items-center gap-1 px-3 py-1.5 bg-gray-900 text-white font-bold hover:bg-black rounded-lg transition-colors cursor-pointer"
        >
          <FileDown className="w-3.5 h-3.5" /> Export Manifest CSV
        </button>
      </div>

      {loading ? (
        <div className="h-32 bg-white border border-gray-200 rounded-xl animate-pulse" />
      ) : (
        <LowStockPanel items={inventory} onReplenish={setReplenishTarget} />
      )}

      {replenishTarget && (
        <StockAdjustDialog item={replenishTarget} onClose={() => setReplenishTarget(null)} />
      )}
    </div>
  );
}