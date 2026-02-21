import React from 'react';
import { TransactionCard } from '../TransactionCard';
import type { Transaction } from '../../types/transaction';
import './TransactionList.scss';

interface TransactionListProps {
  transactions: Transaction[];
  isLoading: boolean;
  error: unknown;
  onRetry: () => void | Promise<unknown>;
  selectedTransactionId: number | null;
  onSelect: (transactionId: number) => void;
  onEditClick: (transactionId: number) => void;
  deleteConfirmId: number | null;
  isDeleting: boolean;
  onDeleteClick: (transactionId: number) => void;
  onConfirmDelete: (transactionId: number) => void;
  onCancelDelete: () => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  isLoading,
  error,
  onRetry,
  selectedTransactionId,
  onSelect,
  onEditClick,
  deleteConfirmId,
  isDeleting,
  onDeleteClick,
  onConfirmDelete,
  onCancelDelete,
}) => {
  if (isLoading) {
    return (
      <div className="transaction-list">
        <div className="transaction-list__loading">
          <div className="spinner" />
          <p>Loading transactions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="transaction-list">
        <div className="transaction-list__error">
          <p className="transaction-list__error-message">
            Failed to load transactions. Please try again.
          </p>
          <button
            className="transaction-list__retry-btn"
            onClick={onRetry}
            disabled={isLoading}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const isEmpty = transactions.length === 0;

  return (
    <div className="transaction-list">
      <div className="transaction-list__header">
        <h3 className="transaction-list__title">Transactions</h3>
        <span className="transaction-list__count">{transactions.length} total</span>
      </div>

      {isEmpty ? (
        <div className="transaction-list__empty">
          <p className="transaction-list__empty-message">No transactions yet</p>
          <p className="transaction-list__empty-description">
            Add income or expenses to see them here.
          </p>
        </div>
      ) : (
        <div className="transaction-list__grid">
          {transactions.map((transaction) => (
            <TransactionCard
              key={transaction.id}
              transaction={transaction}
              isSelected={selectedTransactionId === transaction.id}
              onSelect={onSelect}
              onEdit={onEditClick}
              onDelete={onDeleteClick}
            />
          ))}
        </div>
      )}

      {deleteConfirmId !== null && (
        <div className="delete-confirm">
          <div className="delete-confirm__overlay" onClick={onCancelDelete} />
          <div className="delete-confirm__content">
            <h3 className="delete-confirm__title">Delete Transaction?</h3>
            <p className="delete-confirm__message">
              This action cannot be undone. Are you sure you want to delete this
              transaction?
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
    </div>
  );
};
