import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useBudgets } from './useBudgets';
import { budgetService } from '../services/budget.service';
import type { BudgetListResponse } from '../types/budget';

vi.mock('../services/budget.service');
vi.mock('./useAuth', () => ({
  useAuth: () => ({ isAuthenticated: true }),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(QueryClientProvider, { client: queryClient }, children);

describe('useBudgets', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it('fetches budgets successfully', async () => {
    const mockData: BudgetListResponse = {
      count: 2,
      next: null,
      previous: null,
      results: [
        {
          id: 1,
          user: 1,
          title: 'Monthly Budget',
          description: 'Test',
          date: '2026-02-15',
          initial_amount: '5000.00',
          created_at: '2026-02-15T10:00:00Z',
          updated_at: '2026-02-15T10:00:00Z',
        },
      ],
    };

    vi.mocked(budgetService.getBudgets).mockResolvedValue(mockData);

    const { result } = renderHook(() => useBudgets(), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
  });

  it('handles errors gracefully', async () => {
    const error = new Error('Network error');
    vi.mocked(budgetService.getBudgets).mockRejectedValue(error);

    const { result } = renderHook(() => useBudgets(), { wrapper });

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });

    expect(result.current.data).toBeUndefined();
  });

  it('uses correct query key', async () => {
    const mockData: BudgetListResponse = {
      count: 0,
      next: null,
      previous: null,
      results: [],
    };

    vi.mocked(budgetService.getBudgets).mockResolvedValue(mockData);

    renderHook(() => useBudgets(), { wrapper });

    await waitFor(() => {
      expect(budgetService.getBudgets).toHaveBeenCalled();
    });
  });
});
