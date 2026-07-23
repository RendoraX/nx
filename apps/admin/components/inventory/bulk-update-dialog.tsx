'use client';
import React, { useState } from 'react';
import { useBulkStockUpdate } from '@/hooks/useInventory';
import { AdjustmentType } from '@/types/inventory';
import { toast } from 'sonner';
import { Layers, X } from 'lucide-react';

interface BulkProps { 
  selectedIds: string[]; 
  clearSelection: () => void; 
  onClose: () => void; 
}

export function BulkUpdateDialog({ selectedIds, clearSelection, onClose }: BulkProps) {
  const { mutateAsync: bulkAdjust, isPending } = useBulkStockUpdate();
  const [type, setType] = useState<AdjustmentType>('purchase');
  const [qty, setQty] = useState('');
  const [reason, setReason] = useState('');

  const handleExecute = async (e: React.FormEvent) => {
    e.preventDefault();
    const parseQty = parseInt(qty, 10);
    if (isNaN(parseQty) || parseQty === 0) return toast.error('Specify non-zero batch step parameters.');
    if (!reason.trim()) return toast.error('Batch adjustments require a valid reason statement.');

    try {
      // Maps to backend service expecting database inventory IDs
      const response = await bulkAdjust({ 
        inventoryIds: selectedIds, 
        type, 
        quantity: parseQty, 
        reason 
      });
      
      toast.success(`Batch adjustment applied across ${response.adjustedCount} products successfully.`);
      clearSelection();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update batch data nodes.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <form onSubmit={handleExecute} className="bg-white border border-gray-200 rounded-xl shadow-xl max-w-sm w-full overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
        <div className="px-5 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Execute Batch Stock Update</h3>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 font-semibold rounded-lg">
            WARNING: This modification applies a relative delta to the primary stock parameters of {selectedIds.length} selected products simultaneously.
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Adjustment Type</label>
              <select value={type} onChange={e => setType(e.target.value as any)} className="w-full p-2.5 bg-white border border-gray-200 rounded-md focus:outline-emerald-500 font-semibold">
                <option value="purchase">Purchase (Restock +)</option>
                <option value="manual_correction">Manual Correction (+/-)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Stock Change Delta</label>
              <input type="number" placeholder="e.g. +100 or -50" value={qty} onChange={e => setQty(e.target.value)} className="w-full p-2.5 border border-gray-200 rounded-md focus:outline-emerald-500 font-bold font-mono" required />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Unified Audit Reason</label>
            <input type="text" placeholder="e.g. Bulk warehouse delivery restocking" value={reason} onChange={e => setReason(e.target.value)} className="w-full p-2.5 border border-gray-200 rounded-md focus:outline-emerald-500 font-medium" required />
          </div>
        </div>

        <div className="px-5 py-3 border-t border-gray-100 flex justify-end gap-2 text-xs font-semibold">
          <button type="button" onClick={onClose} className="px-3 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={isPending} className="px-3 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg shadow-xs disabled:opacity-50">
            {isPending ? 'Processing Batch...' : 'Apply Global Multi-Node Run'}
          </button>
        </div>
      </form>
    </div>
  );
}