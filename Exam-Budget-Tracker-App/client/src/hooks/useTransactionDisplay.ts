import { useMemo } from 'react';
import type { Transaction } from '../types/transaction';

interface TransactionDisplayResult {
  formattedDate: string;
  formattedAmount: string;
  amountClassName: string;
  amountLabel: string;
}

export const useTransactionDisplay = (
  transaction: Transaction | null | undefined
): TransactionDisplayResult => {
  return useMemo(() => {
    if (!transaction) {
      return {
        formattedDate: '',
        formattedAmount: '',
        amountClassName: 'income',
        amountLabel: 'Income',
      };
    }

    const date = new Date(transaction.date);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    const amountValue = Number(transaction.amount);
    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amountValue);

    const amountClassName = amountValue >= 0 ? 'income' : 'expense';
    const amountLabel = amountValue >= 0 ? 'Income' : 'Expense';

    return {
      formattedDate,
      formattedAmount,
      amountClassName,
      amountLabel,
    };
  }, [transaction]);
};
