import { useMutation, useQueryClient } from '@tanstack/react-query';
import { budgetService } from '../services/budget.service';
import { budgetKeys } from './budgetKeys';
import { useToast } from './useToast';

/**
 * Hook to delete a budget
 * Invalidates the budgets list query on success
 */
export const useDeleteBudget = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (budgetId: number) => budgetService.deleteBudget(budgetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.list() });
      showToast('Budget deleted successfully', 'success');
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to delete budget';
      showToast(errorMessage, 'error');
    },
  });
};
