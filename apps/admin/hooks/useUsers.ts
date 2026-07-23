'use client';
import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/user.service';
import { UserSummary } from '@/types/users';

export function useUsers() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['users-list'],
    queryFn: () => userService.getUsersList(),
    staleTime: 5 * 60 * 1000,   // Data remains fresh in memory for 5 minutes (prevents API re-fetching spam)
    gcTime: 10 * 60 * 1000,     // Garbage collection holds onto cache for 10 minutes
    refetchOnWindowFocus: false, // Prevents sudden API firestorms when switching windows/browser tabs
    refetchOnMount: false,
  });

  const users = data || [];

  // Single-pass structural aggregation for user metrics summary
  const summary: UserSummary = users.reduce(
    (acc, current) => {
      acc.total++;
      if (current.role === 'ADMIN') acc.admins++;
      if (current.status === 'suspended') acc.suspended++;
      if (!current.isVerified) acc.unverified++;
      return acc;
    },
    { total: 0, admins: 0, suspended: 0, unverified: 0 }
  );

  return { 
    users, 
    summary, 
    loading: isLoading, 
    refetch 
  };
}