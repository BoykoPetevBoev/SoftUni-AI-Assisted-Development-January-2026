import { describe, it, expect, vi, beforeEach } from 'vitest';
import React, { type ReactNode } from 'react';
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDeleteTransaction } from './useDeleteTransaction';
import { transactionService } from '../services/transaction.service';
import { transactionKeys } from './transactionKeys';
import { budgetKeys } from './budgetKeys';
import { useToast } from './useToast';

vi.mock('../services/transaction.service');
vi.mock('./useToast', () => ({
  useToast: vi.fn(),
}));

const createWrapper = (queryClient: QueryClient) => ({
  children,
}: {
  children: ReactNode;
}) => React.createElement(QueryClientProvider, { client: queryClient }, children);

describe('useDeleteTransaction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deletes transaction and invalidates queries', async () => {
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
    vi.mocked(transactionService.deleteTransaction).mockResolvedValue(undefined);

    const { result } = renderHook(() => useDeleteTransaction(2), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      await result.current.mutateAsync(10);
    });

    expect(transactionService.deleteTransaction).toHaveBeenCalledWith(10);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: transactionKeys.lists() });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: budgetKeys.list() });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: budgetKeys.detail(2) });
    expect(showToast).toHaveBeenCalledWith('Transaction deleted successfully', 'success');
  });

  it('shows error toast when delete fails', async () => {
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
    vi.mocked(transactionService.deleteTransaction).mockRejectedValue(
      new Error('Delete failed')
    );

    const { result } = renderHook(() => useDeleteTransaction(2), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      await expect(result.current.mutateAsync(10)).rejects.toThrow('Delete failed');
    });

    expect(showToast).toHaveBeenCalledWith('Delete failed', 'error');
  });
});
