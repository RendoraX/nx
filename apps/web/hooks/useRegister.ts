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
            toast(err.message || JSON.parse(err.message)[0].message as string)
            setError(err.message || (JSON.parse(err.message))[0].message || 'User is not registered.');
          } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
}