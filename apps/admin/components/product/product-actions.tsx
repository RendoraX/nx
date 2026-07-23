'use client';
import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit3, Trash2 } from 'lucide-react';
import { Product } from '@/types/product';
import { ProductDeleteDialog } from './delete-product-dialog';

interface ActionsProps {
  product: Product;
  onEdit: (product: Product) => void;
}

export function ProductActions({ product, onEdit }: ActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left text-xs" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-md py-1 z-50 animate-in fade-in-50 slide-in-from-top-1 duration-100">
          <button
            onClick={() => { onEdit(product); setIsOpen(false); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 text-gray-700 font-medium transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-gray-400" /> Edit Product
          </button>
          <button
            onClick={() => { setShowDeleteModal(true); setIsOpen(false); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-rose-50 text-rose-600 font-medium transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" /> Remove Node
          </button>
        </div>
      )}

      {showDeleteModal && (
        <ProductDeleteDialog 
          productId={product.id} 
          productName={product.name} 
          onClose={() => setShowDeleteModal(false)} 
        />
      )}
    </div>
  );
}