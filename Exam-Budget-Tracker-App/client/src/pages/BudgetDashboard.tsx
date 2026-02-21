import React from 'react';
import { Header } from '../components/Header';
import { BudgetListContainer } from '../components/BudgetListContainer';
import { BudgetForm } from '../components/BudgetForm';
import { useBudgetDashboard } from '../hooks/useBudgetDashboard';
import { useAuth } from '../hooks/useAuth';
import './BudgetDashboard.scss';

export const BudgetDashboard: React.FC = () => {
  const { user } = useAuth();
  const {
    isFormOpen,
    selectedBudgetId,
    openCreateForm,
    openEditForm,
    closeForm,
  } = useBudgetDashboard();

  const balance = 5250.75;
  const income = 8500.0;
  const expenses = 3249.25;

  return (
    <div className="budget-dashboard">
      <Header />
      <div className="budget-dashboard__container">
        <div className="welcome-section">
          <h2 className="welcome-title">
            Welcome back, {user?.username || 'User'}
          </h2>
          <p className="welcome-text">
            Manage and track your finances with elegance and ease
          </p>
        </div>

        <div className="stats-grid">
          <div className="stat-card stat-card--primary">
            <div className="stat-label">Total Balance</div>
            <div className="stat-value">${balance.toFixed(2)}</div>
            <div className="stat-change positive">↑ +$500 this month</div>
          </div>

          <div className="stat-card stat-card--success">
            <div className="stat-label">Total Income</div>
            <div className="stat-value">${income.toFixed(2)}</div>
            <div className="stat-change positive">↑ +$1,200 vs last month</div>
          </div>

          <div className="stat-card stat-card--error">
            <div className="stat-label">Total Expenses</div>
            <div className="stat-value">${expenses.toFixed(2)}</div>
            <div className="stat-change negative">↓ -$400 vs last month</div>
          </div>
        </div>

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
