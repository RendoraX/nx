// apps/web/app/(auth)/reset-password/page.tsx
import React, { Suspense } from 'react';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';
import { Loader2 } from 'lucide-react';

export const metadata = {
  title: 'Reset Active Parameters',
  description: 'Finalize transactional overrides of profile structural login details.',
};

export default function ResetPasswordPage() {
  return (
    <Suspense 
      fallback={
        <div className="w-full max-w-[440px] h-[350px] bg-white rounded-3xl border border-gray-100 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-[#1F5E3B]" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}