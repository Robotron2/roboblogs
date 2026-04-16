import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';
import api, { setAuthToken } from '../api/axios';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setAuth = useCallback((token: string, user: User) => {
    setAccessTokenState(token);
    setUserState(user);
    setAuthToken(token);
  }, []);

  const clearAuth = useCallback(() => {
    setAccessTokenState(null);
    setUserState(null);
    setAuthToken(null);
  }, []);

  const login = useCallback((user: User, token: string) => {
    setAuth(token, user);
  }, [setAuth]);

  // Robust Logout: calls API then clears state
  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
       console.error('Logout API failure:', error);
    } finally {
      clearAuth();
    }
  }, [clearAuth]);

  const setUser = useCallback((user: User) => {
    setUserState(user);
  }, []);

  // Session Rehydration on mount
  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
        
        // 1. Refresh the access token
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        if (refreshResponse.data?.success) {
          const { accessToken } = refreshResponse.data.data;
          
          // 2. Temporarily set token for profile fetch
          const headers = { Authorization: `Bearer ${accessToken}` };
          
          // 3. Fetch full user profile
          const userResponse = await axios.get(
            `${API_BASE_URL}/users/me`,
            { headers, withCredentials: true }
          );

          if (userResponse.data?.success) {
            setAuth(accessToken, userResponse.data.data);
          } else {
            clearAuth();
          }
        }
      } catch (error) {
        console.log('Session rehydration failed or no session exists.');
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAuth();
  }, [setAuth, clearAuth]);

  // Handle global auth failures (e.g. from axios interceptors)
  useEffect(() => {
    const handleFailure = () => clearAuth();
    window.addEventListener('auth-failure', handleFailure);
    return () => window.removeEventListener('auth-failure', handleFailure);
  }, [clearAuth]);

  const value: AuthContextType = {
    user,
    accessToken,
    isAuthenticated: !!user && !!accessToken,
    isAdmin: user?.role === 'admin',
    isLoading,
    login,
    logout,
    setUser,
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
