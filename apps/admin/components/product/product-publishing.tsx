import React from 'react';
import { Product } from '@/types/product';

interface SubProps { data: Partial<Product>; onChange: (fields: Partial<Product>) => void; }

export function ProductPublishing({ data, onChange }: SubProps) {
  const currentStatus = data.status || 'draft';

  const matrixOptions = [
    { id: 'draft', title: 'Internal Draft', desc: 'Hidden framework state entity. Inaccessible via storefront routing APIs.', checkedColor: 'text-amber-600 focus:ring-amber-500', active: false },
    { id: 'published', title: 'Live Production Active', desc: 'Visible inside active catalogs. Available immediately for checkout routing operations.', checkedColor: 'text-emerald-600 focus:ring-emerald-500', active: true },
    { id: 'archived', title: 'Permanent Historical Archive', desc: 'Hidden entity. Preserves analytical history strings without breaking relational database orders links map.', checkedColor: 'text-rose-600 focus:ring-rose-500', active: false }
  ];

  return (
    <div className="space-y-4">
      <div><h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Visibility Lifecycle Matrix</h3><p className="text-xs text-gray-400">Alter configuration properties for consumer execution pipelines.</p></div>
      <div className="space-y-3">
        {matrixOptions.map(opt => (
          <label key={opt.id} className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${currentStatus === opt.id ? 'border-gray-900 bg-gray-50/50' : 'border-gray-200 hover:bg-gray-50/30'}`}>
            <input type="radio" name="publishingStatus" value={opt.id} checked={currentStatus === opt.id} onChange={() => onChange({ status: opt.id as any, isActive: opt.active })} className={`mt-0.5 ${opt.checkedColor}`} />
            <div>
              <p className="text-xs font-bold text-gray-900">{opt.title}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{opt.desc}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}