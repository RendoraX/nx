'use client';
import React, { useState } from 'react';
import { Plus, Search, ArrowLeft } from 'lucide-react';
import { Product } from '@/types/product';
import { ProductForm } from '@/components/product/product-form';
import { ProductTable } from '@/components/product/product-table';
import { useProducts } from '@/hooks/useProducts';
import { useUpdateProduct } from '@/hooks/useUpdateProduct';
import { useCreateProduct } from '@/hooks/useCreateProduct';
import { toast } from 'sonner';

export default function ProductsIndexPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { products, loading } = useProducts({ searchQuery, statusFilter });
  const { createProduct } = useCreateProduct();
  const { updateProduct } = useUpdateProduct();
  
  const filteredItems = products.filter((item: any) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                          (statusFilter === 'active' && item.isActive) || 
                          (statusFilter === 'inactive' && !item.isActive);
    return matchesSearch && matchesStatus;
  });

  const handleCreateSubmit = async (newData: any) => {
    try {
      await createProduct(newData);
      toast.success('Product created successfully');
      setIsCreating(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create product');
    }
  };

const handleUpdateSubmit = async (updatedData: any) => {
  if (!editTarget?.id) return;
  try {
    await updateProduct({ 
      id: editTarget.id, 
      data: updatedData
    });
    toast.success('Product updated successfully');
    setEditTarget(null);
  } catch (error: any) {
    toast.error(error.message || 'Failed to update product');
  }
};
  const handleCancel = () => {
    setIsCreating(false);
    setEditTarget(null);
  };

  if (isCreating || editTarget) {
    return (
      <div className="space-y-4 animate-in fade-in-50 duration-150 text-left">
        <div className="flex items-center justify-between pb-2 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button 
              onClick={handleCancel}
              className="p-2 border border-gray-200 bg-white hover:bg-gray-50 rounded-lg text-gray-600 transition-colors cursor-pointer group shadow-xs"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            </button>
            <div>
              <h2 className="text-base font-bold text-gray-900 uppercase tracking-wider">
                {isCreating ? 'Establish New Catalog Entry' : 'Modify Existing Product Resource'}
              </h2>
              <p className="text-xs text-gray-400">
                {isCreating ? 'Configure descriptive metadata parameters.' : `Updating Product Identifier: ${editTarget?.id}`}
              </p>
            </div>
          </div>
        </div>

        <ProductForm 
          initialData={editTarget}
          onSubmit={isCreating ? handleCreateSubmit : handleUpdateSubmit}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in-50 duration-150 !overflow-visible text-left">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border border-gray-200 p-4 rounded-xl shadow-xs z-20 relative">
        <div className="flex flex-1 items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Search by name or SKU..." 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
              className="w-full text-xs pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-emerald-500 font-medium text-gray-700" 
            />
          </div>
          <select 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)} 
            className="text-xs p-2 border border-gray-200 rounded-lg bg-white font-semibold text-gray-600 focus:outline-emerald-500 cursor-pointer"
          >
            <option value="all">Status Matrix: All</option>
            <option value="active">Active Store Visible</option>
            <option value="inactive">Draft / Hidden</option>
          </select>
        </div>
        <button 
          onClick={() => setIsCreating(true)} 
          className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2 rounded-lg cursor-pointer transition-colors w-full sm:w-auto shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" /> Establish Product
        </button>
      </div>

      <div className="relative !overflow-visible z-10 w-full min-h-[400px]">
        <ProductTable 
          items={filteredItems} 
          loading={loading} 
          onEdit={setEditTarget} 
        />
      </div>
    </div>
  );
}