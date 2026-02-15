import { useQuery } from '@tanstack/react-query';
import { budgetService } from '../services/budget.service';
import { budgetKeys } from './budgetKeys';
import { useAuth } from './useAuth';

/**
 * Hook to fetch all budgets for the authenticated user
 * Automatically refetches when the query becomes stale
 */
export const useBudgets = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: budgetKeys.list(),
    queryFn: () => budgetService.getBudgets(),
    enabled: isAuthenticated,
  });
};
