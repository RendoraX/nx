import React from 'react';
import { InventoryItem } from '@/types/inventory';
import { AlertCircle, ArrowUpRight } from 'lucide-react';

interface CardProps { items: InventoryItem[]; onReplenish: (item: InventoryItem) => void; }

export function LowStockPanel({ items, onReplenish }: CardProps) {
  // Available stock directly computed inline to verify alerts against model criteria
  const severeItems = items.filter(i => (i.stock - i.reserved) === 0);
  const warningItems = items.filter(i => (i.stock - i.reserved) > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* SEVERE CRITICAL DEPLETION ROW */}
      <div className="lg:col-span-1 bg-white border border-gray-200 rounded-xl p-4 space-y-3">
        <h3 className="text-xs font-black text-rose-600 uppercase tracking-wider flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4" /> Completely Out Of Stock ({severeItems.length})
        </h3>
        <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
          {severeItems.map(item => (
            <div key={item.id} className="p-3 bg-rose-50/50 border border-rose-100 rounded-lg flex items-center justify-between text-xs font-semibold">
              <div>
                <p className="text-gray-900 font-bold">{item.product?.name as string}</p>
                <p className="text-[10px] text-gray-400 font-mono mt-0.5">{item.product?.sku as string}</p>
              </div>
              <button onClick={() => onReplenish(item)} className="p-1.5 bg-rose-600 text-white font-bold hover:bg-rose-700 text-[10px] uppercase rounded cursor-pointer transition-colors flex items-center gap-0.5">
                Restock <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          ))}
          {!severeItems.length && <p className="text-xs text-gray-400 font-medium text-center py-4">No depleted modules present.</p>}
        </div>
      </div>

      {/* REPLENISHMENT WARNING BUFFER PANEL */}
      <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-4 space-y-3">
        <h3 className="text-xs font-black text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4" /> Low Available Warning Units ({warningItems.length})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[350px] overflow-y-auto pr-1">
          {warningItems.map(item => {
            const available = item.stock - item.reserved;
            return (
              <div key={item.id} className="p-3 bg-amber-50/40 border border-amber-100 rounded-lg flex items-center justify-between text-xs font-semibold">
                <div>
                  <p className="text-gray-900 font-bold">{item.product?.name as string}</p>
                  <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                    Available Units: <span className="text-amber-700 font-bold font-mono">{available}</span> (Phys: {item.stock})
                  </p>
                </div>
                <button onClick={() => onReplenish(item)} className="p-1.5 bg-gray-900 text-white font-bold hover:bg-black text-[10px] uppercase rounded cursor-pointer transition-colors flex items-center gap-0.5">
                  Top Up <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            );
          })}
          {!warningItems.length && <p className="text-xs text-gray-400 font-medium text-center py-4 col-span-2">All balances currently healthy.</p>}
        </div>
      </div>
    </div>
  );
}