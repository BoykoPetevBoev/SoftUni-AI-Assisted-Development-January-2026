import React from 'react';
import { useTransactionForm } from '../../hooks/useTransactionForm';
import './TransactionForm.scss';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  budgetId?: number;
  transactionId?: number;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  isOpen,
  onClose,
  budgetId,
  transactionId,
}) => {
  const { isEditMode, isLoading, register, handleSubmit, errors, onSubmit } =
    useTransactionForm({ budgetId, transactionId, onClose });

  if (!isOpen) {
    return null;
  }

  return (
    <div className="transaction-form-modal">
      <div className="transaction-form-modal__overlay" onClick={onClose} />
      <div className="transaction-form-modal__content">
        <div className="transaction-form-modal__header">
          <h2 className="transaction-form-modal__title">
            {isEditMode ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button
            className="transaction-form-modal__close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="transaction-form-modal__form"
        >
          <div className="form-group">
            <label htmlFor="amount" className="form-group__label">
              Amount<span className="form-group__required">*</span>
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              placeholder="e.g., 2500 or -120.50"
              className={`form-group__input ${
                errors.amount ? 'form-group__input--error' : ''
              }`}
              {...register('amount')}
            />
            <p className="form-group__hint">
              Use negative values for expenses and positive values for income.
            </p>
            {errors.amount && (
              <p className="form-group__error">{errors.amount.message}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="date" className="form-group__label">
              Date<span className="form-group__required">*</span>
            </label>
            <input
              id="date"
              type="date"
              className={`form-group__input ${
                errors.date ? 'form-group__input--error' : ''
              }`}
              {...register('date')}
            />
            {errors.date && <p className="form-group__error">{errors.date.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="category" className="form-group__label">
              Category<span className="form-group__required">*</span>
            </label>
            <input
              id="category"
              type="text"
              placeholder="e.g., Salary, Groceries"
              className={`form-group__input ${
                errors.category ? 'form-group__input--error' : ''
              }`}
              {...register('category')}
            />
            {errors.category && (
              <p className="form-group__error">{errors.category.message}</p>
            )}
          </div>

          <div className="transaction-form-modal__actions">
            <button
              type="button"
              className="transaction-form-modal__btn transaction-form-modal__btn--cancel"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="transaction-form-modal__btn transaction-form-modal__btn--submit"
              disabled={isLoading}
            >
              {isLoading
                ? 'Saving...'
                : isEditMode
                ? 'Update Transaction'
                : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
