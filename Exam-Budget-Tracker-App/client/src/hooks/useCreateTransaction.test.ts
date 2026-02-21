import { describe, it, expect, vi, beforeEach } from 'vitest';
import React, { type ReactNode } from 'react';
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCreateTransaction } from './useCreateTransaction';
import { transactionService } from '../services/transaction.service';
import { transactionKeys } from './transactionKeys';
import { budgetKeys } from './budgetKeys';
import { useToast } from './useToast';
import type { Transaction, CreateTransactionPayload } from '../types/transaction';

vi.mock('../services/transaction.service');
vi.mock('./useToast', () => ({
  useToast: vi.fn(),
}));

const mockTransaction: Transaction = {
  id: 1,
  budget: 2,
  amount: '250.00',
  category: 'Freelance',
  date: '2026-02-10',
  created_at: '2026-02-10T09:00:00Z',
  updated_at: '2026-02-10T09:00:00Z',
};

const createWrapper = (queryClient: QueryClient) => ({
  children,
}: {
  children: ReactNode;
}) => React.createElement(QueryClientProvider, { client: queryClient }, children);

describe('useCreateTransaction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates transaction and invalidates queries', async () => {
    const showToast = vi.fn();
    const queryClient = new QueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    vi.mocked(useToast).mockReturnValue({
      showToast,
      showSuccess: vi.fn(),
      showError: vi.fn(),
      showInfo: vi.fn(),
      showWarning: vi.fn(),
      removeToast: vi.fn(),
    });
    vi.mocked(transactionService.createTransaction).mockResolvedValue(mockTransaction);

    const { result } = renderHook(() => useCreateTransaction(), {
      wrapper: createWrapper(queryClient),
    });

    const payload: CreateTransactionPayload = {
      budget: 2,
      amount: '250.00',
      category: 'Freelance',
      date: '2026-02-10',
    };

    await act(async () => {
      await result.current.mutateAsync(payload);
    });

    expect(transactionService.createTransaction).toHaveBeenCalledWith(payload);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: transactionKeys.lists() });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: budgetKeys.list() });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: budgetKeys.detail(2) });
    expect(showToast).toHaveBeenCalledWith('Transaction created successfully', 'success');
  });

  it('shows error toast when create fails', async () => {
    const showToast = vi.fn();
    const queryClient = new QueryClient();

    vi.mocked(useToast).mockReturnValue({
      showToast,
      showSuccess: vi.fn(),
      showError: vi.fn(),
      showInfo: vi.fn(),
      showWarning: vi.fn(),
      removeToast: vi.fn(),
    });
    vi.mocked(transactionService.createTransaction).mockRejectedValue(new Error('Boom'));

    const { result } = renderHook(() => useCreateTransaction(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      await expect(
        result.current.mutateAsync({
          budget: 2,
          amount: '250.00',
          category: 'Freelance',
          date: '2026-02-10',
        })
      ).rejects.toThrow('Boom');
    });

    expect(showToast).toHaveBeenCalledWith('Boom', 'error');
  });
});
