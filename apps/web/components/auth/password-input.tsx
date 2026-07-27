// components/auth/password-input.tsx
'use client';

import React, { useState, forwardRef, ComponentProps } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

interface PasswordInputProps extends Omit<ComponentProps<'input'>, 'type'> {
  label?: string;
  error?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label = 'Password', error, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="space-y-1.5 w-full text-left">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
          {label}
        </label>
        
        <div className="relative">
          <span className="absolute left-4 top-3.5 text-gray-400 pointer-events-none">
            <Lock className="w-4 h-4 stroke-1.5" />
          </span>

          <input
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            className={`w-full h-11 bg-[#F4F9F4]/40 border rounded-xl pl-11 pr-11 text-sm text-gray-800 placeholder-gray-400 transition-all focus:outline-none focus:border-[#1F5E3B] focus:bg-white focus:ring-1 focus:ring-[#1F5E3B] ${
              error ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-gray-200'
            } ${className}`}
            {...props}
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600 p-0.5 rounded transition-colors focus:outline-none focus:ring-1 focus:ring-[#1F5E3B]"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4 stroke-1.5" />
            ) : (
              <Eye className="w-4 h-4 stroke-1.5" />
            )}
          </button>
        </div>

        {error && (
          <p className="text-xs text-red-500 font-medium pt-0.5 flex items-center gap-1">
            <span>⚠️</span> {error}
          </p>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';