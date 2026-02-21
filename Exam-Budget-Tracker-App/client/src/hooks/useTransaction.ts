import { useQuery } from '@tanstack/react-query';
import { transactionService } from '../services/transaction.service';
import { transactionKeys } from './transactionKeys';
import { useAuth } from './useAuth';

/**
 * Hook to fetch a single transaction by ID
 * Only fetches if the ID is provided (enabled condition)
 */
export const useTransaction = (id?: number) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: transactionKeys.detail(id),
    queryFn: () => transactionService.getTransactionById(id!),
    enabled: !!id && isAuthenticated,
  });
};
