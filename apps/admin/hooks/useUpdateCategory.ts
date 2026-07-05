import { useState } from 'react';
import { UpdateCategoryInput } from '@/types/cat.types';
import { CategoryService } from '@/services/cat.service';

export function useUpdateCategory() {
  const [loading, setLoading] = useState(false);

  const updateCategory = async (input: UpdateCategoryInput) => {
    setLoading(true);
    const result = await CategoryService.update(input);
    setLoading(false);
    return result;
  };

  return { updateCategory, loading };
}