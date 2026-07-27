'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLogout } from '../hooks/useLogout';
import { User } from '../types/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, setUser, loading, error, isAuthenticated, refreshSession } = useAuth();

  console.log("Auth User :: ", user );
  
  const { logout, logoutAll } = useLogout(() => setUser(null));

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        isLoading: loading, 
        error, 
        isAuthenticated, 
        refreshSession, 
        logout, 
        logoutAll, 
        setUser 
      }}
    >
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