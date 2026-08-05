'use client';
import React, { useState } from 'react';
import { useOrders, useOrderSummary } from '@/hooks/useOrders';
import { OrderFilters } from '@/components/orders/order-filters';
import { OrderTable } from '@/components/orders/order-table';
import { useDebounce } from '@/hooks/useDebounce';
import { BarChart3 } from 'lucide-react';

export default function OrdersDashboardOverviewPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [sortField, setSortField] = useState('createdAt:desc');

  const debouncedSearch = useDebounce(search, 350);
  const [field, order] = sortField.split(':');

  const { data: listData, isLoading } = useOrders({
    page: 1,
    limit: 50,
    status: status === 'all' ? undefined : status,
    search: debouncedSearch || undefined,
    sort: field,
    order: order as any,
  });

  const { data: summary } = useOrderSummary();

  // Handle flexible backend structures: listData directly, listData.orders, or listData.data
  const ordersList = Array.isArray(listData)
    ? listData
    : listData || (listData as any)?.data.orders || [];

  return (
    <div className="space-y-4 text-xs animate-in fade-in-50 duration-150">
      <div className="pb-2 border-b border-gray-200">
        <h2 className="text-base font-black text-gray-900 uppercase tracking-wider">
          Transaction Management Control
        </h2>
        <p className="text-xs text-gray-400">
          Audit lifecycle actions, state machines, and invoice timelines.
        </p>
      </div>

      {/* METRIC CARD WIDGET BLABS */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {Object.entries(summary).map(([key, value]) => (
            <div
              key={key}
              className="bg-white border border-gray-200 rounded-xl p-3 shadow-2xs flex justify-between items-center"
            >
              <div>
                <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wide">
                  {key.replace(/_/g, ' ')}
                </span>
                <span className="text-base font-black font-mono text-gray-800 block mt-0.5">
                  {typeof value === 'number' && key.toLowerCase().includes('revenue')
                    ? `₹${value.toFixed(2)}`
                    : String(value)}
                </span>
              </div>
              <BarChart3 className="w-3.5 h-3.5 text-gray-300" />
            </div>
          ))}
        </div>
      )}

      <OrderFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        sort={sortField}
        setSort={setSortField}
      />

      <OrderTable items={ordersList} loading={isLoading} />
    </div>
  );
}