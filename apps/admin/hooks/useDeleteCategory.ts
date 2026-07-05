import { useState } from 'react';
import { CategoryService } from '@/services/cat.service';

export function useDeleteCategory() {
  const [loading, setLoading] = useState(false);

  const deleteCategory = async (id: string) => {
    setLoading(true);
    const success = await CategoryService.delete(id);
    setLoading(false);
    return success;
  };

  return { deleteCategory, loading };
}