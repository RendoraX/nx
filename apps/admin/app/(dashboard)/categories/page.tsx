'use client';
import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { useCreateCategory } from '@/hooks/useCreateCategory';
import { useUpdateCategory } from '@/hooks/useUpdateCategory';
import { useDeleteCategory } from '@/hooks/useDeleteCategory';
import { CategoryFilter } from '@/components/category/category.filter';
import { CategoryTable } from '@/components/category/category.table';
import { CategoryForm } from '@/components/category/category.form';
import { DeleteCategoryDialog } from '@/components/category/delete.category.box';
import { CategoryTabsFilter, FilterTabType } from '@/components/category/category-tabs-filter';
import { Category } from '@/types/cat.types';
import Loading from './loading';

export default function CategoriesIndexPage() {
  const { categories, refetch, loading } = useCategories();
  const { createCategory } = useCreateCategory();
  const { updateCategory } = useUpdateCategory();
  const { deleteCategory } = useDeleteCategory();

  const [search, setSearch] = useState('');
  const [currentTab, setCurrentTab] = useState<FilterTabType>('all');
  
  // Clean Component Local States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Multi-tier structural processing (Filter tabs logic combined cleanly with text strings)
  const filtered = categories.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    switch (currentTab) {
      case 'root':
        return !c.parentId;
      case 'child':
        return !!c.parentId;
      case 'all':
      default:
        return true;
    }
  });

  const handleCreate = async (data: any) => {
    await createCategory(data);
    setIsCreateOpen(false);
    refetch();
  };

  const handleUpdate = async (data: any) => {
    if (editTarget) {
      await updateCategory({ ...data, id: editTarget.id });
      setEditTarget(null);
      refetch();
    }
  };

  const handleConfirmDelete = async () => {
    if (deleteTargetId) {
      await deleteCategory(deleteTargetId);
      setDeleteTargetId(null);
      refetch();
    }
  };

  return (
    <>
      {loading ? <Loading /> :
        <div className="space-y-4">
          
          {/* ACTION TOOLBAR CONTROLS */}
          <div className="flex flex-col sm:flex-row justify-between gap-3 sm:items-center">
            <CategoryFilter onSearchChange={setSearch} />
            <button 
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center justify-center gap-1.5 bg-emerald-600 text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-emerald-700 w-full sm:w-auto cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Create Category
            </button>
          </div>

          {/* DYNAMIC SEGMENTED TABS ENGINE */}
          <CategoryTabsFilter 
            activeTab={currentTab} 
            onTabChange={setCurrentTab} 
            items={categories} 
          />

          {/* INTERACTIVE DATA LAYOUT CONTAINER */}
          <CategoryTable 
            items={filtered} 
            onEditRequest={(category) => setEditTarget(category)}
            onDeleteRequest={(id) => setDeleteTargetId(id)} 
          />

          {/* CREATE MODAL */}
          {isCreateOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs px-4">
              <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-xl w-full shadow-lg relative max-h-[90vh] overflow-y-auto">
                <button onClick={() => setIsCreateOpen(false)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
                <div className="mb-4">
                  <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wider">Create New Category</h3>
                  <p className="text-xs text-gray-400">Append a structural node branch to your catalog tree.</p>
                </div>
                <CategoryForm 
                  parentOptions={categories} 
                  onSubmit={handleCreate} 
                  onCancel={() => setIsCreateOpen(false)} 
                />
              </div>
            </div>
          )}

          {/* EDIT MODAL */}
          {editTarget && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs px-4">
              <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-xl w-full shadow-lg relative max-h-[90vh] overflow-y-auto">
                <button onClick={() => setEditTarget(null)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
                <div className="mb-4">
                  <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wider">Modify Category Node</h3>
                  <p className="text-xs text-gray-400">Mutating attributes for category context ID: {editTarget.id}</p>
                </div>
                <CategoryForm 
                  initialData={editTarget}
                  parentOptions={categories} 
                  onSubmit={handleUpdate} 
                  onCancel={() => setEditTarget(null)} 
                />
              </div>
            </div>
          )}
          
          <DeleteCategoryDialog 
            isOpen={deleteTargetId !== null} 
            onConfirm={handleConfirmDelete} 
            onCancel={() => setDeleteTargetId(null)} 
          />
        </div>
      }
    </>
  );
}