// hooks/useProductFilters.ts
'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';

export interface FilterState {
  page: number;
  limit: number;
  search: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  sort: string;
  order: 'asc' | 'desc' | '';
}

export function useProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Read current URL state or fall back to defaults
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 20;
  const category = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sort = searchParams.get('sort') || 'newest';
  const order = (searchParams.get('order') as 'asc' | 'desc') || '';

  // Local state for search string to allow immediate typing visual feedback
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const debouncedSearch = useDebounce(searchInput, 400);

  // 2. Multi-parameter atomic updater function
  const setFilters = useCallback(
    (updates: Partial<FilterState>) => {
      const params = new URLSearchParams(searchParams.toString());

      // Evaluate updates
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      // Reset page to 1 if user changes structural filters (search, category, price)
      if (
        'search' in updates ||
        'category' in updates ||
        'minPrice' in updates ||
        'maxPrice' in updates
      ) {
        params.set('page', '1');
      }

      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  // 3. Sync local text input when debounced value matures
  useEffect(() => {
    const currentSearch = searchParams.get('search') || '';
    if (debouncedSearch !== currentSearch) {
      setFilters({ search: debouncedSearch });
    }
  }, [debouncedSearch, searchParams, setFilters]);

  // Sync back local input if external changes happen (e.g., clicking "Clear Filters")
  useEffect(() => {
    setSearchInput(searchParams.get('search') || '');
  }, [searchParams]);

  const clearFilters = useCallback(() => {
    setSearchInput('');
    router.push(pathname);
  }, [router, pathname]);

  return {
    filters: {
      page,
      limit,
      search: searchParams.get('search') || '',
      category,
      minPrice,
      maxPrice,
      sort,
      order,
    },
    searchInput,
    setSearchInput,
    setFilters,
    clearFilters,
  };
}