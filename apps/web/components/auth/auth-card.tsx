// components/auth/auth-card.tsx
'use client';

import React from 'react';

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthCard({ children, title, subtitle }: AuthCardProps) {
  return (
    <div className="w-full max-w-[440px] bg-white rounded-3xl border border-[#CDE3CD]/60 p-8 sm:p-10 shadow-[0_20px_50px_rgba(31,94,59,0.02)]">
      {/* Brand Identity Minimal Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-gray-500 font-light px-2">
            {subtitle}
          </p>
        )}
      </div>

      {/* Internal Interactive Fields */}
      {children}
    </div>
  );
}