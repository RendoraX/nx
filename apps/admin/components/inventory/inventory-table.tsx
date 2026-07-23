'use client';
import React from 'react';
import { InventoryItem, InventoryStatus } from '@/types/inventory';
import { StockStatusBadge } from './stock-status-badge';
import { Edit } from 'lucide-react';

interface TableProps {
  items: InventoryItem[];
  loading: boolean;
  selectedIds: string[];
  toggleSelect: (id: string) => void;
  toggleSelectAll: (allIds: string[]) => void;
  onAdjustClick: (item: InventoryItem) => void;
}

export function InventoryTable({ items, loading, selectedIds, toggleSelect, toggleSelectAll, onAdjustClick }: TableProps) {
  

  if (loading) {
    return (
      <div className="w-full h-40 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-xs text-gray-400 font-mono">
        Loading inventory data cells...
      </div>
    );
  }

console.log(items)
  const allAvailableIds = items.map(i => i.id);
  const isAllSelected = items.length > 0 && selectedIds.length === items.length;

  // Helper method to determine the dynamic stock alert flag dynamically from state logic
  const determineStatus = (available: number): InventoryStatus => {
    if (available <= 0) return 'out_of_stock';
    if (available <= 10) return 'low_stock'; // Default fallback threshold boundary metrics
    return 'in_stock';
  };

  return (
    <div className="w-full overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-2xs">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider select-none">
            <th className="p-4 w-10">
              <input 
                type="checkbox" 
                checked={isAllSelected} 
                onChange={() => toggleSelectAll(allAvailableIds)} 
                className="cursor-pointer rounded accent-emerald-600" 
              />
            </th>
            <th className="p-4">Product Name</th>
            <th className="p-4">SKU Identity</th>
            <th className="p-4 text-center">Available Stock</th>
            <th className="p-4 text-center">Unit</th>
            <th className="p-4 text-center">Physical Total</th>
            <th className="p-4 text-center">Status</th>
            <th className="p-4 text-right w-16">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
          {items.map(item => {
            // Extract attributes from Prisma schema nested payload safely
            const productName = item.product?.name ?? 'Unknown Product Model Link';
            const skuKey = item.product?.sku ?? item.productId ?? 'N/A';
            
            // Core Business Metric Calculations
            const availableStock = item.stock - item.reserved;
            const currentStatus = item.status ?? determineStatus(availableStock);

            return (
              <tr key={item.id} className="hover:bg-gray-50/50 transition-all">
                <td className="p-4">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.includes(item.id)} 
                    onChange={() => toggleSelect(item.id)} 
                    className="cursor-pointer rounded accent-emerald-600" 
                  />
                </td>
                <td className="p-4">
                  <p className="font-bold text-gray-900">{productName}</p>
                </td>
                <td className="p-4 font-mono font-bold text-gray-500 text-xs">{skuKey}</td>
                <td className="p-4 text-center font-bold font-mono text-gray-900">{availableStock}</td>
                <td className="p-4 text-center font-bold font-mono text-blue-600 bg-blue-50/30">{item.variant.size}</td>
                <td className="p-4 text-center font-bold font-mono text-gray-600">{item.stock}</td>
                <td className="p-4 text-center">
                  <StockStatusBadge status={currentStatus} />
                </td>
                <td className="p-4 text-right">
                  <button 
                    type="button"
                    onClick={() => onAdjustClick(item)}
                    className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-emerald-600 cursor-pointer border border-transparent hover:border-gray-200 transition-all flex items-center gap-1 mx-auto font-bold"
                  >
                    <Edit className="w-3.5 h-3.5" /> Adjust
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}