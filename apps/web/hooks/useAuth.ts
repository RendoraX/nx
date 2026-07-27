// apps/web/hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import { AuthService } from '../services/auth.service';
import { User } from '../types/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshSession = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await AuthService.me();
      if (data?.success && data?.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err: any) {
      setUser(null);
      setError(err?.message || 'Authentication lifecycle state expired.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  return {
    user,
    setUser,
    loading,
    error,
    isAuthenticated: !!user,
    refreshSession,
  };
}