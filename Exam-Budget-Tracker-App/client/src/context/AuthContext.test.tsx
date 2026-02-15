import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ReactNode } from 'react';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider } from './AuthContext';
import { useAuth } from '../hooks/useAuth';
import {
  useLoginMutation,
  useRegisterMutation,
  useFetchCurrentUser,
  useLogoutMutation,
} from '../hooks/useAuthMutations';
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from '../utils/tokenStorage';
import type { AuthResponse, User } from '../types/auth';
import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query';

vi.mock('../hooks/useAuthMutations', () => ({
  useLoginMutation: vi.fn(),
  useRegisterMutation: vi.fn(),
  useFetchCurrentUser: vi.fn(),
  useLogoutMutation: vi.fn(),
}));

vi.mock('../utils/tokenStorage', () => ({
  getAccessToken: vi.fn(),
  getRefreshToken: vi.fn(),
  setTokens: vi.fn(),
  clearTokens: vi.fn(),
}));

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthContext', () => {
  const mockUser: User = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    first_name: 'Test',
    last_name: 'User',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useLoginMutation).mockReturnValue({
      mutateAsync: vi.fn(),
    } as unknown as UseMutationResult<
      AuthResponse,
      Error,
      { username: string; password: string },
      unknown
    >);
    vi.mocked(useRegisterMutation).mockReturnValue({
      mutateAsync: vi.fn(),
    } as unknown as UseMutationResult<
      User,
      Error,
      { username: string; email: string; password: string; passwordConfirm: string },
      unknown
    >);
    vi.mocked(useLogoutMutation).mockReturnValue({
      mutateAsync: vi.fn(),
    } as unknown as UseMutationResult<{ detail: string }, Error, string, unknown>);
    vi.mocked(useFetchCurrentUser).mockReturnValue({
      data: null,
      isLoading: false,
      refetch: vi.fn(),
    } as unknown as UseQueryResult<User, Error>);
    vi.mocked(getAccessToken).mockReturnValue(null);
    vi.mocked(getRefreshToken).mockReturnValue(null);
  });

  it('exposes authenticated user', () => {
    vi.mocked(getAccessToken).mockReturnValue('access');
    vi.mocked(useFetchCurrentUser).mockReturnValue({
      data: mockUser,
      isLoading: false,
      refetch: vi.fn(),
    } as unknown as UseQueryResult<User, Error>);

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('login sets tokens and refetches user', async () => {
    const refetchUser = vi.fn();
    const loginMutation = {
      mutateAsync: vi.fn().mockResolvedValue({ access: 'a', refresh: 'r' }),
    } as unknown as UseMutationResult<
      AuthResponse,
      Error,
      { username: string; password: string },
      unknown
    >;

    vi.mocked(useLoginMutation).mockReturnValue(loginMutation);
    vi.mocked(useFetchCurrentUser).mockReturnValue({
      data: null,
      isLoading: false,
      refetch: refetchUser,
    } as unknown as UseQueryResult<User, Error>);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('user', 'pass');
    });

    expect(loginMutation.mutateAsync).toHaveBeenCalledWith({ username: 'user', password: 'pass' });
    expect(setTokens).toHaveBeenCalledWith('a', 'r');
    expect(refetchUser).toHaveBeenCalled();
  });

  it('register calls register mutation', async () => {
    const registerMutation = {
      mutateAsync: vi.fn().mockResolvedValue(mockUser),
    } as unknown as UseMutationResult<
      User,
      Error,
      { username: string; email: string; password: string; passwordConfirm: string },
      unknown
    >;
    vi.mocked(useRegisterMutation).mockReturnValue(registerMutation);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.register('user', 'user@example.com', 'pass', 'pass');
    });

    expect(registerMutation.mutateAsync).toHaveBeenCalledWith({
      username: 'user',
      email: 'user@example.com',
      password: 'pass',
      passwordConfirm: 'pass',
    });
  });

  it('logout clears tokens and calls logout mutation', async () => {
    const logoutMutation = {
      mutateAsync: vi.fn().mockResolvedValue({ detail: 'ok' }),
    } as unknown as UseMutationResult<{ detail: string }, Error, string, unknown>;
    vi.mocked(useLogoutMutation).mockReturnValue(logoutMutation);
    vi.mocked(getRefreshToken).mockReturnValue('refresh');

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.logout();
    });

    expect(logoutMutation.mutateAsync).toHaveBeenCalledWith('refresh');
    expect(clearTokens).toHaveBeenCalled();
  });
});
