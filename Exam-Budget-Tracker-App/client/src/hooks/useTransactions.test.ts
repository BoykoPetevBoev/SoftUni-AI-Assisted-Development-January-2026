import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTransactions } from './useTransactions';
import { transactionService } from '../services/transaction.service';
import type { TransactionListResponse } from '../types/transaction';

vi.mock('../services/transaction.service');
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

describe('useTransactions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it('fetches transactions successfully', async () => {
    const mockData: TransactionListResponse = {
      count: 1,
      next: null,
      previous: null,
      results: [
        {
          id: 1,
          budget: 1,
          amount: '120.00',
          category: 1,
          date: '2026-02-10',
          created_at: '2026-02-10T09:00:00Z',
          updated_at: '2026-02-10T09:00:00Z',
        },
      ],
    };

    vi.mocked(transactionService.getTransactions).mockResolvedValue(mockData);

    const { result } = renderHook(() => useTransactions(1), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
  });

  it('handles errors gracefully', async () => {
    const error = new Error('Network error');
    vi.mocked(transactionService.getTransactions).mockRejectedValue(error);

    const { result } = renderHook(() => useTransactions(1), { wrapper });

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });

    expect(result.current.data).toBeUndefined();
  });
});
