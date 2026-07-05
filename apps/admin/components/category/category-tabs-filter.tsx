'use client';
import React from 'react';
import { Category } from '@/types/cat.types';

export type FilterTabType = 'all' | 'active' | 'inactive' | 'root' | 'child';

interface TabsFilterProps {
  activeTab: FilterTabType;
  onTabChange: (tab: FilterTabType) => void;
  items: Category[];
}

export function CategoryTabsFilter({ activeTab, onTabChange, items }: TabsFilterProps) {
  // Compute contextual count badges instantly from dataset metadata
  const counts = {
    all: items.length,
    active: items.filter((c) => c.status === 'active').length,
    inactive: items.filter((c) => c.status === 'inactive').length,
    root: items.filter((c) => !c.parentId).length,
    child: items.filter((c) => !!c.parentId).length,
  };

  const tabOptions: { id: FilterTabType; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'root', label: 'Root Categories' },
    { id: 'child', label: 'Child Categories' },
  ];

  return (
    <div className="flex border-b border-gray-200 w-full overflow-x-auto no-scrollbar scroll-smooth bg-white px-2 pt-1.5 rounded-xl border">
      <div className="flex gap-1.5">
        {tabOptions.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'border-emerald-600 text-emerald-700 bg-emerald-50/40 rounded-t-lg'
                  : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-200'
              }`}
            >
              {tab.label}
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold font-mono transition-colors ${
                  isActive ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'
                }`}
              >
                {counts[tab.id]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}