// components/auth/forgot-password-form.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AuthService } from '../../services/auth.service';
import { AuthCard } from './auth-card';
import { Mail, Loader2, CheckCircle2 } from 'lucide-react';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Fires the secure network sweep that obscures user presence data
      await AuthService.forgotPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || 'Unable to parse password recovery pipelines.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthCard title="Check Your Inbox" subtitle="Recovery request logged successfully.">
        <div className="space-y-6 text-center py-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#F4F9F4] text-[#1F5E3B] mb-2">
            <CheckCircle2 className="w-6 h-6 stroke-1.5" />
          </div>
          <p className="text-sm text-gray-600 font-light leading-relaxed">
            If an account matches <strong className="font-semibold text-gray-900">{email}</strong> inside our directory, a secure authorization update payload link will resolve shortly.
          </p>
          <div className="pt-2">
            <Link 
              href="/login" 
              className="text-xs font-bold uppercase tracking-widest text-[#1F5E3B] hover:text-[#16442A] transition-colors focus:outline-none"
            >
              Return to Login
            </Link>
          </div>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard 
      title="Recover Password" 
      subtitle="Request a verification link to override existing account signatures."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {error && (
          <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-medium flex items-start gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-1.5 text-left">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
            Email Address
          </label>
          <div className="relative">
            <span className="absolute left-4 top-3.5 text-gray-400 pointer-events-none">
              <Mail className="w-4 h-4 stroke-1.5" />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
              className="w-full h-11 bg-[#F4F9F4]/40 border border-gray-200 rounded-xl pl-11 pr-4 text-sm text-gray-800 placeholder-gray-400 transition-all focus:outline-none focus:border-[#1F5E3B] focus:bg-white focus:ring-1 focus:ring-[#1F5E3B]"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-[#1F5E3B] hover:bg-[#16442A] text-white disabled:bg-gray-100 disabled:text-gray-400 font-bold text-xs uppercase tracking-widest rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Reset Vector'}
        </button>

        <p className="text-center text-xs text-gray-500 pt-2">
          Remembered your password?{' '}
          <Link href="/login" className="font-bold text-[#1F5E3B] hover:underline focus:outline-none">
            Log In
          </Link>
        </p>

      </form>
    </AuthCard>
  );
}