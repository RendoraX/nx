'use client';
import React from 'react';
import { Search, ArrowUpDown } from 'lucide-react';
import { OrderStatus } from '@/types/orders';

interface FilterProps {
  search: string; setSearch: (v: string) => void;
  status: string; setStatus: (v: string) => void;
  sort: string; setSort: (v: string) => void;
}

const STATUS_TABS: { value: string; label: string }[] = [
  { value: 'all', label: 'All Orders' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'PACKED', label: 'Packed' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export function OrderFilters({ search, setSearch, status, setStatus, sort, setSort }: FilterProps) {
  return (
    <div className="space-y-3 bg-white border border-gray-200 p-4 rounded-xl shadow-2xs">
      <div className="flex flex-wrap items-center gap-1.5 border-b border-gray-100 pb-2 overflow-x-auto">
        {STATUS_TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => setStatus(tab.value)}
            className={`px-3 py-1.5 text-[11px] font-bold rounded-lg border transition-all cursor-pointer select-none ${
              status === tab.value 
                ? 'bg-gray-900 border-gray-900 text-white shadow-xs' 
                : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by Order ID, Customer Name, Email reference..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-emerald-500 font-medium text-gray-700"
          />
        </div>
        <div className="relative min-w-[180px]">
          <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 border border-gray-200 rounded-lg bg-white font-semibold text-gray-600 focus:outline-emerald-500 cursor-pointer"
          >
            <option value="createdAt:desc">Newest Order Logs</option>
            <option value="createdAt:asc">Oldest Order Logs</option>
            <option value="amount:desc">Highest Value Amount</option>
            <option value="amount:asc">Lowest Value Amount</option>
          </select>
        </div>
      </div>
    </div>
  );
}