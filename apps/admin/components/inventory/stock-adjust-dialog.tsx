'use client';
import React, { useState } from 'react';
import { useAdjustStock } from '@/hooks/useInventory';
import { InventoryItem, AdjustmentType } from '@/types/inventory';
import { toast } from 'sonner';
import { X, ShieldAlert } from 'lucide-react';

interface AdjustProps { item: InventoryItem; onClose: () => void; }

// Combined configuration: defines the value, display name, and intended mathematical direction
const REASON_CONFIG: { value: AdjustmentType; label: string; direction: 'add' | 'remove' }[] = [
  { value: 'purchase', label: 'Purchase Restock (+)', direction: 'add' },
  { value: 'returned', label: 'Customer Return (+)', direction: 'add' },
  { value: 'manual_correction', label: 'Manual Correction (+/-)', direction: 'add' }, // Defaults positive, absolute value controls negative manually if needed
  { value: 'damaged', label: 'Damaged Inventory (-)', direction: 'remove' },
  { value: 'lost', label: 'Lost Asset Write-Off (-)', direction: 'remove' },
  { value: 'promotion_sample', label: 'Promo Sample Outflow (-)', direction: 'remove' },
];

export function StockAdjustDialog({ item, onClose }: AdjustProps) {
  const { mutateAsync: adjustStock, isPending } = useAdjustStock();
  const [selectedReason, setSelectedReason] = useState<AdjustmentType>('purchase');
  const [rawQty, setRawQty] = useState<string>('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  const availableStock = item.stock - item.reserved;

  const handleCommit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const parsedAmount = parseInt(rawQty, 10);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return toast.error('Enter a valid positive number for the quantity field.');
    }
    
    if (!reason.trim()) {
      return toast.error('Audit trail history requires an authorization statement.');
    }

    // Automatically determine positive or negative sign based on selected reason item
    const config = REASON_CONFIG.find(r => r.value === selectedReason);
    const finalDelta = config?.direction === 'remove' ? -parsedAmount : parsedAmount;

    // Guardrail validation checks
    if (item.stock + finalDelta < 0) {
      return toast.error('Transaction rejected: Physical total stock cannot fall below zero.');
    }
    if ((item.stock + finalDelta) - item.reserved < 0) {
      return toast.error('Transaction rejected: Available stock cannot fall below existing reservations.');
    }

    try {
      await adjustStock({ 
        inventoryId: item.id, 
        type: selectedReason, 
        quantity: finalDelta, 
        reason, 
        notes,
        direction: config?.direction as string
      });
      toast.success('Inventory balance updated successfully');
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Error executing ledger action');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <form onSubmit={handleCommit} className="bg-white border border-gray-200 rounded-xl shadow-xl max-w-md w-full overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
        <div className="px-5 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Log Product Stock Adjustment</h3>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 font-medium">
            <p className="text-gray-900 font-bold">{item.product?.name ?? 'Unknown variant mapping'}</p>
            <p className="text-[10px] text-gray-400 font-mono mt-0.5">SKU Reference Identifier: {item.product?.sku}</p>
            <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-gray-200 text-center font-mono text-[10px]">
              <div><span className="block text-gray-400">Available</span><span className="font-bold text-gray-800">{availableStock}</span></div>
              <div><span className="block text-gray-400">Reserved</span><span className="font-bold text-blue-600">{item.reserved}</span></div>
              <div><span className="block text-gray-400">Physical Total</span><span className="font-bold text-gray-800">{item.stock}</span></div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Adjustment Reason Category</label>
              <select 
                value={selectedReason} 
                onChange={e => setSelectedReason(e.target.value as AdjustmentType)} 
                className="w-full p-2.5 bg-white border border-gray-200 rounded-md focus:outline-emerald-500 font-semibold text-gray-700"
              >
                {REASON_CONFIG.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Quantity Units</label>
              <input 
                type="number" 
                min="1"
                placeholder="e.g. 10 (Sign is automatic)" 
                value={rawQty} 
                onChange={e => setRawQty(e.target.value)} 
                className="w-full p-2.5 border border-gray-200 rounded-md focus:outline-emerald-500 font-bold font-mono text-gray-800" 
                required 
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Authorization Reason Summary</label>
            <input type="text" placeholder="e.g., Supplier delivery validation reference" value={reason} onChange={e => setReason(e.target.value)} className="w-full p-2.5 border border-gray-200 rounded-md focus:outline-emerald-500 font-medium text-gray-700" required />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Extended Append Notes (Optional)</label>
            <textarea rows={2} placeholder="Add extended execution details..." value={notes} onChange={e => setNotes(e.target.value)} className="w-full p-2.5 border border-gray-200 rounded-md focus:outline-emerald-500 font-medium text-gray-700" />
          </div>
        </div>

        <div className="px-5 py-3 border-t border-gray-100 flex justify-end gap-2 text-xs font-semibold">
          <button type="button" onClick={onClose} className="px-3 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50">Discard</button>
          <button type="submit" disabled={isPending} className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs disabled:opacity-50">
            {isPending ? 'Processing Ledger...' : 'Commit Operational Update'}
          </button>
        </div>
      </form>
    </div>
  );
}