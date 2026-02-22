import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBudgetDetails } from './useBudgetDetails';
import { useBudget } from './useBudget';
import { useTransactions } from './useTransactions';
import { useDeleteTransaction } from './useDeleteTransaction';

vi.mock('./useBudget');
vi.mock('./useTransactions');
vi.mock('./useDeleteTransaction');

describe('useBudgetDetails', () => {
  const budget = {
    id: 1,
    user: 1,
    title: 'Household Budget',
    description: 'Monthly plan',
    date: '2026-02-10',
    initial_amount: '3500.50',
    balance: '1200.25',
    created_at: '2026-02-10T08:00:00Z',
    updated_at: '2026-02-10T08:00:00Z',
  };

  const transactions = {
    count: 2,
    next: null,
    previous: null,
    results: [
      {
        id: 101,
        budget: 1,
        amount: '200.00',
        category: 3,
        date: '2026-02-11',
        created_at: '2026-02-11T10:00:00Z',
        updated_at: '2026-02-11T10:00:00Z',
      },
      {
        id: 102,
        budget: 1,
        amount: '-50.00',
        category: 4,
        date: '2026-02-12',
        created_at: '2026-02-12T10:00:00Z',
        updated_at: '2026-02-12T10:00:00Z',
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useBudget).mockReturnValue({
      data: budget,
      isLoading: false,
      error: null,
    } as ReturnType<typeof useBudget>);

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

  it('returns formatted budget details and transactions', () => {
    const { result } = renderHook(() => useBudgetDetails(1));

    expect(result.current.budgetTitle).toBe('Household Budget');
    expect(result.current.budgetDescription).toBe('Monthly plan');
    expect(result.current.formattedDate).toMatch(/Feb/);
    expect(result.current.formattedDate).toMatch(/2026/);
    expect(result.current.formattedInitialAmount).toBe('$3,500.50');
    expect(result.current.formattedBalance).toBe('$1,200.25');
    expect(result.current.transactions).toHaveLength(2);
    expect(result.current.selectedTransaction).toBeNull();
  });

  it('manages create and edit form state', () => {
    const { result } = renderHook(() => useBudgetDetails(1));

    act(() => {
      result.current.openCreateForm();
    });

    expect(result.current.isFormOpen).toBe(true);
    expect(result.current.editingTransactionId).toBeNull();

    act(() => {
      result.current.openEditForm(102);
    });

    expect(result.current.isFormOpen).toBe(true);
    expect(result.current.editingTransactionId).toBe(102);

    act(() => {
      result.current.closeForm();
    });

    expect(result.current.isFormOpen).toBe(false);
    expect(result.current.editingTransactionId).toBeNull();
  });

  it('selects transactions and clears selection after delete', () => {
    const mutate = vi.fn((transactionId: number, options?: { onSuccess?: () => void }) => {
      options?.onSuccess?.();
    });

    vi.mocked(useDeleteTransaction).mockReturnValue({
      mutate,
      isPending: false,
    } as ReturnType<typeof useDeleteTransaction>);

    const { result } = renderHook(() => useBudgetDetails(1));

    act(() => {
      result.current.handleSelectTransaction(101);
    });

    expect(result.current.selectedTransactionId).toBe(101);
    expect(result.current.selectedTransaction?.id).toBe(101);

    act(() => {
      result.current.handleDeleteClick(101);
    });

    expect(result.current.deleteConfirmId).toBe(101);

    act(() => {
      result.current.handleConfirmDelete(101);
    });

    expect(mutate).toHaveBeenCalledWith(101, expect.any(Object));
    expect(result.current.deleteConfirmId).toBeNull();
    expect(result.current.selectedTransactionId).toBeNull();
  });

  it('cancels delete confirmation', () => {
    const { result } = renderHook(() => useBudgetDetails(1));

    act(() => {
      result.current.handleDeleteClick(102);
    });

    expect(result.current.deleteConfirmId).toBe(102);

    act(() => {
      result.current.handleCancelDelete();
    });

    expect(result.current.deleteConfirmId).toBeNull();
  });
});
