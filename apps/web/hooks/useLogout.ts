// apps/web/hooks/useLogout.ts
import { useState } from 'react';
import { AuthService } from '../services/auth.service';
import { useRouter } from 'next/navigation';

export function useLogout(onLogoutClear?: () => void) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const logout = async () => {
    try {
      setLoading(true);
      await AuthService.logout();
    } catch (err) {
      console.warn('Silent fallback logic resolved for localized cache states during slow logouts.');
    } finally {
      if (onLogoutClear) onLogoutClear();
      setLoading(false);
      router.push('/login');
      router.refresh();
    }
  };
  
  
  const logoutAll = async () => {
    try {
      setLoading(true);
      await AuthService.logoutAll();
    } catch (err) {
      console.warn('Silent fallback logic resolved for localized cache states during slow logouts.');
    } finally {
      if (onLogoutClear) onLogoutClear();
      setLoading(false);
      router.push('/login');
      router.refresh();
    }
  }

  return { logout ,logoutAll, loading };
}