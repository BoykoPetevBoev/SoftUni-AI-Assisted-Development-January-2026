import React from 'react';
import { useTransactionDisplay } from '../../hooks/useTransactionDisplay';
import { useCategoryName } from '../../hooks/useCategoryName';
import type { Transaction } from '../../types/transaction';
import './TransactionDetail.scss';

interface TransactionDetailProps {
  transaction: Transaction | null;
}

export const TransactionDetail: React.FC<TransactionDetailProps> = ({ transaction }) => {
  const { formattedDate, formattedAmount, amountClassName, amountLabel } =
    useTransactionDisplay(transaction);
  const categoryName = useCategoryName(transaction?.category);

  if (!transaction) {
    return (
      <div className="transaction-detail transaction-detail--empty">
        <h3 className="transaction-detail__title">Transaction Details</h3>
        <p className="transaction-detail__empty-text">
          Select a transaction to see the full details.
        </p>
      </div>
    );
  }

  return (
    <div className="transaction-detail">
      <h3 className="transaction-detail__title">Transaction Details</h3>
      <div className="transaction-detail__summary">
        <div className="transaction-detail__category">{categoryName}</div>
        <div className={`transaction-detail__amount transaction-detail__amount--${amountClassName}`}>
          <span className="transaction-detail__amount-label">{amountLabel}</span>
          <span className="transaction-detail__amount-value">{formattedAmount}</span>
        </div>
      </div>
      <dl className="transaction-detail__list">
        <div className="transaction-detail__row">
          <dt>Date</dt>
          <dd>{formattedDate}</dd>
        </div>
        <div className="transaction-detail__row">
          <dt>Category</dt>
          <dd>{categoryName}</dd>
        </div>
        <div className="transaction-detail__row">
          <dt>Transaction ID</dt>
          <dd>#{transaction.id}</dd>
        </div>
      </dl>
    </div>
  );
};
