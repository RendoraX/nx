// components/auth/reset-password-form.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthService } from '../../services/auth.service';
import { PasswordInput } from './password-input';
import { AuthCard } from './auth-card';
import { Loader2 } from 'lucide-react';

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    // Unpack secure access matrix tokens from inbound URL parameters
    const queryToken = searchParams.get('token');
    if (!queryToken) {
      setValidationError('Missing cryptographic token parameters. Return to recovery lifecycle.');
    } else {
      setToken(queryToken);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setServerError(null);

    if (!token) {
      setValidationError('Authentication parameter token stack unverified.');
      return;
    }

    if (password.length < 8) {
      setValidationError('Security profile mandates a password length ≥ 8 parameters.');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Target credentials do not match confirmed entry arrays.');
      return;
    }

    try {
      setLoading(true);
      const data = await AuthService.resetPassword({ token, password });
      if (data.success) {
        router.push('/login?message=credentials_updated');
      }
    } catch (err: any) {
      setServerError(err?.message || 'Credential transmission rejected by remote host.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard 
      title="Set New Password" 
      subtitle="Input parameters to override database identity variables."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {(validationError || serverError) && (
          <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-medium flex items-start gap-2">
            <span>⚠️</span>
            <span>{validationError || serverError}</span>
          </div>
        )}

        <PasswordInput
          label="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Minimum 8 characters"
          disabled={!token || loading}
          required
        />

        <PasswordInput
          label="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Repeat password string"
          disabled={!token || loading}
          required
        />

        <button
          type="submit"
          disabled={!token || loading}
          className="w-full h-11 bg-[#2B2B2B] hover:bg-[#1F5E3B] text-white disabled:bg-gray-100 disabled:text-gray-400 font-bold text-xs uppercase tracking-widest rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Parameter Override'}
        </button>

      </form>
    </AuthCard>
  );
}