import { useMemo } from 'react';
import type { Budget } from '../types/budget';

interface UseBudgetCardResult {
  formattedDate: string;
  formattedAmount: string;
  description: string | null;
}

export const useBudgetCard = (budget: Budget): UseBudgetCardResult => {
  return useMemo(() => {
    const date = new Date(budget.date);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(budget.initial_amount));

    const description = budget.description
      ? budget.description.length > 100
        ? `${budget.description.substring(0, 100)}...`
        : budget.description
      : null;

    return {
      formattedDate,
      formattedAmount,
      description,
    };
  }, [budget]);
};
