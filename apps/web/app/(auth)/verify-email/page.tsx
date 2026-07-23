// apps/web/app/(auth)/verify-email/page.tsx
'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AuthService } from '@/services/auth.service';
import { AuthCard } from '@/components/auth/auth-card';
import { Loader2, CheckCircle2, XCircle, RefreshCw, ArrowRight } from 'lucide-react';

function VerifyEmailInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [resending, setResending] = useState(false);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    } else {
      setStatus('error');
      setMessage('Missing email registration parameter.');
    }
  }, [searchParams]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value.replace(/[^0-9]/g, '');
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      if (index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').substring(0, 6);
    if (pastedData.length === 6) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) {
      setStatus('error');
      setMessage('Please enter a valid 6-digit confirmation code.');
      return;
    }

    setStatus('submitting');
    setMessage('');

    try {
      const res = await AuthService.verifyEmail(fullOtp as string);
      if (res.success) {
        setStatus('success');
        setMessage('Identity confirmed successfully.');
        setTimeout(() => router.push('/login?verified=true'), 2500);
      }
    } catch (err: any) {
      setStatus('error');
      setMessage(err?.message || 'Verification failed. The code may be incorrect or expired.');
    }
  };

  const handleResend = async () => {
    if (!canResend || !email) return;
    setResending(true);
    setStatus('idle');
    setMessage('');
    try {
      await AuthService.resendVerificationOtp(email);
      setTimeLeft(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setStatus('error');
      setMessage(err?.message || 'Failed to dispatch new OTP code matrix.');
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthCard title="Verify Account" subtitle={`Enter the 6-digit ritual signature sent to ${email || 'your email'}.`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {(status === 'error' || message) && (
          <div className={`p-4 rounded-lg text-xs font-medium flex items-start gap-3 tracking-wide border backdrop-blur-sm ${status === 'success' ? 'bg-[#F4F9F4]/60 border-[#1F5E3B]/20 text-[#1F5E3B]' : 'bg-red-50/60 border-red-100/80 text-red-700'}`}>
            {status === 'success' ? <CheckCircle2 className="w-4 h-4 text-[#1F5E3B]" /> : <XCircle className="w-4 h-4 text-red-500" />}
            <span className="leading-relaxed">{message}</span>
          </div>
        )}

        {status === 'success' ? (
          <div className="py-6 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-[#1F5E3B]" />
            <span className="text-[11px] text-gray-400 font-medium tracking-wider uppercase">Redirecting to Catalog Credentials Checkpoint...</span>
          </div>
        ) : (
          <>
            <div className="flex justify-center gap-2.5 sm:gap-3.5" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  disabled={status === 'submitting'}
                  className="w-10 h-12 sm:w-12 sm:h-14 bg-[#FAF8F3]/60 border border-[#E6D5B8]/60 rounded-lg text-center text-lg font-bold text-gray-800 transition-all focus:outline-none focus:border-[#1F5E3B] focus:bg-white focus:ring-1 focus:ring-[#1F5E3B]/20 disabled:opacity-50"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={status === 'submitting' || otp.some(d => !d)}
              className="group w-full h-12 bg-[#1F5E3B] text-[#FAF8F3] font-semibold text-xs uppercase tracking-[0.2em] rounded-lg shadow-sm hover:bg-[#16442A] transition-all disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {status === 'submitting' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Verify Passcode</span>
                  <ArrowRight className="w-3.5 h-3.5 transform transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] font-medium tracking-wide">
              <span className="text-gray-400">
                {canResend ? 'Code expired.' : `Resend code option in ${timeLeft}s`}
              </span>
              <button
                type="button"
                onClick={handleResend}
                disabled={!canResend || resending}
                className="font-bold text-[#C89B3C] hover:text-[#1F5E3B] transition-colors flex items-center gap-1.5 disabled:text-gray-300 disabled:cursor-not-allowed"
              >
                {resending ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                <span>Request New OTP</span>
              </button>
            </div>
          </>
        )}
      </form>
    </AuthCard>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense 
      fallback={
        <div className="w-full max-w-[440px] h-[300px] bg-[#FAF8F3]/40 border border-[#E6D5B8]/40 rounded-3xl flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-[#1F5E3B]" />
        </div>
      }
    >
      <VerifyEmailInner />
    </Suspense>
  );
}