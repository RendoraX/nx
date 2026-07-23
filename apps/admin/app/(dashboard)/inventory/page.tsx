'use client';
import React, { useState } from 'react';
import { useInventory } from '@/hooks/useInventory';
import { InventoryItem } from '@/types/inventory';
import { InventorySummaryCards } from '@/components/inventory/inventory-summary';
import { InventoryFilters } from '@/components/inventory/inventory-filters';
import { InventoryTable } from '@/components/inventory/inventory-table';
import { StockAdjustDialog } from '@/components/inventory/stock-adjust-dialog';
import { BulkUpdateDialog } from '@/components/inventory/bulk-update-dialog';
import Link from 'next/link';
import { History, AlertTriangle } from 'lucide-react';

export default function InventoryDashboardRoot() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeAdjustTarget, setActiveAdjustTarget] = useState<InventoryItem | null>(null);
  const [showBulkModal, setShowBulkModal] = useState(false);

  // CRITICAL FIX: Invoke without filter parameters. 
  // TanStack Query will fetch the dataset ONCE, cache it, and fire ZERO network requests when typing.
  const { inventory, loading } = useInventory();

  // Optimized client-side filtration logic operating purely in memory
  const filteredItems = inventory.filter(item => {
    const productName = item.product?.name?.toLowerCase() ?? '';
    const sku = item.product?.sku?.toLowerCase() ?? '';
    const query = search.trim().toLowerCase();

    // 1. Text Search Matching Pipeline
    const matchesSearch = !query || productName.includes(query) || sku.includes(query);

    // 2. Status Matrix Threshold Matching Pipeline
    const availableStock = item.stock - item.reserved;
    let matchesStatus = true;
    
    if (status === 'in_stock') matchesStatus = availableStock > 10;
    else if (status === 'low_stock') matchesStatus = availableStock > 0 && availableStock <= 10;
    else if (status === 'out_of_stock') matchesStatus = availableStock <= 0;

    return matchesSearch && matchesStatus;
  });

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleToggleSelectAll = (allIds: string[]) => {
    setSelectedIds(prev => prev.length === allIds.length ? [] : allIds);
  };

  return (
    <div className="space-y-4 animate-in fade-in-50 duration-150 text-xs">
      {/* MODULE HEADER BAR CONTEXT */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-gray-200 gap-2">
        <div>
          <h2 className="text-base font-black text-gray-900 uppercase tracking-wider">Inventory Master Control</h2>
          <p className="text-xs text-gray-400">Atomic real-time allocation logging interface engine.</p>
        </div>
        <div className="flex items-center gap-1.5 font-bold">
          <Link href="/inventory/history" className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-gray-600 transition-all">
            <History className="w-3.5 h-3.5 text-gray-400" /> Timeline Logs
          </Link>
          <Link href="/inventory/low-stock" className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-gray-600 transition-all">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Threshold Alerts
          </Link>
        </div>
      </div>

      <InventorySummaryCards />

      <InventoryFilters 
        search={search} 
        setSearch={setSearch} 
        status={status} 
        setStatus={setStatus} 
        onBulkClick={() => setShowBulkModal(true)}
        isBulkDisabled={selectedIds.length === 0}
      />

      <InventoryTable 
        items={filteredItems} 
        loading={loading} 
        selectedIds={selectedIds}
        toggleSelect={handleToggleSelect}
        toggleSelectAll={handleToggleSelectAll}
        onAdjustClick={setActiveAdjustTarget}
      />

      {activeAdjustTarget && (
        <StockAdjustDialog item={activeAdjustTarget} onClose={() => setActiveAdjustTarget(null)} />
      )}

      {showBulkModal && (
        <BulkUpdateDialog 
          selectedIds={selectedIds} 
          clearSelection={() => setSelectedIds([])} 
          onClose={() => setShowBulkModal(false)} 
        />
      )}
    </div>
  );
}