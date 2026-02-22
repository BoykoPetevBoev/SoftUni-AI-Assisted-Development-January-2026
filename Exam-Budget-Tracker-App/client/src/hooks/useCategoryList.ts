import { useState } from 'react';
import { useCategories } from './useCategories';
import { useDeleteCategory } from './useDeleteCategory';
import type { Category } from '../types/category';

interface UseCategoryListResult {
  categories: Category[];
  isLoading: boolean;
  error: unknown;
  refetch: () => Promise<unknown>;
  deleteConfirmId: number | null;
  isDeleting: boolean;
  handleDeleteClick: (categoryId: number) => void;
  handleConfirmDelete: (categoryId: number) => void;
  handleCancelDelete: () => void;
}

export const useCategoryList = (): UseCategoryListResult => {
  const { data, isLoading, error, refetch } = useCategories();
  const deleteMutation = useDeleteCategory();
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const handleDeleteClick = (categoryId: number) => {
    setDeleteConfirmId(categoryId);
  };

  const handleConfirmDelete = (categoryId: number) => {
    deleteMutation.mutate(categoryId, {
      onSuccess: () => {
        setDeleteConfirmId(null);
      },
    });
  };

  const handleCancelDelete = () => {
    setDeleteConfirmId(null);
  };

  return {
    categories: data?.results || [],
    isLoading,
    error,
    refetch,
    deleteConfirmId,
    isDeleting: deleteMutation.isPending,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
  };
};
