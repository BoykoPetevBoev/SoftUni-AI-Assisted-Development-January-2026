import { useMutation, useQueryClient } from '@tanstack/react-query';
import { budgetService } from '../services/budget.service';
import { budgetKeys } from './budgetKeys';
import { useToast } from './useToast';
import type { CreateBudgetPayload } from '../types/budget';

/**
 * Hook to create a new budget
 * Invalidates the budgets list query on success
 */
export const useCreateBudget = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (payload: CreateBudgetPayload) => budgetService.createBudget(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.list() });
      showToast('Budget created successfully', 'success');
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to create budget';
      showToast(errorMessage, 'error');
    },
  });
};
