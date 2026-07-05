import React from 'react';
import { Category } from '@/types/cat.types';
import { CategoryStatus } from './category.status';
import { Edit, Trash } from 'lucide-react';

interface TableProps {
  items: Category[];
  onEditRequest: (category: Category) => void;
  onDeleteRequest: (id: string) => void;
}

export function CategoryTable({ items, onEditRequest, onDeleteRequest }: TableProps) {
  return (
    <div className="w-full overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-2xs">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 font-semibold uppercase tracking-wider">
            <th className="p-4">Name</th>
            <th className="p-4">Slug</th>
            <th className="p-4">Products Linked</th>
            <th className="p-4">Status</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
          {items.map((cat) => (
            <tr key={cat.id} className="hover:bg-gray-50/70 transition-colors">
              <td className="p-4 font-semibold text-gray-900">{cat.name}</td>
              <td className="p-4 text-gray-500">/{cat.slug}</td>
              <td className="p-4">{cat.productCount} items</td>
              <td className="p-4"><CategoryStatus status={cat.status} /></td>
              <td className="p-4 text-right">
                <div className="flex items-center gap-2 justify-end">
                  <button 
                    onClick={() => onEditRequest(cat)}
                    className="p-1 text-gray-500 hover:text-emerald-600 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onDeleteRequest(cat.id)}
                    className="p-1 text-gray-500 hover:text-rose-600 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={5} className="p-8 text-center text-gray-400">No matching categories found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}