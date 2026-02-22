import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { TransactionDetail } from './TransactionDetail';
import type { Transaction } from '../../types/transaction';

vi.mock('../../hooks/useCategoryName', () => ({
  useCategoryName: (categoryId: number | null | undefined) => {
    const categoryMap: Record<number, string> = {
      1: 'Groceries',
      2: 'Transport',
      3: 'Entertainment',
    };
    return categoryId ? categoryMap[categoryId] || `Category ${categoryId}` : 'Uncategorized';
  },
}));

const mockTransaction: Transaction = {
  id: 3,
  budget: 1,
  amount: '250.00',
  category: 3,
  date: '2026-02-08',
  created_at: '2026-02-08T09:00:00Z',
  updated_at: '2026-02-08T09:00:00Z',
};

describe('TransactionDetail', () => {
  it('shows placeholder when no transaction is selected', () => {
    render(<TransactionDetail transaction={null} />);

    expect(screen.getByText('Transaction Details')).toBeInTheDocument();
    expect(
      screen.getByText('Select a transaction to see the full details.')
    ).toBeInTheDocument();
  });

  it('renders transaction details when provided', () => {
    render(<TransactionDetail transaction={mockTransaction} />);

    const detail = screen.getByRole('heading', { name: 'Transaction Details' }).parentElement;
    expect(detail).not.toBeNull();

    const detailScope = within(detail as HTMLElement);
    expect(detailScope.getAllByText('Entertainment')).toHaveLength(2);
    expect(detailScope.getByText('$250.00')).toBeInTheDocument();
    expect(detailScope.getByText('Feb 8, 2026')).toBeInTheDocument();
    expect(detailScope.getByText('#3')).toBeInTheDocument();
  });
});
