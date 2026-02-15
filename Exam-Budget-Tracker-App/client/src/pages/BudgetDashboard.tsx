import React from 'react';
import { BudgetListContainer } from '../components/BudgetListContainer';
import { BudgetForm } from '../components/BudgetForm';
import { useBudgetDashboard } from '../hooks/useBudgetDashboard';
import './BudgetDashboard.scss';

export const BudgetDashboard: React.FC = () => {
  const {
    isFormOpen,
    selectedBudgetId,
    openCreateForm,
    openEditForm,
    closeForm,
  } = useBudgetDashboard();

  return (
    <div className="budget-dashboard">
      <div className="budget-dashboard__container">
        <BudgetListContainer onCreateClick={openCreateForm} onEditClick={openEditForm} />
      </div>

      <BudgetForm
        isOpen={isFormOpen}
        onClose={closeForm}
        budgetId={selectedBudgetId ?? undefined}
      />
    </div>
  );
};
