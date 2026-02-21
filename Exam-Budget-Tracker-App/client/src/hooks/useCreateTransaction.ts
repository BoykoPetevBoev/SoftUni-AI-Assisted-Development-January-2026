import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionService } from '../services/transaction.service';
import { transactionKeys } from './transactionKeys';
import { budgetKeys } from './budgetKeys';
import { useToast } from './useToast';
import type { CreateTransactionPayload } from '../types/transaction';

/**
 * Hook to create a new transaction
 * Invalidates transactions list and related budget queries on success
 */
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (payload: CreateTransactionPayload) =>
      transactionService.createTransaction(payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: budgetKeys.list() });
      const budgetId = data?.budget ?? variables.budget;
      if (budgetId) {
        queryClient.invalidateQueries({ queryKey: budgetKeys.detail(budgetId) });
      }
      showToast('Transaction created successfully', 'success');
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to create transaction';
      showToast(errorMessage, 'error');
    },
  });
};
