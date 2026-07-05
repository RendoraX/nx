import React from 'react';
import { Edit, Trash } from 'lucide-react';
import Link from 'next/link';

interface ActionsProps {
  categoryId: string;
  onDeleteClick: (id: string) => void;
}

export function CategoryActions({ categoryId, onDeleteClick }: ActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Link 
        href={`/categories/${categoryId}/edit`}
        className="p-1 text-gray-500 hover:text-emerald-600 hover:bg-gray-50 rounded"
      >
        <Edit className="w-4 h-4" />
      </Link>
      <button 
        onClick={() => onDeleteClick(categoryId)}
        className="p-1 text-gray-500 hover:text-rose-600 hover:bg-gray-50 rounded"
      >
        <Trash className="w-4 h-4" />
      </button>
    </div>
  );
}