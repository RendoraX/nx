import React, { useState } from 'react';
import { Category, CreateCategoryInput } from '@/types/cat.types';

interface FormProps {
  initialData?: Category;
  parentOptions: Category[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function CategoryForm({ initialData, parentOptions, onSubmit, onCancel }: FormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    parentId: initialData?.parentId || null,
    status: initialData?.status || 'active'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl bg-white p-6 rounded-xl border border-gray-200 shadow-2xs">
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Category Name</label>
        <input 
          type="text" 
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
          className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-emerald-500"
          placeholder="e.g. Mechanical Keyboards"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Slug Route URL</label>
        <input 
          type="text" 
          required
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-emerald-500 font-mono text-gray-600"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Parent Category (Optional)</label>
        <select 
          value={formData.parentId as string || ''}
          onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
          className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-emerald-500"
        >
          <option value="">None (Top Level Category)</option>
          {parentOptions.filter(c => c.id !== initialData?.id).map(opt => (
            <option key={opt.id} value={opt.id}>{opt.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Visibility Status</label>
        <div className="flex gap-4 mt-1">
          {['active', 'inactive'].map((st) => (
            <label key={st} className="flex items-center gap-2 text-xs font-medium text-gray-700 capitalize cursor-pointer">
              <input 
                type="radio" 
                name="status" 
                value={st} 
                checked={formData.status === st} 
                onChange={() => setFormData({ ...formData, status: st as 'active' | 'inactive' })}
                className="text-emerald-600 focus:ring-emerald-500" 
              />
              {st}
            </label>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 pt-2 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-50">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700">Save Category</button>
      </div>
    </form>
  );
}