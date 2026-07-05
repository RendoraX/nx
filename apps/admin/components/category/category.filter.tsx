import React from 'react';
import { Search } from 'lucide-react';

interface FilterProps {
  onSearchChange: (val: string) => void;
}

export function CategoryFilter({ onSearchChange }: FilterProps) {
  return (
    <div className="relative w-full sm:w-72">
      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
      <input 
        type="text" 
        placeholder="Search categories..." 
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full text-xs pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-emerald-500 font-medium" 
      />
    </div>
  );
}