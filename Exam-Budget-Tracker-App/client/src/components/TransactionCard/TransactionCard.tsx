import React from 'react';
import { useTransactionDisplay } from '../../hooks/useTransactionDisplay';
import type { Transaction } from '../../types/transaction';
import './TransactionCard.scss';

interface TransactionCardProps {
  transaction: Transaction;
  isSelected: boolean;
  onSelect: (transactionId: number) => void;
  onEdit: (transactionId: number) => void;
  onDelete: (transactionId: number) => void;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}) => {
  const { formattedDate, formattedAmount, amountClassName, amountLabel } =
    useTransactionDisplay(transaction);

  return (
    <div
      className={`transaction-card ${
        isSelected ? 'transaction-card--selected' : ''
      }`}
    >
      <button
        type="button"
        className="transaction-card__select"
        onClick={() => onSelect(transaction.id)}
        aria-pressed={isSelected}
        aria-label={`View details for ${transaction.category} transaction`}
      >
        <div className="transaction-card__info">
          <h4 className="transaction-card__category">{transaction.category}</h4>
          <p className="transaction-card__date">{formattedDate}</p>
        </div>
        <div className={`transaction-card__amount transaction-card__amount--${amountClassName}`}>
          <span className="transaction-card__amount-label">{amountLabel}</span>
          <span className="transaction-card__amount-value">{formattedAmount}</span>
        </div>
      </button>
      <div className="transaction-card__actions">
        <button
          type="button"
          className="transaction-card__btn transaction-card__btn--edit"
          onClick={() => onEdit(transaction.id)}
          aria-label={`Edit ${transaction.category} transaction`}
        >
          Edit
        </button>
        <button
          type="button"
          className="transaction-card__btn transaction-card__btn--delete"
          onClick={() => onDelete(transaction.id)}
          aria-label={`Delete ${transaction.category} transaction`}
        >
          Delete
        </button>
      </div>
    </div>
  );
};
