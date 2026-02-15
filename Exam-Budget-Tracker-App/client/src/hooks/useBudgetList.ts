import { useState } from 'react';
import { useBudgets } from './useBudgets';
import { useDeleteBudget } from './useDeleteBudget';
import type { Budget } from '../types/budget';

interface UseBudgetListResult {
  budgets: Budget[];
  isLoading: boolean;
  error: unknown;
  refetch: () => Promise<unknown>;
  deleteConfirmId: number | null;
  isDeleting: boolean;
  handleDeleteClick: (budgetId: number) => void;
  handleConfirmDelete: (budgetId: number) => void;
  handleCancelDelete: () => void;
}

export const useBudgetList = (): UseBudgetListResult => {
  const { data, isLoading, error, refetch } = useBudgets();
  const deleteMutation = useDeleteBudget();
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const handleDeleteClick = (budgetId: number) => {
    setDeleteConfirmId(budgetId);
  };

  const handleConfirmDelete = (budgetId: number) => {
    deleteMutation.mutate(budgetId, {
      onSuccess: () => {
        setDeleteConfirmId(null);
      },
    });
  };

  const handleCancelDelete = () => {
    setDeleteConfirmId(null);
  };

  return {
    budgets: data?.results || [],
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
