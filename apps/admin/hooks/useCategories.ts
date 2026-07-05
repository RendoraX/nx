import { useState, useEffect } from 'react';
import { Category } from '@/types/cat.types';
import { CategoryService } from '@/services/cat.service';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    const data = await CategoryService.getAll();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => { refresh(); }, []);

  return { categories, loading, refetch: refresh };
}