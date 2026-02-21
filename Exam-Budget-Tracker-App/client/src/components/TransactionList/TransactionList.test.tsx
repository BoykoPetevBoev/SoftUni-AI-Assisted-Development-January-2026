import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TransactionList } from './TransactionList';
import type { Transaction } from '../../types/transaction';

const mockTransactions: Transaction[] = [
  {
    id: 1,
    budget: 1,
    amount: '1200.00',
    category: 'Salary',
    date: '2026-02-10',
    created_at: '2026-02-10T09:00:00Z',
    updated_at: '2026-02-10T09:00:00Z',
  },
  {
    id: 2,
    budget: 1,
    amount: '-75.25',
    category: 'Transport',
    date: '2026-02-11',
    created_at: '2026-02-11T09:00:00Z',
    updated_at: '2026-02-11T09:00:00Z',
  },
];

describe('TransactionList', () => {
  const onRetry = vi.fn();
  const onSelect = vi.fn();
  const onEditClick = vi.fn();
  const onDeleteClick = vi.fn();
  const onConfirmDelete = vi.fn();
  const onCancelDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderList = (props: Partial<React.ComponentProps<typeof TransactionList>> = {}) =>
    render(
      <TransactionList
        transactions={[]}
        isLoading={false}
        error={null}
        onRetry={onRetry}
        selectedTransactionId={null}
        onSelect={onSelect}
        onEditClick={onEditClick}
        deleteConfirmId={null}
        isDeleting={false}
        onDeleteClick={onDeleteClick}
        onConfirmDelete={onConfirmDelete}
        onCancelDelete={onCancelDelete}
        {...props}
      />
    );

  it('shows loading state initially', () => {
    renderList({ isLoading: true });
    expect(screen.getByText('Loading transactions...')).toBeInTheDocument();
  });

  it('shows error state with retry button', () => {
    renderList({ error: new Error('Failed to load') });
    expect(screen.getByText('Failed to load transactions. Please try again.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('shows empty state when no transactions', () => {
    renderList();
    expect(screen.getByText('No transactions yet')).toBeInTheDocument();
  });

  it('displays transactions when loaded', () => {
    renderList({ transactions: mockTransactions });
    expect(screen.getByText('Salary')).toBeInTheDocument();
    expect(screen.getByText('Transport')).toBeInTheDocument();
  });

  it('calls onSelect when transaction is clicked', async () => {
    const user = userEvent.setup();
    renderList({ transactions: [mockTransactions[0]] });

    await user.click(
      screen.getByRole('button', {
        name: /view details for salary transaction/i,
      })
    );

    expect(onSelect).toHaveBeenCalledWith(mockTransactions[0].id);
  });

  it('shows delete confirmation dialog', () => {
    renderList({
      transactions: [mockTransactions[0]],
      deleteConfirmId: mockTransactions[0].id,
    });

    expect(screen.getByText('Delete Transaction?')).toBeInTheDocument();
  });
});
