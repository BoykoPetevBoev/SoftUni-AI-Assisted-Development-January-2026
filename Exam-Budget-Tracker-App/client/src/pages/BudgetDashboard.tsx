import React from 'react';
import { Header } from '../components/Header';
import { BudgetListContainer } from '../components/BudgetListContainer';
import { BudgetForm } from '../components/BudgetForm';
import { CategoryManagementPanel } from '../components/CategoryManagementPanel';
import { useBudgetDashboard } from '../hooks/useBudgetDashboard';
import { useBudgets } from '../hooks/useBudgets';
import { useTransactions } from '../hooks/useTransactions';
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

  const { data: budgetsData } = useBudgets();
  const { data: transactionsData } = useTransactions();

  const budgets = budgetsData?.results || [];
  const transactions = transactionsData?.results || [];

  // Calculate total balance from all budgets
  const totalBalance = budgets.reduce(
    (sum, budget) => sum + parseFloat(budget.balance || '0'),
    0
  );

  // Calculate positive transactions (income)
  const totalIncome = transactions
    .filter((transaction) => parseFloat(transaction.amount) > 0)
    .reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);

  // Calculate negative transactions (expenses) - as absolute value
  const totalExpenses = Math.abs(
    transactions
      .filter((transaction) => parseFloat(transaction.amount) < 0)
      .reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0)
  );

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
            <div className="stat-value">${totalBalance.toFixed(2)}</div>
            <div className="stat-change positive">↑ +$500 this month</div>
          </div>

          <div className="stat-card stat-card--success">
            <div className="stat-label">Total Income</div>
            <div className="stat-value">${totalIncome.toFixed(2)}</div>
            <div className="stat-change positive">↑ +$1,200 vs last month</div>
          </div>

          <div className="stat-card stat-card--error">
            <div className="stat-label">Total Expenses</div>
            <div className="stat-value">${totalExpenses.toFixed(2)}</div>
            <div className="stat-change negative">↓ -$400 vs last month</div>
          </div>
        </div>

        <BudgetListContainer onCreateClick={openCreateForm} onEditClick={openEditForm} />

        <CategoryManagementPanel />
      </div>

      <BudgetForm
        isOpen={isFormOpen}
        onClose={closeForm}
        budgetId={selectedBudgetId ?? undefined}
      />
    </div>
  );
};
