'use client';

import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export function SearchBar({ value, onChange, onClear }: SearchBarProps) {
  return (
    <div className="relative w-full group">
      <span className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#1F5E3B] transition-colors duration-300 pointer-events-none">
        <Search className="w-4 h-4 stroke-[1.5]" />
      </span>
      <input
        type="text"
        placeholder="Search premium formulations by name, herb composition, or Sanskrit designation..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 bg-[#FAF8F3]/60 border border-[#E6D5B8]/60 rounded-xl pl-11 pr-10 text-xs font-medium text-gray-800 placeholder-gray-400/80 transition-all duration-300 focus:outline-none focus:border-[#1F5E3B] focus:bg-white focus:ring-1 focus:ring-[#1F5E3B]/20"
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
          aria-label="Clear search input parameters"
        >
          <X className="w-4 h-4 stroke-[1.5]" />
        </button>
      )}
    </div>
  );
}