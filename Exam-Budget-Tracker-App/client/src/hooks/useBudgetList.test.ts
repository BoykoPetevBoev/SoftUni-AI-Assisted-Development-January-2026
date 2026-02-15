import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { useBudgetList } from './useBudgetList';
import * as useBudgetsModule from './useBudgets';
import * as useDeleteBudgetModule from './useDeleteBudget';
import type { Budget, BudgetListResponse } from '../types/budget';

const mockBudgets: Budget[] = [
  {
    id: 1,
    user: 1,
    title: 'Monthly Budget',
    description: 'Test budget',
    date: '2026-02-15',
    initial_amount: '5000.00',
    created_at: '2026-02-15T10:00:00Z',
    updated_at: '2026-02-15T10:00:00Z',
  },
];

describe('useBudgetList', () => {
  const mockRefetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns budgets and query state', () => {
    vi.spyOn(useBudgetsModule, 'useBudgets').mockReturnValue({
      data: { count: 1, next: null, previous: null, results: mockBudgets },
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    } as unknown as UseQueryResult<BudgetListResponse, Error>);

    vi.spyOn(useDeleteBudgetModule, 'useDeleteBudget').mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as unknown as UseMutationResult<void, Error, number, unknown>);

    const { result } = renderHook(() => useBudgetList());

    expect(result.current.budgets).toEqual(mockBudgets);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.refetch).toBe(mockRefetch);
  });

  it('tracks delete confirmation and confirms delete', () => {
    const mockMutate = vi.fn((_id: number, options?: { onSuccess?: () => void }) => {
      options?.onSuccess?.();
    });

    vi.spyOn(useBudgetsModule, 'useBudgets').mockReturnValue({
      data: { count: 1, next: null, previous: null, results: mockBudgets },
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    } as unknown as UseQueryResult<BudgetListResponse, Error>);

    vi.spyOn(useDeleteBudgetModule, 'useDeleteBudget').mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as unknown as UseMutationResult<void, Error, number, unknown>);

    const { result } = renderHook(() => useBudgetList());

    act(() => {
      result.current.handleDeleteClick(1);
    });

    expect(result.current.deleteConfirmId).toBe(1);

    act(() => {
      result.current.handleConfirmDelete(1);
    });

    expect(mockMutate).toHaveBeenCalledWith(1, expect.any(Object));
    expect(result.current.deleteConfirmId).toBeNull();
  });

  it('clears delete confirmation on cancel', () => {
    vi.spyOn(useBudgetsModule, 'useBudgets').mockReturnValue({
      data: { count: 1, next: null, previous: null, results: mockBudgets },
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    } as unknown as UseQueryResult<BudgetListResponse, Error>);

    vi.spyOn(useDeleteBudgetModule, 'useDeleteBudget').mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as unknown as UseMutationResult<void, Error, number, unknown>);

    const { result } = renderHook(() => useBudgetList());

    act(() => {
      result.current.handleDeleteClick(1);
    });

    act(() => {
      result.current.handleCancelDelete();
    });

    expect(result.current.deleteConfirmId).toBeNull();
  });
});
