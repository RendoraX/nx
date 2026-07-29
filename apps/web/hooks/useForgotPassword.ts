import { useState } from 'react';
import { AuthService } from '@/services/auth.service';

export function useForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const requestReset = async (email: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await AuthService.forgotPassword(email);
      if (res.success) {
        setSuccess(true);
      } else {
        setError(res.message || 'Failed to send reset link.');
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return { requestReset, loading, error, success };
}