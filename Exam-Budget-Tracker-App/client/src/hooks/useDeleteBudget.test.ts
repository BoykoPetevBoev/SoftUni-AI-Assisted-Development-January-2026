import { describe, it, expect, vi, beforeEach } from 'vitest';
import React, { type ReactNode } from 'react';
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDeleteBudget } from './useDeleteBudget';
import { budgetService } from '../services/budget.service';
import { budgetKeys } from './budgetKeys';
import { useToast } from './useToast';

vi.mock('../services/budget.service');
vi.mock('./useToast', () => ({
  useToast: vi.fn(),
}));

const createWrapper = (queryClient: QueryClient) => ({
  children,
}: {
  children: ReactNode;
}) => React.createElement(QueryClientProvider, { client: queryClient }, children);

describe('useDeleteBudget', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deletes budget and invalidates list', async () => {
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
    vi.mocked(budgetService.deleteBudget).mockResolvedValue(undefined);

    const { result } = renderHook(() => useDeleteBudget(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      await result.current.mutateAsync(1);
    });

    expect(budgetService.deleteBudget).toHaveBeenCalledWith(1);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: budgetKeys.list() });
    expect(showToast).toHaveBeenCalledWith('Budget deleted successfully', 'success');
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
    vi.mocked(budgetService.deleteBudget).mockRejectedValue(new Error('Delete failed'));

    const { result } = renderHook(() => useDeleteBudget(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      await expect(result.current.mutateAsync(1)).rejects.toThrow('Delete failed');
    });

    expect(showToast).toHaveBeenCalledWith('Delete failed', 'error');
  });
});
