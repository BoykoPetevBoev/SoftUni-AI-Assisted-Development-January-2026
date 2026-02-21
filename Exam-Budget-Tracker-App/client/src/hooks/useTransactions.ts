import { useQuery } from '@tanstack/react-query';
import { transactionService } from '../services/transaction.service';
import { transactionKeys } from './transactionKeys';
import { useAuth } from './useAuth';

/**
 * Hook to fetch all transactions for the authenticated user
 * Optionally filters by budget ID
 */
export const useTransactions = (budgetId?: number) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: transactionKeys.list({ budgetId }),
    queryFn: () => transactionService.getTransactions(budgetId),
    enabled: isAuthenticated,
  });
};
