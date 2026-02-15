import { useState } from 'react';

interface UseBudgetDashboardResult {
  isFormOpen: boolean;
  selectedBudgetId: number | null;
  openCreateForm: () => void;
  openEditForm: (budgetId: number) => void;
  closeForm: () => void;
}

export const useBudgetDashboard = (): UseBudgetDashboardResult => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBudgetId, setSelectedBudgetId] = useState<number | null>(null);

  const openCreateForm = () => {
    setSelectedBudgetId(null);
    setIsFormOpen(true);
  };

  const openEditForm = (budgetId: number) => {
    setSelectedBudgetId(budgetId);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedBudgetId(null);
  };

  return {
    isFormOpen,
    selectedBudgetId,
    openCreateForm,
    openEditForm,
    closeForm,
  };
};
