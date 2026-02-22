import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTransactionList } from './useTransactionList';
import { useTransactions } from './useTransactions';
import { useDeleteTransaction } from './useDeleteTransaction';

vi.mock('./useTransactions');
vi.mock('./useDeleteTransaction');

describe('useTransactionList', () => {
  const transactions = {
    count: 1,
    next: null,
    previous: null,
    results: [
      {
        id: 11,
        budget: 1,
        amount: '125.00',
        category: 2,
        date: '2026-02-18',
        created_at: '2026-02-18T10:00:00Z',
        updated_at: '2026-02-18T10:00:00Z',
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useTransactions).mockReturnValue({
      data: transactions,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as ReturnType<typeof useTransactions>);

    vi.mocked(useDeleteTransaction).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as ReturnType<typeof useDeleteTransaction>);
  });

  it('returns transactions data', () => {
    const { result } = renderHook(() => useTransactionList(1));

    expect(result.current.transactions).toHaveLength(1);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('handles delete confirmation flow', () => {
    const mutate = vi.fn((transactionId: number, options?: { onSuccess?: () => void }) => {
      options?.onSuccess?.();
    });

    vi.mocked(useDeleteTransaction).mockReturnValue({
      mutate,
      isPending: false,
    } as ReturnType<typeof useDeleteTransaction>);

    const { result } = renderHook(() => useTransactionList(1));

    act(() => {
      result.current.handleDeleteClick(11);
    });

    expect(result.current.deleteConfirmId).toBe(11);

    act(() => {
      result.current.handleConfirmDelete(11);
    });

    expect(mutate).toHaveBeenCalledWith(11, expect.any(Object));
    expect(result.current.deleteConfirmId).toBeNull();
  });

  it('cancels delete confirmation', () => {
    const { result } = renderHook(() => useTransactionList(1));

    act(() => {
      result.current.handleDeleteClick(11);
    });

    expect(result.current.deleteConfirmId).toBe(11);

    act(() => {
      result.current.handleCancelDelete();
    });

    expect(result.current.deleteConfirmId).toBeNull();
  });
});
