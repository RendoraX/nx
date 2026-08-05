'use client';
import React from 'react';
import Link from 'next/link';
import { Eye } from 'lucide-react';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: string;
  variantId?: string;
  productName?: string;
  sku?: string;
}

export interface StatusHistoryItem {
  id: string;
  orderId: string;
  status: string;
  note?: string | null;
  changedBy?: string | null;
  createdAt: string;
}

export interface OrderDetails {
  id: string;
  userId: string;
  addressId: string;
  subtotal: string;
  shippingAmount: string;
  totalAmount: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
  statusHistory?: StatusHistoryItem[];
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role?: string;
  };
  Address?: {
    id: string;
    fullName: string;
    phone: string;
    line1: string;
    line2?: string;
    postalCode: string;
  };
  payment?: {
    id: string;
    provider: string;
    status: string;
    amount: string;
  };
}

interface TableProps {
  items: OrderDetails[];
  loading: boolean;
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200',
  PACKED: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  SHIPPED: 'bg-purple-50 text-purple-700 border-purple-200',
  DELIVERED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  CANCELLED: 'bg-rose-50 text-rose-700 border-rose-200',
};

export function OrderTable({ items, loading }: TableProps) {
  if (loading) {
    return (
      <div className="p-12 text-center text-xs font-mono text-gray-400 bg-white border border-gray-200 rounded-xl">
        Evaluating incoming transaction queues...
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-2xs">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider select-none">
            <th className="p-4">Order Identity</th>
            <th className="p-4">Customer Profile</th>
            <th className="p-4">Shipping Destination</th>
            <th className="p-4">Payment</th>
            <th className="p-4">Flow Status</th>
            <th className="p-4 text-right">Total Net</th>
            <th className="p-4 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
          {items.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50/50 transition-all">
              <td className="p-4 font-bold font-mono text-gray-900 uppercase">
                #{order.id.slice(-7)}
              </td>
              <td className="p-4">
                <p className="font-bold text-gray-900">{order.user?.name || order.Address?.fullName || 'N/A'}</p>
                <p className="text-[10px] text-gray-400 font-mono mt-0.5">{order.user?.email || 'N/A'}</p>
              </td>
              <td className="p-4 text-gray-500 max-w-xs truncate">
                <p className="font-semibold text-gray-800">{order.Address?.line1 || 'No address set'}</p>
                <p className="text-[10px] text-gray-400 font-mono">{order.Address?.postalCode} | {order.Address?.phone}</p>
              </td>
              <td className="p-4">
                <p className="font-semibold uppercase text-gray-800">{order.payment?.provider || 'ONLINE'}</p>
                <span className="text-[10px] text-gray-400 block font-mono">{order.payment?.status || 'PENDING'}</span>
              </td>
              <td className="p-4">
                <span className={`inline-block px-2 py-0.5 border text-[9px] font-black rounded-sm uppercase tracking-wider ${STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-700'}`}>
                  {order.status}
                </span>
              </td>
              <td className="p-4 text-right font-black font-mono text-gray-900">
                ₹{Number(order.totalAmount || 0).toFixed(2)}
              </td>
              <td className="p-4 text-center">
                <Link
                  href={`/orders/${order.id}`}
                  className="inline-flex p-1.5 border border-gray-200 hover:border-gray-900 hover:bg-gray-900 hover:text-white text-gray-500 rounded-lg transition-all"
                >
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