'use client';
import React from 'react';
import { OrderDetails } from '@/types/orders';
import Link from 'next/link';
import { Eye } from 'lucide-react';

interface TableProps { items: OrderDetails[]; loading: boolean; }

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700 border-amber-100',
  CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-100',
  PACKED: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  SHIPPED: 'bg-purple-50 text-purple-700 border-purple-100',
  DELIVERED: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  CANCELLED: 'bg-rose-50 text-rose-700 border-rose-100',
};

export function OrderTable({ items, loading }: TableProps) {
  if (loading) return <div className="p-12 text-center text-xs font-mono text-gray-400 bg-white border rounded-xl">Evaluating incoming transaction queues...</div>;

  return (
    <div className="w-full overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-2xs">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider select-none">
            <th className="p-4">Order Identity</th>
            <th className="p-4">Customer profile</th>
            <th className="p-4">Items Buffer</th>
            <th className="p-4">Payment</th>
            <th className="p-4">Flow Status</th>
            <th className="p-4 text-right">Total Net</th>
            <th className="p-4 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
          {items.map(order => (
            <tr key={order.id} className="hover:bg-gray-50/50 transition-all">
              <td className="p-4 font-bold font-mono text-gray-900 uppercase">#{order.id.slice(-7)}</td>
              <td className="p-4">
                <p className="font-bold text-gray-900">{order.customer.name}</p>
                <p className="text-[10px] text-gray-400 font-mono mt-0.5">{order.customer.email}</p>
              </td>
              <td className="p-4 text-gray-500 max-w-xs truncate">
                {order.items.map(i => `${i.productName} (x${i.quantity})`).join(', ')}
              </td>
              <td className="p-4">
                <p className="font-semibold uppercase text-gray-800">{order.payment.method}</p>
                <span className="text-[10px] text-gray-400 block font-mono">{order.payment.status}</span>
              </td>
              <td className="p-4">
                <span className={`inline-block px-2 py-0.5 border text-[9px] font-black rounded-sm uppercase tracking-wider ${STATUS_STYLES[order.status]}`}>
                  {order.status}
                </span>
              </td>
              <td className="p-4 text-right font-black font-mono text-gray-900">${Number(order.amount).toFixed(2)}</td>
              <td className="p-4 text-center">
                <Link href={`/orders/${order.id}`} className="inline-flex p-1.5 border border-gray-200 hover:border-gray-900 hover:bg-gray-900 hover:text-white text-gray-500 rounded-lg transition-all">
                  <Eye className="w-3.5 h-3.5" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}