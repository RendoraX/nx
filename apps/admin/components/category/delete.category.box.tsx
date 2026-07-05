import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface DeleteProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteCategoryDialog({ isOpen, onConfirm, onCancel }: DeleteProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs px-4">
      <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-sm w-full shadow-lg">
        <div className="flex items-center gap-3 text-rose-600 mb-3">
          <AlertTriangle className="w-6 h-6 shrink-0" />
          <h3 className="font-bold text-sm text-gray-900">Confirm Deletion</h3>
        </div>
        <p className="text-xs text-gray-500 mb-6 leading-relaxed">
          Are you sure you want to drop this catalog node structural branch? Linked downstream products could become detached.
        </p>
        <div className="flex justify-end gap-2 text-xs font-semibold">
          <button onClick={onCancel} className="px-3 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={onConfirm} className="px-3 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700">Delete Object</button>
        </div>
      </div>
    </div>
  );
}