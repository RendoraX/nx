'use client';
import React from 'react';
import { useDeleteProduct } from '@/hooks/useDeleteProduct';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface DeleteProps {
  productId: string;
  productName: string;
  onClose: () => void;
}

export function ProductDeleteDialog({ productId, productName, onClose }: DeleteProps) {
  const { deleteProduct, isDeleting } = useDeleteProduct();

  const handleConfirmDeletion = async () => {
    try {
      await deleteProduct(productId as string);
      toast.success('Product removed successfully');
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to destroy item mapping context.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div 
        className="bg-white border border-gray-200 rounded-xl shadow-xl max-w-sm w-full p-6 space-y-4 animate-in zoom-in-95 duration-150 text-left"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div className="p-2 bg-rose-50 rounded-lg text-rose-600 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Confirm Destructive Action</h3>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              Are you sure you want to delete <span className="font-bold text-gray-700 font-mono">"{productName}"</span>? This will wipe all metrics, child variants, and historical data nodes.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 text-xs font-semibold pt-2 border-t border-gray-100">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onClose}
            className="px-3 py-2 bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={handleConfirmDeletion}
            className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center"
          >
            {isDeleting ? 'Dropping...' : 'Confirm Wipe'}
          </button>
        </div>
      </div>
    </div>
  );
}