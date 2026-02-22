import { useMemo } from 'react';
import { useCategories } from './useCategories';

/**
 * Hook to get category name by ID
 * Uses cached categories data and returns the name or a fallback
 */
export const useCategoryName = (categoryId: number | null | undefined): string => {
  const { data: categoriesData } = useCategories();

  return useMemo(() => {
    if (!categoryId) {
      return 'Uncategorized';
    }

    const categories = categoriesData?.results || [];
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.name || `Category ${categoryId}`;
  }, [categoryId, categoriesData]);
};
