// apps/web/hooks/useRegister.ts
import { useState } from 'react';
import { AuthService } from '../services/auth.service';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const register = async (formData: Record<string, any>) => {
    try {
      setLoading(true);
      setError(null);
      const data = await AuthService.register(formData);
      if (data.success) {
        router.push(`/verify-email?email=${formData.email}`);
      }
    } catch (err: any) {
            toast(err.message)
      setError(err?.message || 'Account creation encountered unexpected complications.');
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
}