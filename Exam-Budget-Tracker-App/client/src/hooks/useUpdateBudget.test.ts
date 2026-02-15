import { describe, it, expect, vi, beforeEach } from 'vitest';
import React, { type ReactNode } from 'react';
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUpdateBudget } from './useUpdateBudget';
import { budgetService } from '../services/budget.service';
import { budgetKeys } from './budgetKeys';
import { useToast } from './useToast';
import type { Budget, UpdateBudgetPayload } from '../types/budget';

vi.mock('../services/budget.service');
vi.mock('./useToast', () => ({
  useToast: vi.fn(),
}));

const mockBudget: Budget = {
  id: 1,
  user: 1,
  title: 'Updated Budget',
  description: 'Test budget',
  date: '2026-02-15',
  initial_amount: '6000.00',
  created_at: '2026-02-15T10:00:00Z',
  updated_at: '2026-02-15T10:00:00Z',
};

const createWrapper = (queryClient: QueryClient) => ({
  children,
}: {
  children: ReactNode;
}) => React.createElement(QueryClientProvider, { client: queryClient }, children);

describe('useUpdateBudget', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('updates budget and invalidates list and detail', async () => {
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
    vi.mocked(budgetService.updateBudget).mockResolvedValue(mockBudget);

    const { result } = renderHook(() => useUpdateBudget(1), {
      wrapper: createWrapper(queryClient),
    });

    const payload: UpdateBudgetPayload = {
      title: 'Updated Budget',
    };

    await act(async () => {
      await result.current.mutateAsync(payload);
    });

    expect(budgetService.updateBudget).toHaveBeenCalledWith(1, payload);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: budgetKeys.list() });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: budgetKeys.detail(1) });
    expect(showToast).toHaveBeenCalledWith('Budget updated successfully', 'success');
  });

  it('throws when budgetId is missing', async () => {
    const queryClient = new QueryClient();
    const { result } = renderHook(() => useUpdateBudget(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      await expect(result.current.mutateAsync({ title: 'Test' })).rejects.toThrow(
        'Budget ID is required'
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
    vi.mocked(budgetService.updateBudget).mockRejectedValue(new Error('Update failed'));

    const { result } = renderHook(() => useUpdateBudget(1), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      await expect(result.current.mutateAsync({ title: 'Test' })).rejects.toThrow(
        'Update failed'
      );
    });

    expect(showToast).toHaveBeenCalledWith('Update failed', 'error');
  });
});
