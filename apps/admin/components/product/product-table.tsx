'use client';
import React from 'react';
import { Product } from '@/types/product';
import { ProductActions } from './product-actions';

interface TableProps {
  items: Product[];
  loading: boolean;
  onEdit: (product: Product) => void;
}

export function ProductTable({ items, loading, onEdit }: TableProps) {
  if (loading) {
    return (
      <div className="w-full h-48 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-xs text-gray-400 font-medium">
        Loading catalog inventory instances...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="w-full h-48 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-xs text-gray-400 font-medium">
        No product entries found matching active criteria.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-xs">
      <div className="inline-block min-w-full align-middle">
        <table className="w-full text-left text-xs border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider">
              <th className="p-4 w-12">Media</th>
              <th className="p-4">Product Specs</th>
              <th className="p-4">SKU Identity</th>
              <th className="p-4 text-right">Selling Price</th>
              <th className="p-4 text-center">Packaging Mix</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-right w-16">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
            {items.map((prod) => (
              <tr key={prod.id} className="hover:bg-gray-50/50 transition-all">
                <td className="p-4">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-50 border border-gray-200">
                    <img 
                      src={prod.images?.[0]?.url || 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=100'} 
                      alt="" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                </td>
                <td className="p-4">
                  <p className="font-bold text-gray-900">{prod.name}</p>
                  <p className="text-[10px] text-gray-400 font-mono mt-0.5">/{prod.slug}</p>
                </td>
                <td className="p-4 font-mono font-bold text-gray-500 text-xs">{prod.sku}</td>
                <td className="p-4 text-right font-bold text-gray-900 font-mono">
                  {prod.hasVariants && prod.variants?.length ? (
                    <span className="text-gray-400 text-[10px] block font-normal">From ${Math.min(...prod.variants.map(v => v.price)).toFixed(2)}</span>
                  ) : (
                    `$${Number(prod.price || 0).toFixed(2)}`
                  )}
                </td>
                <td className="p-4 text-center">
                  {prod.hasVariants ? (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-bold">
                      {prod.variants?.length || 0} Sizes
                    </span>
                  ) : (
                    <span className="text-gray-400 text-[10px]">Standard Base</span>
                  )}
                </td>
                <td className="p-4 text-center">
                  <span className={`inline-block px-2 py-0.5 text-[9px] font-bold rounded-full uppercase tracking-wider ${
                    prod.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {prod.isActive ? 'Active' : 'Draft'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <ProductActions product={prod} onEdit={onEdit} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}