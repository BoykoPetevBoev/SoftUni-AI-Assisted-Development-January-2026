import React, { createContext, useState } from 'react';
import type { User } from '../types/auth';
import { setTokens, clearTokens, getAccessToken, getRefreshToken } from '../utils/tokenStorage';
import {
  useLoginMutation,
  useRegisterMutation,
  useFetchCurrentUser,
  useLogoutMutation,
} from '../hooks/useAuthMutations';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, passwordConfirm: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

/* eslint-disable react-refresh/only-export-components */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [error, setError] = useState<string | null>(null);

  const accessToken = getAccessToken();

  // Query hooks
  const { data: user, isLoading: isLoadingUser, refetch: refetchUser } = useFetchCurrentUser(
    !!accessToken
  );

  // Mutations
  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const logoutMutation = useLogoutMutation();

  const login = async (username: string, password: string) => {
    try {
      setError(null);

      const response = await loginMutation.mutateAsync({
        username,
        password,
      });

      setTokens(response.access, response.refresh);

      // Refetch current user with new token
      await refetchUser();
    } catch (err) {
      const errorMessage = (err as { data?: { detail?: string }; message?: string })?.data?.detail || (err as { data?: { detail?: string }; message?: string })?.message || 'Login failed';
      setError(errorMessage);
      throw err;
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    passwordConfirm: string
  ) => {
    try {
      setError(null);

      await registerMutation.mutateAsync({
        username,
        email,
        password,
        passwordConfirm,
      });
    } catch (err) {
      const errorMessage = (err as { data?: { detail?: string }; message?: string })?.data?.detail || (err as { data?: { detail?: string }; message?: string })?.message || 'Registration failed';
      setError(errorMessage);
      throw err;
    }
  };

  const logout = async () => {
    const refreshToken = getRefreshToken();

    try {
      if (refreshToken) {
        await logoutMutation.mutateAsync(refreshToken);
      }
    } catch {
      // Even if logout fails on server, clear local tokens
      // Error is silently handled as logout should succeed locally
    } finally {
      clearTokens();
    }
  };

  const clearError = () => {
    setError(null);
  };

  const isLoading = isLoadingUser && !accessToken;

  const value: AuthContextType = {
    user: user || null,
    isLoading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
