'use client';
import React from 'react';
import { Search } from 'lucide-react';

interface FiltersProps {
  search: string;
  setSearch: (v: string) => void;
  role: string;
  setRole: (v: string) => void;
  status: string;
  setStatus: (v: string) => void;
}

export function UserFilters({ search, setSearch, role, setRole, status, setStatus }: FiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border border-gray-200 p-4 rounded-xl shadow-2xs">
      <div className="flex flex-1 flex-col sm:flex-row items-center gap-2 w-full">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input 
            type="text" 
            placeholder="Search accounts via legal naming conventions or email keys..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            className="w-full text-xs pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-emerald-500 font-medium text-gray-700" 
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <select 
            value={role} 
            onChange={e => setRole(e.target.value)} 
            className="text-xs p-2 border border-gray-200 rounded-lg bg-white font-semibold text-gray-600 focus:outline-emerald-500 cursor-pointer min-w-[130px]"
          >
            <option value="all">Roles: All Types</option>
            <option value="ADMIN">Administrator</option>
            <option value="USER">Customer Base</option>
          </select>

          <select 
            value={status} 
            onChange={e => setStatus(e.target.value)} 
            className="text-xs p-2 border border-gray-200 rounded-lg bg-white font-semibold text-gray-600 focus:outline-emerald-500 cursor-pointer min-w-[130px]"
          >
            <option value="all">Status: All States</option>
            <option value="active">Active System Accounts</option>
            <option value="suspended">Suspended Records</option>
          </select>
        </div>
      </div>
    </div>
  );
}