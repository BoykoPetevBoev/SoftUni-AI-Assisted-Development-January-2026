import { describe, it, expect, vi, beforeEach } from 'vitest';
import React, { type ReactNode } from 'react';
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUpdateTransaction } from './useUpdateTransaction';
import { transactionService } from '../services/transaction.service';
import { transactionKeys } from './transactionKeys';
import { budgetKeys } from './budgetKeys';
import { useToast } from './useToast';
import type { Transaction } from '../types/transaction';

vi.mock('../services/transaction.service');
vi.mock('./useToast', () => ({
  useToast: vi.fn(),
}));

const mockTransaction: Transaction = {
  id: 1,
  budget: 1,
  amount: '-25.00',
  category: 5,
  date: '2026-02-10',
  created_at: '2026-02-10T10:00:00Z',
  updated_at: '2026-02-10T10:00:00Z',
};

const createWrapper = (queryClient: QueryClient) => ({
  children,
}: {
  children: ReactNode;
}) => React.createElement(QueryClientProvider, { client: queryClient }, children);

describe('useUpdateTransaction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('updates transaction and invalidates queries', async () => {
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
    vi.mocked(transactionService.updateTransaction).mockResolvedValue(mockTransaction);

    const { result } = renderHook(() => useUpdateTransaction(1), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      await result.current.mutateAsync({ amount: '-25.00' });
    });

    expect(transactionService.updateTransaction).toHaveBeenCalledWith(1, { amount: '-25.00' });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: transactionKeys.lists() });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: transactionKeys.detail(1) });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: budgetKeys.list() });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: budgetKeys.detail(1) });
    expect(showToast).toHaveBeenCalledWith('Transaction updated successfully', 'success');
  });

  it('throws when transactionId is missing', async () => {
    const queryClient = new QueryClient();
    const { result } = renderHook(() => useUpdateTransaction(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      await expect(result.current.mutateAsync({ amount: '-10.00' })).rejects.toThrow(
        'Transaction ID is required'
      );
    });
  });

  it('shows error toast when update fails', async () => {
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
    vi.mocked(transactionService.updateTransaction).mockRejectedValue(new Error('Update failed'));

    const { result } = renderHook(() => useUpdateTransaction(1), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      await expect(result.current.mutateAsync({ amount: '-10.00' })).rejects.toThrow(
        'Update failed'
      );
    });

    expect(showToast).toHaveBeenCalledWith('Update failed', 'error');
  });
});
