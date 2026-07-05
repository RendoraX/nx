import { useState } from 'react';
import { CreateCategoryInput } from '@/types/cat.types';
import { CategoryService } from '@/services/cat.service';

export function useCreateCategory() {
  const [loading, setLoading] = useState(false);

  const createCategory = async (input: CreateCategoryInput) => {
    setLoading(true);
    const result = await CategoryService.create(input);
    setLoading(false);
    return result;
  };

  return { createCategory, loading };
}