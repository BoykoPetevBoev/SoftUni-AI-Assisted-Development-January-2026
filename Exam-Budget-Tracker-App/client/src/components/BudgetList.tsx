import React from 'react';
import { BudgetCard } from './BudgetCard';
import type { Budget } from '../types/budget';
import './BudgetList.scss';

interface BudgetListProps {
  onEditClick: (budgetId: number) => void;
  onCreateClick: () => void;
  budgets: Budget[];
  isLoading: boolean;
  error: unknown;
  onRetry: () => void | Promise<unknown>;
  deleteConfirmId: number | null;
  isDeleting: boolean;
  onDeleteClick: (budgetId: number) => void;
  onConfirmDelete: (budgetId: number) => void;
  onCancelDelete: () => void;
}

export const BudgetList: React.FC<BudgetListProps> = ({
  onEditClick,
  onCreateClick,
  budgets,
  isLoading,
  error,
  onRetry,
  deleteConfirmId,
  isDeleting,
  onDeleteClick,
  onConfirmDelete,
  onCancelDelete,
}) => {

  // Loading state
  if (isLoading) {
    return (
      <div className="budget-list">
        <div className="budget-list__loading">
          <div className="spinner" />
          <p>Loading budgets...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="budget-list">
        <div className="budget-list__error">
          <p className="budget-list__error-message">
            Failed to load budgets. Please try again.
          </p>
          <button
            className="budget-list__retry-btn"
            onClick={onRetry}
            disabled={isLoading}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const isEmpty = budgets.length === 0;

  return (
    <div className="budget-list">
      {isEmpty ? (
        <div className="budget-list__empty">
          <p className="budget-list__empty-message">No budgets yet</p>
          <p className="budget-list__empty-description">
            Create your first budget to get started
          </p>
          <button
            className="budget-list__create-btn budget-list__create-btn--large"
            onClick={onCreateClick}
          >
            Create Budget
          </button>
        </div>
      ) : (
        <>
          <div className="budget-list__header">
            <h2 className="budget-list__title">Your Budgets</h2>
            <button
              className="budget-list__create-btn"
              onClick={onCreateClick}
            >
              + New Budget
            </button>
          </div>

          <div className="budget-list__grid">
            {budgets.map((budget) => (
              <BudgetCard
                key={budget.id}
                budget={budget}
                onEdit={onEditClick}
                onDelete={onDeleteClick}
              />
            ))}
          </div>

          {/* Delete Confirmation Modal */}
          {deleteConfirmId !== null && (
            <div className="delete-confirm">
              <div className="delete-confirm__overlay" onClick={onCancelDelete} />
              <div className="delete-confirm__content">
                <h3 className="delete-confirm__title">Delete Budget?</h3>
                <p className="delete-confirm__message">
                  This action cannot be undone. Are you sure you want to delete this budget?
                </p>
                <div className="delete-confirm__actions">
                  <button
                    className="delete-confirm__btn delete-confirm__btn--cancel"
                    onClick={onCancelDelete}
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button
                    className="delete-confirm__btn delete-confirm__btn--confirm"
                    onClick={() => onConfirmDelete(deleteConfirmId)}
                    disabled={isDeleting}
                  >
                      {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
