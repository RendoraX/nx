import { useCallback, useEffect, useState } from 'react';
import { Category } from '@/types/cat.types';
import { CategoryService } from '@/services/cat.service';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await CategoryService.getAll();
      setCategories(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { categories, loading, refetch: refresh };
}