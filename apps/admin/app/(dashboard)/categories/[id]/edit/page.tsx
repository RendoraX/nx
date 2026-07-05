'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useCategories } from '@/hooks/useCategories';
import { useUpdateCategory } from '@/hooks/useUpdateCategory';
import { CategoryForm } from '@/components/category/category.form';
import { CategoryService } from '@/services/cat.service';
import { Category } from '@/types/cat.types';

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const { categories } = useCategories();
  const { updateCategory } = useUpdateCategory();
  const [targetCat, setTargetCat] = useState<Category | null>(null);

  useEffect(() => {
    if (params?.id) {
      CategoryService.getById(params.id as string).then(res => {
        if (res) setTargetCat(res);
      });
    }
  }, [params]);

  const handleUpdate = async (data: any) => {
    if (targetCat) {
      await updateCategory({ ...data, id: targetCat.id });
      router.push('/categories');
    }
  };

  if (!targetCat) return <div className="text-xs text-gray-400 font-medium">Fetching record...</div>;

  return (
    <div className="space-y-4">
      <div className="mb-2">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Modify Element</h2>
        <p className="text-xs text-gray-400">Mutating category context attributes for ID: {targetCat.id}</p>
      </div>
      <CategoryForm 
        initialData={targetCat}
        parentOptions={categories} 
        onSubmit={handleUpdate} 
        onCancel={() => router.push('/categories')} 
      />
    </div>
  );
}