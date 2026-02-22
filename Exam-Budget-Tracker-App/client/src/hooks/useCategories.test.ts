import { describe, it, expect, beforeEach, vi } from 'vitest';
import React, { type ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCategories } from './useCategories';
import { categoryService } from '../services/category.service';
import { useAuth } from './useAuth';

vi.mock('../services/category.service');
vi.mock('./useAuth');

const createWrapper = (queryClient: QueryClient) => ({
  children,
}: {
  children: ReactNode;
}) => React.createElement(QueryClientProvider, { client: queryClient }, children);

describe('useCategories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return empty results when loading', () => {
    const queryClient = new QueryClient();
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      user: null,
      logout: vi.fn(),
      isLoading: false,
      error: null,
      login: vi.fn(),
      register: vi.fn(),
      clearError: vi.fn(),
    });

    vi.mocked(categoryService.getCategories).mockImplementationOnce(
      () => new Promise(() => {}) // Never resolves
    );

    const { result } = renderHook(() => useCategories(), {
      wrapper: createWrapper(queryClient),
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('should not fetch when not authenticated', () => {
    const queryClient = new QueryClient();
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      user: null,
      logout: vi.fn(),
      isLoading: false,
      error: null,
      login: vi.fn(),
      register: vi.fn(),
      clearError: vi.fn(),
    });

    renderHook(() => useCategories(), { wrapper: createWrapper(queryClient) });

    expect(categoryService.getCategories).not.toHaveBeenCalled();
  });

  it('should fetch categories when authenticated', async () => {
    const queryClient = new QueryClient();
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      user: null,
      logout: vi.fn(),
      isLoading: false,
      error: null,
      login: vi.fn(),
      register: vi.fn(),
      clearError: vi.fn(),
    });

    const mockCategories = {
      count: 2,
      next: null,
      previous: null,
      results: [
        {
          id: 1,
          user: 1,
          name: 'Groceries',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ],
    };

    vi.mocked(categoryService.getCategories).mockResolvedValue(mockCategories);

    const { result } = renderHook(() => useCategories(), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockCategories);
  });

  it('should handle errors', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      user: null,
      logout: vi.fn(),
      isLoading: false,
      error: null,
      login: vi.fn(),
      register: vi.fn(),
      clearError: vi.fn(),
    });

    const mockError = new Error('Failed to fetch');
    vi.mocked(categoryService.getCategories).mockRejectedValue(mockError);

    const { result } = renderHook(() => useCategories(), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeDefined();
  });
});
