// apps/web/app/(auth)/register/page.tsx
import React from 'react';
import { RegisterForm } from '@/components/auth/register-form';

export const metadata = {
  title: 'Register Profile Identity',
  description: 'Provision a baseline customer registry footprint inside the authorization system structure.',
};

export default function RegisterPage() {
  return <RegisterForm />;
}