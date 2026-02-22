import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../services/category.service';
import { categoryKeys } from './categoryKeys';
import { useToast } from './useToast';
import type { CreateCategoryPayload } from '../types/category';

/**
 * Hook to create a new category
 * Invalidates the categories list query on success
 */
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) =>
      categoryService.createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.list() });
      showToast('Category created successfully', 'success');
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to create category';
      showToast(errorMessage, 'error');
    },
  });
};
