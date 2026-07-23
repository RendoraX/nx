'use client';

import React from 'react';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import AdminKitModal from '@/components/admin/AdminKitModal'; // <-- Adjust this path to where you saved the modal code
import { useProducts } from '@/hooks/useProducts';
import { useAdminRitual } from '@/hooks/useAdminRitual';

export default function KitManagementPage() {
  const { products } = useProducts();
  const {
    templates,
    activeModalTemplate,
    isModalOpen,
    isMutating,
    isLoading,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseModal,
    handleSaveData,
    handleDeleteTemplate
  } = useAdminRitual();

  return (
    <div className="space-y-6">
      {/* Top Action Ribbon Bar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-gray-900">Ritual Blueprint Master Matrix</h2>
          <p className="text-xs text-gray-500">Create, test, and distribute bundled asset kits across retail store channels.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" /> Add New Blueprint
        </button>
      </div>

      {/* Loading State Overlay/Buffer */}
      {isLoading && (
        <div className="text-center py-8 text-xs text-gray-500 font-medium animate-pulse">
          Loading layout configuration profiles...
        </div>
      )}

      {/* Grid List displaying current active blueprint templates */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map(tpl => (
            <div key={tpl.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{tpl.name}</h3>
                    <span className="text-[10px] font-mono text-gray-400">/{tpl.slug}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${tpl.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-500'}`}>
                      {tpl.isActive ? 'Live' : 'Draft'}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 line-clamp-2">{tpl.description}</p>
                <div className="text-[11px] text-gray-500 pt-1">
                  <strong>Authority Check:</strong> {tpl.curatedBy}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                <span className="text-sm font-bold text-gray-900">₹{tpl.baseBoxPrice}</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleOpenEdit(tpl)}
                    className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-medium hover:text-emerald-700 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Modify
                  </button>
                  <button
                    onClick={() => {handleDeleteTemplate(tpl.id);}}
                    className="inline-flex items-center gap-1.5 text-xs text-rose-600 font-medium hover:text-rose-700 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Purge
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RENDER MODAL LAYOUT CONTAINER TARGET */}
      <AdminKitModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveData}
        template={activeModalTemplate}
        allAvailableProducts={products as any}
        isMutating={isMutating}
      />
    </div>
  );
}