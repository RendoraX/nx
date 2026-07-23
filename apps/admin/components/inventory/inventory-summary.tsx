import React from 'react';
import { useInventorySummary } from '@/hooks/useInventory';
import { Package, AlertTriangle, XCircle, ShieldAlert } from 'lucide-react';

export function InventorySummaryCards() {
  const { summary, loading } = useInventorySummary();

  const cards = [
    { title: 'Total Products', value: summary?.totalProducts ?? 0, icon: Package, color: 'text-gray-600 bg-gray-50' },
    { title: 'Healthy Stock', value: summary?.totalHealthyCount ?? 0, icon: Package, color: 'text-emerald-600 bg-emerald-50' },
    { title: 'Low Stock Alert', value: summary?.lowStockAlert ?? 0, icon: AlertTriangle, color: 'text-amber-600 bg-amber-50' },
    { title: 'Out of Stock', value: summary?.outOfStock ?? 0, icon: XCircle, color: 'text-rose-600 bg-rose-50' },
    { title: 'Reserved Allocation', value: summary?.reservedUnits ?? 0, icon: ShieldAlert, color: 'text-blue-600 bg-blue-50' },
  ];

  if (loading) {
    return <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 h-20 animate-pulse bg-gray-100 rounded-xl" />;
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div key={i} className="bg-white border border-gray-200 p-4 rounded-xl shadow-2xs flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{c.title}</p>
              <p className="text-xl font-black text-gray-900">{c.value}</p>
            </div>
            <div className={`p-2 rounded-lg ${c.color}`}><Icon className="w-4 h-4" /></div>
          </div>
        );
      })}
    </div>
  );
}