import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionService } from '../services/transaction.service';
import { transactionKeys } from './transactionKeys';
import { budgetKeys } from './budgetKeys';
import { useToast } from './useToast';
import type { UpdateTransactionPayload } from '../types/transaction';

/**
 * Hook to update a transaction
 * Invalidates transactions list, transaction detail, and budget queries on success
 */
export const useUpdateTransaction = (transactionId?: number) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (payload: UpdateTransactionPayload) => {
      if (!transactionId) throw new Error('Transaction ID is required');
      return transactionService.updateTransaction(transactionId, payload);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      if (transactionId) {
        queryClient.invalidateQueries({ queryKey: transactionKeys.detail(transactionId) });
      }
      queryClient.invalidateQueries({ queryKey: budgetKeys.list() });
      if (data?.budget) {
        queryClient.invalidateQueries({ queryKey: budgetKeys.detail(data.budget) });
      }
      showToast('Transaction updated successfully', 'success');
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to update transaction';
      showToast(errorMessage, 'error');
    },
  });
};
