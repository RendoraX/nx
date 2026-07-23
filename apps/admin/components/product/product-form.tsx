'use client';
import React, { useState } from 'react';
import { Product } from '@/types/product';
import { ProductBasic } from './product-basic';
import { ProductPricing } from './product-pricing';
import { ProductCategory } from './product-category';
import { ProductImages } from './product-images';
import { ProductInventory } from './product-inventory';
import { ProductSeo } from './product-seo';
import { ProductPublishing } from './product-publishing';
import { ProductPreview } from './product-preview';
import { Info, DollarSign, Folder, Image, Box, Globe, Eye, ClipboardCheck, ChevronDown } from 'lucide-react';

interface FormProps {
  initialData?: Product | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

type TabId = 'basic' | 'pricing' | 'category' | 'images' | 'inventory' | 'seo' | 'publishing' | 'preview';

export function ProductForm({ initialData, onSubmit, onCancel }: FormProps) {
  const [activeTab, setActiveTab] = useState<TabId>('basic');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [deletedVariantIds, setDeletedVariantIds] = useState<string[]>([]);
  
  const [formData, setFormData] = useState<Partial<Product>>({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    comparePrice: initialData?.comparePrice || 0,
    sku: initialData?.sku || '',
    categoryId: initialData?.categoryId || '',
    isActive: initialData?.isActive ?? true,
    status: initialData?.status || 'draft',
    metaTitle: initialData?.metaTitle || '',
    metaDescription: initialData?.metaDescription || '',
    images: initialData?.images || [],
    hasVariants: initialData?.hasVariants || false,
    variants: initialData?.variants || [],
    tags: initialData?.tags || []
  });

  const updateFields = (fields: Partial<Product>) => {
    setFormData(prev => {
      const updated = { ...prev, ...fields };
      if (fields.name && (!prev.sku || prev.sku === generateDefaultSKU(prev.name || ''))) {
        updated.sku = generateDefaultSKU(fields.name);
      }
      return updated;
    });
  };

  // Helper to remove a variant from local state and log its ID for backend deletion
  const handleDeleteVariant = (variantIdToDelete: string) => {
    if (variantIdToDelete) {
      setDeletedVariantIds(prev => 
        prev.includes(variantIdToDelete) ? prev : [...prev, variantIdToDelete]
      );
    }
    
    setFormData(prev => ({
      ...prev,
      variants: (prev.variants || []).filter((v: any) => v.id !== variantIdToDelete)
    }));
  };

  function generateDefaultSKU(name: string): string {
    if (!name) return '';
    const cleanName = name
      .toUpperCase()
      .replace(/[^A-Z0-9\s]/g, '')
      .split(/\s+/)
      .filter(Boolean)
      .map(word => word.substring(0, 3))
      .join('-');
    const secureRandomSalt = Math.floor(1000 + Math.random() * 9000);
    return `${cleanName}-${secureRandomSalt}`;
  }

  const menuItems = [
    { id: 'basic', label: 'Basic Info', icon: Info },
    { id: 'pricing', label: 'Pricing Data', icon: DollarSign },
    { id: 'category', label: 'Assignment', icon: Folder },
    { id: 'images', label: 'Media Gallery', icon: Image },
    { id: 'inventory', label: 'Inventory & Variants', icon: Box },
    { id: 'seo', label: 'Search Optimization', icon: Globe },
    { id: 'publishing', label: 'Visibility Matrix', icon: ClipboardCheck },
    { id: 'preview', label: 'Live Presentation Preview', icon: Eye },
  ];

  const handleFormSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return alert('Product Name is critically required.');
    if (!formData.sku) return alert('Product SKU parameters are critically required.');
    if (!formData.categoryId) return alert('Primary structural Category allocation required.');

    // Pass both form data and accumulated deleted variant IDs
    onSubmit({
      ...formData,
      deletedVariantIds
    });
  };

  const activeItem = menuItems.find(item => item.id === activeTab);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-2xs overflow-hidden min-h-[650px] flex flex-col lg:flex-row">
      
      {/* IN-CONTAINER CONTEXTUAL SELECTOR FOR MOBILE GRID SYSTEM */}
      <div className="lg:hidden p-4 bg-gray-50 border-b border-gray-200 relative z-20">
        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Form Navigation Section</label>
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-xs font-semibold text-gray-700 shadow-2xs cursor-pointer focus:outline-hidden focus:border-emerald-500"
        >
          <div className="flex items-center gap-2">
            {activeItem && <activeItem.icon className="w-4 h-4 text-emerald-600" />}
            <span>{activeItem?.label}</span>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {isDropdownOpen && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setIsDropdownOpen(false)} />
            <div className="absolute left-4 right-4 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-40 max-h-60 overflow-y-auto animate-in fade-in-50 slide-in-from-top-1 duration-100">
              {menuItems.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.id as TabId);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-xs font-semibold transition-colors ${
                      activeTab === item.id ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* SIDEBAR SIDE PANEL VIEWPORT COMPONENT FOR DESKTOP MONITORS */}
      <aside className="hidden lg:flex w-64 bg-gray-50 border-r border-gray-200 p-4 flex-col justify-between">
        <div className="space-y-1">
          <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Product Sections</div>
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id as TabId)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === item.id ? 'bg-emerald-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-200/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>
        <div className="pt-6 border-t border-gray-200/80 mt-6 flex flex-col gap-2">
          <button onClick={handleFormSubmission} type="button" className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-xs">
            Save Changes
          </button>
          <button onClick={onCancel} type="button" className="w-full py-2 bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 rounded-lg text-xs font-semibold cursor-pointer transition-colors">
            Discard
          </button>
        </div>
      </aside>

      {/* CORE WORKSPACE ENTRY DATA PANEL CONTAINER AREA */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl overflow-y-auto max-h-[85vh] flex flex-col justify-between">
        <div className="flex-1">
          {activeTab === 'basic' && <ProductBasic data={formData} onChange={updateFields} />}
          {activeTab === 'pricing' && <ProductPricing data={formData} onChange={updateFields} />}
          {activeTab === 'category' && <ProductCategory data={formData} onChange={updateFields} />}
          {activeTab === 'images' && <ProductImages data={formData} onChange={updateFields} />}
          {activeTab === 'inventory' && (
            <ProductInventory 
              data={formData} 
              onChange={updateFields} 
            />
          )}
          {activeTab === 'seo' && <ProductSeo data={formData} onChange={updateFields} />}
          {activeTab === 'publishing' && <ProductPublishing data={formData} onChange={updateFields} />}
          {activeTab === 'preview' && <ProductPreview data={formData} />}
        </div>
        
        {/* ACTION UTILITIES ACTIONABLE ONLY WITHIN THE VISIBLE FRAMEWORK WINDOW FOR MOBILE VIEWPORTS */}
        <div className="lg:hidden pt-6 border-t border-gray-100 mt-6 flex gap-2">
          <button onClick={onCancel} type="button" className="flex-1 py-2 bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 rounded-lg text-xs font-semibold cursor-pointer transition-colors">
            Discard
          </button>
          <button onClick={handleFormSubmission} type="button" className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-xs">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}