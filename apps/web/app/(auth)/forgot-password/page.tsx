// apps/web/app/(auth)/forgot-password/page.tsx
import React from 'react';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';

export const metadata = {
  title: 'Account Recovery Engine',
  description: 'Initiate account credential overrides by dispatching verification token indicators.',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}