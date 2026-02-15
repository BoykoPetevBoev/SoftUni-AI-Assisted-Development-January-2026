import { useMutation, useQueryClient } from '@tanstack/react-query';
import { budgetService } from '../services/budget.service';
import { budgetKeys } from './budgetKeys';
import { useToast } from './useToast';
import type { UpdateBudgetPayload } from '../types/budget';

/**
 * Hook to update a budget
 * Invalidates both the budgets list query and the specific budget detail query on success
 */
export const useUpdateBudget = (budgetId?: number) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (payload: UpdateBudgetPayload) => {
      if (!budgetId) throw new Error('Budget ID is required');
      return budgetService.updateBudget(budgetId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.list() });
      if (budgetId) {
        queryClient.invalidateQueries({ queryKey: budgetKeys.detail(budgetId) });
      }
      showToast('Budget updated successfully', 'success');
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to update budget';
      showToast(errorMessage, 'error');
    },
  });
};
