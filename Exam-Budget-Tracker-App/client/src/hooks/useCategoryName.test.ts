import { describe, it, expect, vi } from 'vitest';
import React, { type ReactNode } from 'react';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCategoryName } from './useCategoryName';
import { useCategories } from './useCategories';

vi.mock('./useCategories');

describe('useCategoryName', () => {
  const mockUseCategories = vi.mocked(useCategories);

  const createWrapper = () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    return ({ children }: { children: ReactNode }) =>
      React.createElement(QueryClientProvider, { client: queryClient }, children);
  };

  it('should return "Uncategorized" when categoryId is null', () => {
    mockUseCategories.mockReturnValue({
      data: { results: [] },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const { result } = renderHook(() => useCategoryName(null), {
      wrapper: createWrapper(),
    });

    expect(result.current).toBe('Uncategorized');
  });

  it('should return "Uncategorized" when categoryId is undefined', () => {
    mockUseCategories.mockReturnValue({
      data: { results: [] },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const { result } = renderHook(() => useCategoryName(undefined), {
      wrapper: createWrapper(),
    });

    expect(result.current).toBe('Uncategorized');
  });

  it('should return category name when found', () => {
    mockUseCategories.mockReturnValue({
      data: {
        results: [
          {
            id: 1,
            user: 1,
            name: 'Groceries',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
          },
        ],
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const { result } = renderHook(() => useCategoryName(1), {
      wrapper: createWrapper(),
    });

    expect(result.current).toBe('Groceries');
  });

  it('should return fallback when category not found', () => {
    mockUseCategories.mockReturnValue({
      data: {
        results: [
          {
            id: 1,
            user: 1,
            name: 'Groceries',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
          },
        ],
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const { result } = renderHook(() => useCategoryName(999), {
      wrapper: createWrapper(),
    });

    expect(result.current).toBe('Category 999');
  });

  it('should return "Uncategorized" when categories data is undefined', () => {
    mockUseCategories.mockReturnValue({
      data: undefined,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const { result } = renderHook(() => useCategoryName(null), {
      wrapper: createWrapper(),
    });

    expect(result.current).toBe('Uncategorized');
  });

  it('should return fallback when data is undefined and categoryId is provided', () => {
    mockUseCategories.mockReturnValue({
      data: undefined,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const { result } = renderHook(() => useCategoryName(1), {
      wrapper: createWrapper(),
    });

    expect(result.current).toBe('Category 1');
  });
});
