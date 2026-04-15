import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setAccessToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);

  const login = useCallback((user: User, token: string) => {
    setUserState(user);
    setAccessTokenState(token);
  }, []);

  const logout = useCallback(() => {
    setUserState(null);
    setAccessTokenState(null);
  }, []);

  const setUser = useCallback((user: User) => {
    setUserState(user);
  }, []);

  const setAccessToken = useCallback((token: string) => {
    setAccessTokenState(token);
  }, []);

  const value: AuthContextType = {
    user,
    accessToken,
    isAuthenticated: !!user && !!accessToken,
    isAdmin: user?.role === 'admin',
    login,
    logout,
    setUser,
    setAccessToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
