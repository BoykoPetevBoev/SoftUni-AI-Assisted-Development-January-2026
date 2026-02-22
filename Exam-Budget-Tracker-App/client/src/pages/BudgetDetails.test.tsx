import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { BudgetDetails } from './BudgetDetails';
import type { Transaction } from '../types/transaction';
import { useBudgetDetails } from '../hooks/useBudgetDetails';

vi.mock('../components/Header', () => ({
  Header: () => <div>Header</div>,
}));

vi.mock('../components/TransactionForm', () => ({
  TransactionForm: () => null,
}));

vi.mock('../hooks/useBudgetDetails', () => ({
  useBudgetDetails: vi.fn(),
}));

vi.mock('../hooks/useCategoryName', () => ({
  useCategoryName: (categoryId: number | null | undefined) => {
    const categoryMap: Record<number, string> = {
      1: 'Groceries',
      2: 'Transport',
      3: 'Entertainment',
      5: 'Coffee',
    };
    return categoryId ? categoryMap[categoryId] || `Category ${categoryId}` : 'Uncategorized';
  },
}));

const mockTransaction: Transaction = {
  id: 5,
  budget: 1,
  amount: '-42.00',
  category: 5,
  date: '2026-02-12',
  created_at: '2026-02-12T10:00:00Z',
  updated_at: '2026-02-12T10:00:00Z',
};

describe('BudgetDetails', () => {
  it('renders budget summary and transactions', () => {
    vi.mocked(useBudgetDetails).mockReturnValue({
      budgetTitle: 'Monthly Budget',
      budgetDescription: 'Main budget',
      formattedDate: 'Feb 1, 2026',
      formattedInitialAmount: '$5,000.00',
      formattedBalance: '$4,750.00',
      isBudgetLoading: false,
      budgetError: null,
      transactions: [mockTransaction],
      isTransactionsLoading: false,
      transactionsError: null,
      refetchTransactions: vi.fn(),
      selectedTransaction: mockTransaction,
      selectedTransactionId: mockTransaction.id,
      isFormOpen: false,
      editingTransactionId: null,
      deleteConfirmId: null,
      isDeleting: false,
      openCreateForm: vi.fn(),
      openEditForm: vi.fn(),
      closeForm: vi.fn(),
      handleSelectTransaction: vi.fn(),
      handleDeleteClick: vi.fn(),
      handleConfirmDelete: vi.fn(),
      handleCancelDelete: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/budgets/1']}>
        <Routes>
          <Route path="/budgets/:budgetId" element={<BudgetDetails />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Monthly Budget')).toBeInTheDocument();
    expect(screen.getByText('Main budget')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /view details for Coffee transaction/i })
    ).toBeInTheDocument();

    const detail = screen.getByRole('heading', { name: 'Transaction Details' }).parentElement;
    expect(detail).not.toBeNull();
    expect(within(detail as HTMLElement).getAllByText('Coffee')).toHaveLength(2);
    expect(within(detail as HTMLElement).getByText('-$42.00')).toBeInTheDocument();
  });
});
