'use client';

import React, { use } from 'react';
import { useOrderDetails, useUpdateOrderStatus } from '@/hooks/useOrders';
import { ORDER_TRANSITIONS, ORDER_STATUS_FLOW, OrderStatus } from '@/types/orders';
import {
  ArrowLeft,
  User,
  CreditCard,
  PackageCheck,
  Calendar,
  ShieldCheck,
  MapPin,
  Sparkles,
  Box,
} from 'lucide-react';
import Link from 'next/link';

export default function OrderDetailsManagementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: order, isLoading } = useOrderDetails(id);
  const { mutateAsync: shiftStatus, isPending } = useUpdateOrderStatus(id);

  if (isLoading || !order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3 bg-slate-50 rounded-2xl border border-slate-200">
        <div className="w-8 h-8 border-3 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
        <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">Loading Order Flow Matrix...</p>
      </div>
    );
  }

  const validNextActions: OrderStatus[] = ORDER_TRANSITIONS[order.status as OrderStatus] || [];

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (newStatus === order.status) return;
    await shiftStatus(newStatus as any);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'PACKED':
      case 'SHIPPED':
      case 'OUT_FOR_DELIVERY':
      case 'CONFIRMED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'CANCELLED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-amber-50 text-amber-800 border-amber-200';
    }
  };

  const primaryNextStep = validNextActions.find((st) => st !== 'CANCELLED');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8 space-y-6 font-sans">
      {/* Top Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 bg-white p-5 rounded-2xl shadow-sm border">
        <div className="flex items-center gap-4">
          <Link
            href="/orders"
            className="p-2 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 rounded-xl transition-all shadow-sm group"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600 group-hover:text-emerald-700" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">Order Audit Workspace</h1>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">ID: {order.id}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 text-xs font-semibold tracking-wide border rounded-full ${getStatusBadge(
              order.status
            )}`}
          >
            ● {order.status}
          </span>
          <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-full shadow-sm">
            ₹{Number(order.totalAmount || order.amount || 0).toFixed(2)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Admin Controller */}
          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Quick State Controller
                </h2>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">FSM Flow Enabled</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Dynamic Step Action */}
              {primaryNextStep ? (
                <button
                  disabled={isPending}
                  onClick={() => handleStatusChange(primaryNextStep)}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-md disabled:opacity-50 cursor-pointer"
                >
                  <PackageCheck className="w-4 h-4" />
                  Advance to {primaryNextStep}
                </button>
              ) : (
                <div className="flex items-center justify-center py-2.5 px-4 bg-slate-100 text-slate-500 font-bold text-xs rounded-xl border border-slate-200">
                  No Next Step Available
                </div>
              )}

              {/* Status Flow Selector */}
              <div>
                <select
                  disabled={isPending}
                  value={order.status}
                  onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white cursor-pointer disabled:opacity-50"
                >
                  {ORDER_STATUS_FLOW.map((st) => (
                    <option key={st} value={st}>
                      Set Status: {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* FSM Valid Next Transitions */}
            {validNextActions.length > 0 && (
              <div className="pt-2">
                <p className="text-[10px] text-slate-400 font-mono mb-2 uppercase tracking-wider">
                  Recommended Workflow Steps
                </p>
                <div className="flex flex-wrap gap-2">
                  {validNextActions.map((nextSt) => (
                    <button
                      key={nextSt}
                      disabled={isPending}
                      onClick={() => handleStatusChange(nextSt)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                        nextSt === 'CANCELLED'
                          ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-600 hover:text-white'
                      }`}
                    >
                      → Advance to {nextSt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Line Items */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                <Box className="w-4 h-4 text-emerald-600" /> Line Items
              </h2>
              <span className="text-[10px] font-mono text-slate-400">
                {(order.items || []).length} Item(s)
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {(order.items || []).map((item: any) => {
                const productName = item.variant?.product?.name || item.productName || item.productId;
                const sku = item.variant?.sku || item.sku || 'N/A';
                const size = item.variant?.size;

                return (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <p className="font-bold text-sm text-slate-900">{productName}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                        <span>SKU: {sku}</span>
                        {size && <span>• Size: {size}</span>}
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <p className="text-xs text-slate-500">
                        {item.quantity} × ₹{Number(item.price).toFixed(2)}
                      </p>
                      <p className="font-bold text-sm text-emerald-700">
                        ₹{(Number(item.quantity) * Number(item.price)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>₹{Number(order.subtotal || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Shipping Fee</span>
                <span>₹{Number(order.shippingAmount || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-sm text-slate-900">
                <span>Total Amount</span>
                <span className="text-emerald-700">
                  ₹{Number(order.totalAmount || order.amount || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Customer & Address Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2 border-b border-slate-100 pb-2">
                <User className="w-4 h-4 text-emerald-600" /> Customer Profile
              </h3>
              <div className="space-y-1 text-xs">
                <p className="font-bold text-slate-900 text-sm">{order.user?.name || order.Address?.fullName || 'N/A'}</p>
                <p className="text-slate-500 font-mono">{order.user?.email || 'N/A'}</p>
                <p className="text-slate-600 font-mono">{order.user?.phone || order.Address?.phone || 'N/A'}</p>
                <div className="pt-2">
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-mono text-[10px] font-semibold rounded border border-emerald-200">
                    Role: {order.user?.role || 'USER'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2 border-b border-slate-100 pb-2">
                <MapPin className="w-4 h-4 text-emerald-600" /> Destination Matrix
              </h3>
              {order.Address ? (
                <div className="space-y-1 text-xs text-slate-600">
                  <p className="font-bold text-slate-900">{order.Address.fullName}</p>
                  <p>{order.Address.line1}</p>
                  {order.Address.line2 && <p>{order.Address.line2}</p>}
                  <p className="font-mono text-emerald-700 font-medium">PIN: {order.Address.postalCode}</p>
                  <p className="font-mono text-slate-500">Phone: {order.Address.phone}</p>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No destination address provided.</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2 border-b border-slate-100 pb-2">
              <CreditCard className="w-4 h-4 text-emerald-600" /> Payment Ledger
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Provider</span>
                <span className="font-bold text-slate-800 font-mono uppercase">
                  {order.payment?.provider || 'COD'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Gateway Status</span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[10px] font-bold rounded">
                  {order.payment?.status || 'PENDING'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Amount</span>
                <span className="font-mono font-bold text-slate-900">
                  ₹{Number(order.payment?.amount || order.totalAmount || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Calendar className="w-4 h-4 text-emerald-600" /> Historical Timeline
            </h3>

            <div className="relative border-l border-slate-200 ml-2 pl-4 space-y-4 py-1">
              <div className="relative">
                <span className="absolute -left-[21px] top-1 bg-emerald-600 rounded-full w-2.5 h-2.5 ring-4 ring-white" />
                <p className="text-[10px] font-mono text-slate-400">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
                <p className="text-xs font-bold text-slate-800">Order Placed (PENDING)</p>
              </div>

              {((order.statusHistory || order.timeline) || []).map((log: any) => (
                <div key={log.id} className="relative">
                  <span className="absolute -left-[21px] top-1 bg-slate-400 rounded-full w-2.5 h-2.5 ring-4 ring-white" />
                  <p className="text-[10px] font-mono text-slate-400">
                    {new Date(log.createdAt).toLocaleString()}
                  </p>
                  <p className="text-xs font-bold text-slate-800">{log.status || log.toStatus}</p>
                  {log.note && <p className="text-[11px] text-slate-500 italic mt-0.5">"{log.note}"</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}