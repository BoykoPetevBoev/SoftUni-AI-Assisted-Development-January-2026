import { useQuery } from '@tanstack/react-query';
import { categoryService } from '../services/category.service';
import { categoryKeys } from './categoryKeys';
import { useAuth } from './useAuth';

/**
 * Hook to fetch all categories for the authenticated user
 * Automatically refetches when the query becomes stale
 */
export const useCategories = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: () => categoryService.getCategories(),
    enabled: isAuthenticated,
  });
};
