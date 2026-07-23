// apps/web/app/(auth)/layout.tsx
import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#FAFCFA] px-4 py-12 relative overflow-hidden">
      {/* Decorative Brand Graphic Background Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#1F5E3B]/[0.02] blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#CDE3CD]/[0.1] blur-3xl pointer-events-none" />
      
      {/* Central Interactive Focus Area Container */}
      <div className="w-full flex justify-center items-center z-10 relative">
        {children}
      </div>
    </main>
  );
}