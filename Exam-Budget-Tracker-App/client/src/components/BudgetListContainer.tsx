import React from 'react';
import { BudgetList } from './BudgetList';
import { useBudgetList } from '../hooks/useBudgetList';

interface BudgetListContainerProps {
  onEditClick: (budgetId: number) => void;
  onCreateClick: () => void;
}

export const BudgetListContainer: React.FC<BudgetListContainerProps> = ({
  onEditClick,
  onCreateClick,
}) => {
  const {
    budgets,
    isLoading,
    error,
    refetch,
    deleteConfirmId,
    isDeleting,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
  } = useBudgetList();

  return (
    <BudgetList
      budgets={budgets}
      isLoading={isLoading}
      error={error}
      onRetry={refetch}
      deleteConfirmId={deleteConfirmId}
      isDeleting={isDeleting}
      onDeleteClick={handleDeleteClick}
      onConfirmDelete={handleConfirmDelete}
      onCancelDelete={handleCancelDelete}
      onEditClick={onEditClick}
      onCreateClick={onCreateClick}
    />
  );
};
