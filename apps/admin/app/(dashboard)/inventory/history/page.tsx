'use client';
import React, { useState } from 'react';
import { useInventoryHistory } from '@/hooks/useInventory';
import { StockHistoryTable } from '@/components/inventory/stock-history-table';
import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';

export default function InventoryHistoryTimelineRoute() {
  const [actionFilter, setActionFilter] = useState('all');
  const { history, loading } = useInventoryHistory(actionFilter !== 'all' ? { action: actionFilter } : undefined);

  return (
    <div className="space-y-4 animate-in fade-in-50 duration-150 text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Link href="/inventory" className="p-2 border border-gray-200 bg-white hover:bg-gray-50 rounded-lg text-gray-600 transition-all group shadow-2xs">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          </Link>
          <div>
            <h2 className="text-base font-black text-gray-900 uppercase tracking-wider">Audit History Log</h2>
            <p className="text-xs text-gray-400">Immutable ledger transaction reporting pipeline.</p>
          </div>
        </div>
        
        <select 
          value={actionFilter} 
          onChange={e => setActionFilter(e.target.value)}
          className="text-xs p-2 border border-gray-200 rounded-lg bg-white font-semibold text-gray-600 focus:outline-emerald-500 cursor-pointer"
        >
          <option value="all">Action Scope: Complete Log</option>
          <option value="purchase">Supplier Purchases</option>
          <option value="manual_correction">Manual Baseline Toggles</option>
          <option value="damaged">Damaged Asset Claims</option>
          <option value="order_fulfilled">Completed Dispatch Deductions</option>
        </select>
      </div>

      <StockHistoryTable logs={history} loading={loading} />
    </div>
  );
}