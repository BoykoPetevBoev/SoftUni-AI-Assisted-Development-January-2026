import { describe, it, expect, vi, beforeEach } from 'vitest';
import React, { type ReactNode } from 'react';
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCreateBudget } from './useCreateBudget';
import { budgetService } from '../services/budget.service';
import { budgetKeys } from './budgetKeys';
import { useToast } from './useToast';
import type { Budget, CreateBudgetPayload } from '../types/budget';

vi.mock('../services/budget.service');
vi.mock('./useToast', () => ({
  useToast: vi.fn(),
}));

const mockBudget: Budget = {
  id: 1,
  user: 1,
  title: 'Monthly Budget',
  description: 'Test budget',
  date: '2026-02-15',
  initial_amount: '5000.00',
  created_at: '2026-02-15T10:00:00Z',
  updated_at: '2026-02-15T10:00:00Z',
};

const createWrapper = (queryClient: QueryClient) => ({
  children,
}: {
  children: ReactNode;
}) => React.createElement(QueryClientProvider, { client: queryClient }, children);

describe('useCreateBudget', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates budget and invalidates list', async () => {
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
    vi.mocked(budgetService.createBudget).mockResolvedValue(mockBudget);

    const { result } = renderHook(() => useCreateBudget(), {
      wrapper: createWrapper(queryClient),
    });

    const payload: CreateBudgetPayload = {
      title: 'Monthly Budget',
      description: 'Test budget',
      date: '2026-02-15',
      initial_amount: '5000.00',
    };

    await act(async () => {
      await result.current.mutateAsync(payload);
    });

    expect(budgetService.createBudget).toHaveBeenCalledWith(payload);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: budgetKeys.list() });
    expect(showToast).toHaveBeenCalledWith('Budget created successfully', 'success');
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
    vi.mocked(budgetService.createBudget).mockRejectedValue(new Error('Boom'));

    const { result } = renderHook(() => useCreateBudget(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      await expect(
        result.current.mutateAsync({
          title: 'Budget',
          description: 'Test',
          date: '2026-02-15',
          initial_amount: '100.00',
        })
      ).rejects.toThrow('Boom');
    });

    expect(showToast).toHaveBeenCalledWith('Boom', 'error');
  });
});
