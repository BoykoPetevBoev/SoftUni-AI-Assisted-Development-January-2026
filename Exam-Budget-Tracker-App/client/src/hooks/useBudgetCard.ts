import { useMemo } from 'react';
import type { Budget } from '../types/budget';

interface UseBudgetCardResult {
  formattedDate: string;
  formattedAmount: string;
  description: string | null;
  amountTone: 'positive' | 'negative' | 'neutral';
}

export const useBudgetCard = (budget: Budget): UseBudgetCardResult => {
  return useMemo(() => {
    const date = new Date(budget.date);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    const balanceAmount = parseFloat(budget.balance);
    const initialAmount = parseFloat(budget.initial_amount);
    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(balanceAmount);

    let amountTone: UseBudgetCardResult['amountTone'] = 'neutral';
    if (!Number.isNaN(balanceAmount) && !Number.isNaN(initialAmount)) {
      if (balanceAmount > initialAmount) {
        amountTone = 'positive';
      } else if (balanceAmount < initialAmount) {
        amountTone = 'negative';
      }
    }

    const description = budget.description
      ? budget.description.length > 100
        ? `${budget.description.substring(0, 100)}...`
        : budget.description
      : null;

    return {
      formattedDate,
      formattedAmount,
      description,
      amountTone,
    };
  }, [budget]);
};
