import { useQuery } from '@tanstack/react-query';
import { categoryService } from '../services/category.service';
import { categoryKeys } from './categoryKeys';
import { useAuth } from './useAuth';

/**
 * Hook to fetch a single category by ID
 * Only fetches if the ID is provided (enabled condition)
 */
export const useCategory = (id?: number) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoryService.getCategoryById(id!),
    enabled: !!id && isAuthenticated,
  });
};
