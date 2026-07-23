// apps/web/app/(auth)/login/page.tsx
import React, { Suspense } from 'react';
import { LoginForm } from '@/components/auth/login-form';
import { Loader2 } from 'lucide-react';

export const metadata = {
  title: 'Secure Access Gateway',
  description: 'Provide configuration validation arrays to initialize session authentication parameters.',
};

export default function LoginPage() {
  return (
    <Suspense 
      fallback={
        <div className="w-full max-w-[440px] h-[400px] bg-white rounded-3xl border border-gray-100 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-[#1F5E3B]" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}