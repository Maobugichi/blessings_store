import { createContext, useContext, type ReactNode } from 'react';
import { useMe } from '../hooks/useAuth';
import type { Admin } from '@/types/auth.types';

interface AuthContextType {
  admin: Admin | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isError: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}


export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { data, isLoading, isError } = useMe();

  const value: AuthContextType = {
    admin: data?.admin || null,
    isLoading,
    isAuthenticated: !!data?.admin,
    isError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


export const useAuthContext = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  
  return context;
};