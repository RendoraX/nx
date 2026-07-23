// components/auth/register-form.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRegister } from '../../hooks/useRegister'; // Assumed custom hook mapping your register service
import { AuthCard } from './auth-card';
import { PasswordInput } from './password-input';
import { Mail, User, Phone, Loader2, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

export function RegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  
  // Explicitly mapping schema primitives: name, email, password, phone
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [validationError, setValidationError] = useState<string | null>(null);
  const { register, loading, error: serverError } = useRegister();

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!name || !email) {
      setValidationError('Please populate your name and email parameters.');
      return;
    }
    
    // Simple email pattern check before animating to next phase
    if (!/\S+@\S+\.\S+/.test(email)) {
      setValidationError('Please enter a valid email structural configuration.');
      return;
    }

    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!password || !confirmPassword) {
      setValidationError('Security configuration matrices cannot be vacant.');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Password signatures do not match validation confirmation.');
      return;
    }

    // Pass schema aligned payloads to data layers
    const success = await register({
      name,
      email,
      phone: phone || undefined, // Optional schema handling
      password,
    });

    // Direct routing target following validation rules
  };

  return (
    <AuthCard 
      title="Begin Journey" 
      subtitle="Establish a new registry profile to discover traditional wellness collections."
    >
      {/* Visual Step Indicator Progress Matrix */}
      <div className="flex items-center justify-between mb-8 max-w-[240px] mx-auto text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
        <span className={`transition-colors duration-300 ${step === 1 ? 'text-[#1F5E3B]' : 'text-[#C89B3C]'}`}>01 Identity</span>
        <div className="h-[1px] flex-1 mx-3 bg-[#E6D5B8]/40" />
        <span className={`transition-colors duration-300 ${step === 2 ? 'text-[#1F5E3B]' : ''}`}>02 Security</span>
      </div>

      {/* Luxury Error Indicator Block */}
      {(validationError || serverError) && (
        <div className="mb-5 p-4 bg-red-50/60 backdrop-blur-sm border border-red-100/80 rounded-lg text-xs text-red-700 font-medium flex items-start gap-3 tracking-wide">
          <span className="text-sm leading-none mt-0.5">✦</span>
          <span className="leading-relaxed">{validationError || serverError}</span>
        </div>
      )}

      <div className="relative overflow-hidden min-h-[310px]">
        {/* STEP 1: Core Personal Metrics */}
        {step === 1 && (
          <div className="space-y-4 text-left animate-slide-in-right">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 block">Full Name</label>
              <div className="relative group">
                <span className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#1F5E3B] transition-colors pointer-events-none">
                  <User className="w-4 h-4 stroke-[1.25]" />
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Acharya Sharma"
                  className="w-full h-11 bg-[#FAF8F3]/60 border border-[#E6D5B8]/60 rounded-lg pl-11 pr-4 text-xs font-medium text-gray-800 placeholder-gray-400/80 transition-all focus:outline-none focus:border-[#1F5E3B] focus:bg-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 block">Email Address</label>
              <div className="relative group">
                <span className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#1F5E3B] transition-colors pointer-events-none">
                  <Mail className="w-4 h-4 stroke-[1.25]" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full h-11 bg-[#FAF8F3]/60 border border-[#E6D5B8]/60 rounded-lg pl-11 pr-4 text-xs font-medium text-gray-800 placeholder-gray-400/80 transition-all focus:outline-none focus:border-[#1F5E3B] focus:bg-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 block">Phone Number</label>
                <span className="text-[9px] uppercase tracking-wider text-gray-400">Optional</span>
              </div>
              <div className="relative group">
                <span className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#1F5E3B] transition-colors pointer-events-none">
                  <Phone className="w-4 h-4 stroke-[1.25]" />
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full h-11 bg-[#FAF8F3]/60 border border-[#E6D5B8]/60 rounded-lg pl-11 pr-4 text-xs font-medium text-gray-800 placeholder-gray-400/80 transition-all focus:outline-none focus:border-[#1F5E3B] focus:bg-white"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleNextStep}
              className="group w-full h-12 bg-[#1F5E3B] text-[#FAF8F3] font-semibold text-xs uppercase tracking-[0.2em] rounded-lg shadow-sm transition-all hover:bg-[#16442A] flex items-center justify-center gap-2 mt-6 cursor-pointer"
            >
              <span>Continue Security Matrix</span>
              <ArrowRight className="w-3.5 h-3.5 transform transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        )}

        {/* STEP 2: Structural Verification Passwords */}
        {step === 2 && (
          <div className="space-y-4 text-left animate-slide-in-left">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 block">Choose Password</label>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 block">Confirm Password Verification</label>
              <PasswordInput
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={loading}
                className="w-12 h-12 border border-[#E6D5B8]/80 text-gray-600 rounded-lg transition-colors hover:bg-gray-50 disabled:opacity-50 flex items-center justify-center cursor-pointer"
                title="Return to profile configuration"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 h-12 bg-[#1F5E3B] text-[#FAF8F3] font-semibold text-xs uppercase tracking-[0.2em] rounded-lg shadow-sm transition-all hover:bg-[#16442A] disabled:bg-gray-100 disabled:text-gray-400 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Initialize Profile</span>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Structural System Navigation Footnote Links */}
      <p className="text-center text-[11px] text-gray-400 font-medium tracking-wide pt-6 border-t border-gray-100 mt-4">
        Already registered inside our gateway?{' '}
        <Link 
          href="/login" 
          className="font-bold text-[#C89B3C] hover:text-[#1F5E3B] transition-colors underline underline-offset-4 decoration-[#C89B3C]/30"
        >
          Sign In
        </Link>
      </p>
    </AuthCard>
  );
}