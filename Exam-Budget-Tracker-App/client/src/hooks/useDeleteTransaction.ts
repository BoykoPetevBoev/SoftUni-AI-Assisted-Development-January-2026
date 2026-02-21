import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionService } from '../services/transaction.service';
import { transactionKeys } from './transactionKeys';
import { budgetKeys } from './budgetKeys';
import { useToast } from './useToast';

/**
 * Hook to delete a transaction
 * Invalidates transactions list and related budget queries on success
 */
export const useDeleteTransaction = (budgetId?: number) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (transactionId: number) =>
      transactionService.deleteTransaction(transactionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: budgetKeys.list() });
      if (budgetId) {
        queryClient.invalidateQueries({ queryKey: budgetKeys.detail(budgetId) });
      }
      showToast('Transaction deleted successfully', 'success');
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to delete transaction';
      showToast(errorMessage, 'error');
    },
  });
};
