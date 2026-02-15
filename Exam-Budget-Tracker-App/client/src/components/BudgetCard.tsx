import React from 'react';
import type { Budget } from '../types/budget';
import { useBudgetCard } from '../hooks/useBudgetCard';
import './BudgetCard.scss';

interface BudgetCardProps {
  budget: Budget;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({ budget, onEdit, onDelete }) => {
  const { formattedDate, formattedAmount, description } = useBudgetCard(budget);

  return (
    <div className="budget-card">
      <div className="budget-card__header">
        <h3 className="budget-card__title">{budget.title}</h3>
        <div className="budget-card__actions">
          <button
            className="budget-card__btn budget-card__btn--edit"
            onClick={() => onEdit(budget.id)}
            aria-label={`Edit budget ${budget.title}`}
          >
            Edit
          </button>
          <button
            className="budget-card__btn budget-card__btn--delete"
            onClick={() => onDelete(budget.id)}
            aria-label={`Delete budget ${budget.title}`}
          >
            Delete
          </button>
        </div>
      </div>

      {description && <p className="budget-card__description">{description}</p>}

      <div className="budget-card__footer">
        <div className="budget-card__meta">
          <span className="budget-card__date">{formattedDate}</span>
          <span className="budget-card__amount">{formattedAmount}</span>
        </div>
      </div>
    </div>
  );
};
