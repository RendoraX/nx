'use client';
import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

interface FiltersProps {
  search: string;
  setSearch: (v: string) => void;
  status: string;
  setStatus: (v: string) => void;
  onBulkClick: () => void;
  isBulkDisabled: boolean;
}

export function InventoryFilters({ search, setSearch, status, setStatus, onBulkClick, isBulkDisabled }: FiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border border-gray-200 p-4 rounded-xl shadow-2xs">
      <div className="flex flex-1 items-center gap-2 w-full sm:w-auto">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input 
            type="text" 
            placeholder="Filter identity via SKU key node or master product variant descriptors..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            className="w-full text-xs pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-emerald-500 font-medium text-gray-700" 
          />
        </div>
        <select 
          value={status} 
          onChange={e => setStatus(e.target.value)} 
          className="text-xs p-2 border border-gray-200 rounded-lg bg-white font-semibold text-gray-600 focus:outline-emerald-500 cursor-pointer"
        >
          <option value="all">Ledger Matrix: All Active</option>
          <option value="in_stock">Healthy (In Stock)</option>
          <option value="low_stock">Below Threshold (Low Stock)</option>
          <option value="out_of_stock">Depleted (Out of Stock)</option>
        </select>
      </div>
      
      <button 
        type="button"
        disabled={isBulkDisabled}
        onClick={onBulkClick}
        className="flex items-center justify-center gap-1.5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-100 disabled:text-gray-400 text-white font-semibold text-xs px-4 py-2 rounded-lg cursor-pointer transition-colors w-full sm:w-auto shadow-xs disabled:cursor-not-allowed"
      >
        <SlidersHorizontal className="w-3.5 h-3.5" /> Execute Batch Adjustment
      </button>
    </div>
  );
}