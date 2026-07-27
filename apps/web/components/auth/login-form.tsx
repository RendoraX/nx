// components/auth/login-form.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLogin } from '../../hooks/useLogin';
import { PasswordInput } from './password-input';
import { AuthCard } from './auth-card';
import { Mail, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';


export function LoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const { login, loading, error: serverError } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!email || !password) {
      setValidationError('Please populate all required validation fields.');
      return;
    }

    const redirectTo = searchParams.get('redirectTo') || '/';
    await login({
      email,
      password
      },
      redirectTo
  );
  };

  return (
    <AuthCard 
      title="Welcome Back" 
      subtitle="Sign in to access your bespoke rituals and premium wellness collection."
    >
      <form onSubmit={handleSubmit} className="space-y-6 text-left">
        
        {/* Luxury Glassmorphism Alert System */}
        {(validationError || serverError) && (
          <div className="p-4 bg-red-50/60 backdrop-blur-sm border border-red-100/80 rounded-lg text-xs text-red-700 font-medium flex items-start gap-3 animate-fade-in tracking-wide">
            <span className="text-sm leading-none mt-0.5">✦</span>
            <span className="leading-relaxed">{validationError || serverError}</span>
          </div>
        )}

        {/* Email Field Panel */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 block">
            Email Address
          </label>
          <div className="relative group">
            <span className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#1F5E3B] transition-colors duration-300 pointer-events-none">
              <Mail className="w-4 h-4 stroke-[1.25]" />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
              className="w-full h-11 bg-[#FAF8F3]/60 border border-[#E6D5B8]/60 rounded-lg pl-11 pr-4 text-xs font-medium text-gray-800 placeholder-gray-400/80 transition-all duration-300 focus:outline-none focus:border-[#1F5E3B] focus:bg-white focus:ring-1 focus:ring-[#1F5E3B]/20"
              required
            />
          </div>
        </div>

        {/* Password Field Panel */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 block">
              Password
            </label>
            <Link 
              href="/forgot-password" 
              className="text-[10px] font-bold uppercase tracking-wider text-[#C89B3C] hover:text-[#1F5E3B] transition-colors duration-300 focus:outline-none focus:underline"
            >
              Forgot?
            </Link>
          </div>
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Luxury Signature Call-to-Action */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full h-12 bg-[#1F5E3B] text-[#FAF8F3] font-semibold text-xs uppercase tracking-[0.2em] rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:bg-[#16442A] disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Verify & Enter</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2] transform transition-transform duration-300 group-hover:translate-x-1" />
              </>
            )}
          </button>
        </div>

        {/* Structural Navigation Footnote */}
        <p className="text-center text-[11px] text-gray-400 font-medium tracking-wide pt-2">
          New to Shri Ayurved?{' '}
          <Link 
            href="/register" 
            className="font-bold text-[#C89B3C] hover:text-[#1F5E3B] transition-colors duration-300 focus:outline-none underline underline-offset-4 decoration-[#C89B3C]/30 hover:decoration-[#1F5E3B]"
          >
            Create an Account
          </Link>
        </p>

      </form>
    </AuthCard>
  );
}