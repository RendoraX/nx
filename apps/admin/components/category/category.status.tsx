import React from 'react';

export function CategoryStatus({ status }: { status: 'active' | 'inactive' }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-700'
    }`}>
      {status}
    </span>
  );
}