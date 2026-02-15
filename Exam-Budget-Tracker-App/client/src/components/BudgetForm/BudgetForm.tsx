import React from 'react';
import { useBudgetForm } from '../../hooks/useBudgetForm';
import './BudgetForm.scss';

interface BudgetFormProps {
  isOpen: boolean;
  onClose: () => void;
  budgetId?: number;
}

export const BudgetForm: React.FC<BudgetFormProps> = ({ isOpen, onClose, budgetId }) => {
  const { isEditMode, isLoading, register, handleSubmit, errors, onSubmit } =
    useBudgetForm({ budgetId, onClose });

  if (!isOpen) {
    return null;
  }

  return (
    <div className="budget-form-modal">
      <div className="budget-form-modal__overlay" onClick={onClose} />
      <div className="budget-form-modal__content">
        <div className="budget-form-modal__header">
          <h2 className="budget-form-modal__title">
            {isEditMode ? 'Edit Budget' : 'Create Budget'}
          </h2>
          <button
            className="budget-form-modal__close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="budget-form-modal__form">
          {/* Title Field */}
          <div className="form-group">
            <label htmlFor="title" className="form-group__label">
              Title<span className="form-group__required">*</span>
            </label>
            <input
              id="title"
              type="text"
              placeholder="e.g., Monthly Budget"
              className={`form-group__input ${errors.title ? 'form-group__input--error' : ''}`}
              {...register('title')}
            />
            {errors.title && (
              <p className="form-group__error">{errors.title.message}</p>
            )}
          </div>

          {/* Description Field */}
          <div className="form-group">
            <label htmlFor="description" className="form-group__label">
              Description
            </label>
            <textarea
              id="description"
              placeholder="Add a description (optional)"
              className="form-group__textarea"
              rows={4}
              {...register('description')}
            />
            {errors.description && (
              <p className="form-group__error">{errors.description.message}</p>
            )}
          </div>

          {/* Date Field */}
          <div className="form-group">
            <label htmlFor="date" className="form-group__label">
              Date<span className="form-group__required">*</span>
            </label>
            <input
              id="date"
              type="date"
              className={`form-group__input ${errors.date ? 'form-group__input--error' : ''}`}
              {...register('date')}
            />
            {errors.date && <p className="form-group__error">{errors.date.message}</p>}
          </div>

          {/* Initial Amount Field */}
          <div className="form-group">
            <label htmlFor="initial_amount" className="form-group__label">
              Initial Amount<span className="form-group__required">*</span>
            </label>
            <input
              id="initial_amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="e.g., 5000.00"
              className={`form-group__input ${errors.initial_amount ? 'form-group__input--error' : ''}`}
              {...register('initial_amount')}
            />
            {errors.initial_amount && (
              <p className="form-group__error">{errors.initial_amount.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="budget-form-modal__actions">
            <button
              type="button"
              className="budget-form-modal__btn budget-form-modal__btn--cancel"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="budget-form-modal__btn budget-form-modal__btn--submit"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : isEditMode ? 'Update Budget' : 'Create Budget'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
