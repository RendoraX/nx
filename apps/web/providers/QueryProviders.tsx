// apps/web/providers/query-provider.tsx
'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // Creating QueryClient inside state prevents sharing data across different user sessions during SSR
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes standard freshness baseline
            refetchOnWindowFocus: false, // Prevents aggressive background polling during navigation loops
            retry: 1, // Avoids overloading database pipelines under failure exceptions
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}