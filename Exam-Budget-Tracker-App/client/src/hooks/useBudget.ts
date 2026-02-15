import { useQuery } from '@tanstack/react-query';
import { budgetService } from '../services/budget.service';
import { budgetKeys } from './budgetKeys';
import { useAuth } from './useAuth';

/**
 * Hook to fetch a single budget by ID
 * Only fetches if the ID is provided (enabled condition)
 */
export const useBudget = (id?: number) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: budgetKeys.detail(id),
    queryFn: () => budgetService.getBudgetById(id!),
    enabled: !!id && isAuthenticated,
  });
};
