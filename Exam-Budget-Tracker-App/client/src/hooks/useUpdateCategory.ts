import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../services/category.service';
import { categoryKeys } from './categoryKeys';
import { useToast } from './useToast';
import type { UpdateCategoryPayload } from '../types/category';

/**
 * Hook to update a category
 * Invalidates both the categories list query and the specific category detail query on success
 */
export const useUpdateCategory = (categoryId?: number) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (payload: UpdateCategoryPayload) => {
      if (!categoryId) throw new Error('Category ID is required');
      return categoryService.updateCategory(categoryId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.list() });
      if (categoryId) {
        queryClient.invalidateQueries({ queryKey: categoryKeys.detail(categoryId) });
      }
      showToast('Category updated successfully', 'success');
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to update category';
      showToast(errorMessage, 'error');
    },
  });
};
