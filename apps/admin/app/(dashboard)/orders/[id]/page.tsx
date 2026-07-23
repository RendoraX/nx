'use client';
import React, { use } from 'react';
import { useOrderDetails, useUpdateOrderStatus } from '@/hooks/useOrders';
import { ORDER_TRANSITIONS, OrderStatus } from '@/types/orders';
import { ArrowLeft, User, ShieldCheck, CreditCard, Box, Calendar, FileText } from 'lucide-react';
import Link from 'next/link';

export default function OrderDetailsManagementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: order, isLoading } = useOrderDetails(id);
  const { mutateAsync: shiftStatus, isPending } = useUpdateOrderStatus(id);

  if (isLoading || !order) return <div className="p-10 text-center text-xs font-mono text-gray-400">Loading order timeline state maps...</div>;

  const validNextActions = ORDER_TRANSITIONS[order.status] || [];

  return (
    <div className="space-y-4 text-xs">
      <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
        <Link href="/orders" className="p-1.5 hover:bg-gray-100 rounded-lg border border-gray-200"><ArrowLeft className="w-4 h-4" /></Link>
        <div>
          <h2 className="text-base font-black uppercase text-gray-900 tracking-wider">Order Audit Workspace</h2>
          <p className="text-xs text-gray-400 font-mono">ID: {order.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        <div className="lg:col-span-2 space-y-4">
          {/* Section 1: Order Summary */}
          <div className="bg-white p-4 border border-gray-200 rounded-xl space-y-2">
            <h3 className="font-bold border-b pb-1 text-gray-900 uppercase tracking-wider flex items-center gap-1.5 text-[10px] text-gray-400"><Box className="w-3.5 h-3.5" /> Order Summary</h3>
            <div className="grid grid-cols-2 gap-4 pt-1 font-medium">
              <div><p className="text-gray-400">Date Logged</p><p className="font-bold text-gray-800">{new Date(order.createdAt).toLocaleString()}</p></div>
              <div><p className="text-gray-400">Current Tracking Status</p><span className="inline-block mt-0.5 px-2 py-0.5 bg-gray-900 text-white font-black text-[9px] rounded uppercase">{order.status}</span></div>
            </div>
          </div>

          {/* Section 2: Products */}
          <div className="bg-white p-4 border border-gray-200 rounded-xl space-y-2">
            <h3 className="font-bold border-b pb-1 text-gray-900 uppercase tracking-wider flex items-center gap-1.5 text-[10px] text-gray-400"><Box className="w-3.5 h-3.5" /> Line Items</h3>
            <div className="divide-y divide-gray-100 font-medium">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between py-2.5 items-center">
                  <div>
                    <p className="font-bold text-gray-900">{item.productName}</p>
                    <p className="text-[10px] text-gray-400 font-mono">SKU: {item.sku}</p>
                  </div>
                  <p className="font-mono text-gray-900 font-bold">{item.quantity} x ${Number(item.price).toFixed(2)}</p>
                </div>
              ))}
              <div className="pt-3 flex justify-end font-black font-mono text-sm text-gray-900">
                Total Net Charge: ${Number(order.amount).toFixed(2)}
              </div>
            </div>
          </div>

          {/* Section 3: Customer & Shipping */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-4 border border-gray-200 rounded-xl space-y-2">
              <h3 className="font-bold border-b pb-1 text-gray-900 uppercase tracking-wider flex items-center gap-1.5 text-[10px] text-gray-400"><User className="w-3.5 h-3.5" /> Profile Target</h3>
              <p className="font-bold text-gray-900">{order.customer.name}</p>
              <p className="font-mono text-gray-400">{order.customer.email}</p>
            </div>
            <div className="bg-white p-4 border border-gray-200 rounded-xl space-y-2">
              <h3 className="font-bold border-b pb-1 text-gray-900 uppercase tracking-wider flex items-center gap-1.5 text-[10px] text-gray-400"><Box className="w-3.5 h-3.5" /> Destination Matrix</h3>
              <p className="font-medium text-gray-700">{order.shippingAddress.street}</p>
              <p className="font-medium text-gray-700">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
              <p className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">{order.shippingAddress.country}</p>
            </div>
          </div>

          {/* Section 4: Payment */}
          <div className="bg-white p-4 border border-gray-200 rounded-xl space-y-2">
            <h3 className="font-bold border-b pb-1 text-gray-900 uppercase tracking-wider flex items-center gap-1.5 text-[10px] text-gray-400"><CreditCard className="w-3.5 h-3.5" /> Payment Ledger</h3>
            <div className="grid grid-cols-2 gap-2 font-medium">
              <div><p className="text-gray-400">Method</p><p className="font-bold text-gray-900 uppercase">{order.payment.method}</p></div>
              <div><p className="text-gray-400">Gateway Status</p><p className="font-bold uppercase text-gray-800">{order.payment.status}</p></div>
            </div>
          </div>
        </div>

        {/* Timeline & Actions Segment Panel */}
        <div className="space-y-4">
          <div className="bg-white p-4 border border-gray-200 rounded-xl space-y-4">
            <h3 className="font-bold border-b pb-1 text-gray-900 uppercase tracking-wider flex items-center gap-1.5 text-[10px] text-gray-400"><FileText className="w-3.5 h-3.5" /> State Management</h3>
            
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-gray-400 uppercase">Execute Flow Step</label>
              <div className="flex flex-col gap-1.5">
                {validNextActions.map((nextStatus) => (
                  <button
                    key={nextStatus}
                    disabled={isPending}
                    onClick={() => shiftStatus(nextStatus)}
                    className={`w-full py-2 px-3 text-left font-bold rounded-lg border transition-all cursor-pointer ${
                      nextStatus === 'CANCELLED'
                        ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                        : 'bg-emerald-600 border-transparent text-white hover:bg-emerald-700'
                    }`}
                  >
                    Transition to: {nextStatus}
                  </button>
                ))}
                {validNextActions.length === 0 && (
                  <p className="text-gray-400 text-center font-semibold py-2 border border-dashed rounded-lg bg-gray-50">Terminal flow position reached.</p>
                )}
              </div>
            </div>
          </div>

          {/* Chronological Vertical Timeline Log */}
          <div className="bg-white p-4 border border-gray-200 rounded-xl space-y-3">
            <h3 className="font-bold border-b pb-1 text-gray-900 uppercase tracking-wider flex items-center gap-1.5 text-[10px] text-gray-400"><Calendar className="w-3.5 h-3.5" /> Historical Audit Timeline</h3>
            <div className="relative border-l border-gray-200 pl-4 ml-2 space-y-4 py-2">
              {order.timeline?.map((log) => (
                <div key={log.id} className="relative">
                  <span className="absolute -left-[21px] top-1 bg-white border border-gray-400 rounded-full w-2 h-2" />
                  <p className="font-mono text-[10px] text-gray-400">{new Date(log.createdAt).toLocaleTimeString()}</p>
                  <p className="font-bold text-gray-800">{log.toStatus}</p>
                  {log.note && <p className="text-[10px] text-gray-400 italic mt-0.5">"{log.note}"</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}