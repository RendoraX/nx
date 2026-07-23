'use client';
import React from 'react';
import { InventoryHistoryLog } from '@/types/inventory';

export function StockHistoryTable({ logs, loading }: { logs: InventoryHistoryLog[]; loading: boolean }) {
  console.log('StockHistoryTable logs:', logs);
  if (loading) return <div className="h-40 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-xs text-gray-400 font-mono animate-pulse">Scanning ledger archives...</div>;
  if (!logs.length) return <div className="h-40 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-xs text-gray-400 font-medium">No system adjustments found in the current audit scope.</div>;

  const typeConfig: Record<string, { label: string; text: string }> = {
    purchase: { label: 'Restock Injection', text: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
    manual_correction: { label: 'Admin Balance Drift', text: 'text-gray-700 bg-gray-50 border-gray-200' },
    damaged: { label: 'Damaged Asset Drop', text: 'text-rose-700 bg-rose-50 border-rose-100' },
    lost: { label: 'Lost Inventory Write-Off', text: 'text-rose-700 bg-rose-50 border-rose-100' },
    returned: { label: 'Customer Returns Sync', text: 'text-amber-700 bg-amber-50 border-amber-100' },
    order_reserved: { label: 'Checkout Hold Allocation', text: 'text-blue-700 bg-blue-50 border-blue-100' },
    order_cancelled: { label: 'Cancellation Return', text: 'text-teal-700 bg-teal-50 border-teal-100' },
    order_fulfilled: { label: 'Dispatched Sale Outflow', text: 'text-purple-700 bg-purple-50 border-purple-100' },
  };

  return (
    <div className="w-full overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-2xs">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider">
            <th className="p-4">Transaction Timestamp</th>
            <th className="p-4">Product Name</th>
            <th className="p-4">Trigger Actor</th>
            <th className="p-4 text-center">Operation Event</th>
            <th className="p-4 text-center">Quantity Delta</th>
            <th className="p-4">Audit Statement</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
          {logs.map((log) => {
            const meta = typeConfig[log.action] || { label: log.action, text: 'text-gray-400 bg-gray-50 border-gray-200' };
            return (
              <tr key={log.id} className="hover:bg-gray-50/50 transition-all">
                <td className="p-4 font-mono font-bold text-gray-400 text-[11px]">{log.createdAt}</td>
                <td className="p-4">
                  <p className="font-bold text-gray-900">{log.productName}</p>
                  <p className="text-[10px] text-gray-400 font-mono mt-0.5">{log.sku}</p>
                </td>
                <td className="p-4 text-gray-600 font-semibold">{(logs as any).metadata }</td>
                <td className="p-4 text-center">
                  <span className={`inline-block px-2 py-0.5 text-[9px] border font-bold rounded uppercase tracking-wider ${meta.text}`}>
                    {meta.label}
                  </span>
                </td>
                <td className={`p-4 text-center font-mono font-bold text-sm ${(log as any).metadata?.quantity > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {(log as any).metadata?.quantity > 0 ? `+${(log as any).metadata?.quantity}` : (log as any).metadata?.quantity}
                </td>
                <td className="p-4 text-gray-500 max-w-xs truncate font-medium" title={(log as any).metadata.reasonee}>
                  <p className="text-gray-800 font-semibold">{(log as any).metadata.reason}</p>
                  {(log as any).metadata.notes && <p className="text-[10px] text-gray-400 font-normal italic mt-0.5">{(log as any).metadata.notes}</p>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}