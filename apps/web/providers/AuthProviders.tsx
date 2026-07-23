// apps/web/providers/auth-provider.tsx
'use client';

import React, { createContext, useContext, ReactNode, use, Dispatch } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLogout } from '../hooks/useLogout';
import { User } from '../types/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
  logoutAll : () => Promise<void>;
  setUser : any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, setUser, loading, error, isAuthenticated, refreshSession } = useAuth();
  
  console.log('AuthProvider user:', user); // Debugging line to check the user state
  // Pass a local callback to clean out provider context memory synchronously
  const { logout , logoutAll } = useLogout(() => setUser(null));

  return (
    <AuthContext.Provider value={{ user, loading, error, isAuthenticated, refreshSession, logout , logoutAll , setUser}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be executed safely inside an AuthProvider element structure.');
  }
  return context;
}