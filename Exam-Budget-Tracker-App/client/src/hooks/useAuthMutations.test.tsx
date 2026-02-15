import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ReactNode } from 'react';
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useLoginMutation,
  useRegisterMutation,
  useFetchCurrentUser,
  useLogoutMutation,
} from './useAuthMutations';
import {
  loginUser,
  registerUser,
  getCurrentUser,
  logoutUser,
} from '../services/auth.service';
import type { User } from '../types/auth';

vi.mock('../services/auth.service', () => ({
  loginUser: vi.fn(),
  registerUser: vi.fn(),
  getCurrentUser: vi.fn(),
  logoutUser: vi.fn(),
}));

const createWrapper = (queryClient: QueryClient) => ({
  children,
}: {
  children: ReactNode;
}) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;

describe('useAuthMutations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('useLoginMutation calls loginUser with credentials', async () => {
    const queryClient = new QueryClient();
    vi.mocked(loginUser).mockResolvedValue({ access: 'token', refresh: 'refresh' });

    const { result } = renderHook(() => useLoginMutation(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      await result.current.mutateAsync({ username: 'user', password: 'pass' });
    });

    expect(loginUser).toHaveBeenCalledWith('user', 'pass');
  });

  it('useRegisterMutation calls registerUser with payload', async () => {
    const queryClient = new QueryClient();
    const mockUser: User = {
      id: 1,
      username: 'user',
      email: 'user@example.com',
      first_name: 'User',
      last_name: 'Test',
    };

    vi.mocked(registerUser).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useRegisterMutation(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      await result.current.mutateAsync({
        username: 'user',
        email: 'user@example.com',
        password: 'password',
        passwordConfirm: 'password',
      });
    });

    expect(registerUser).toHaveBeenCalledWith('user', 'user@example.com', 'password', 'password');
  });

  it('useFetchCurrentUser respects enabled flag', async () => {
    const queryClient = new QueryClient();

    renderHook(() => useFetchCurrentUser(false), {
      wrapper: createWrapper(queryClient),
    });

    expect(getCurrentUser).not.toHaveBeenCalled();
  });

  it('useLogoutMutation removes current user cache on success', async () => {
    const queryClient = new QueryClient();
    vi.mocked(logoutUser).mockResolvedValue({ detail: 'ok' });

    queryClient.setQueryData(['auth', 'currentUser'], { id: 1 });

    const { result } = renderHook(() => useLogoutMutation(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      await result.current.mutateAsync('refresh');
    });

    expect(queryClient.getQueryData(['auth', 'currentUser'])).toBeUndefined();
  });

  it('useLogoutMutation removes current user cache on error', async () => {
    const queryClient = new QueryClient();
    vi.mocked(logoutUser).mockRejectedValue(new Error('fail'));

    queryClient.setQueryData(['auth', 'currentUser'], { id: 1 });

    const { result } = renderHook(() => useLogoutMutation(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      await expect(result.current.mutateAsync('refresh')).rejects.toThrow('fail');
    });

    expect(queryClient.getQueryData(['auth', 'currentUser'])).toBeUndefined();
  });
});
