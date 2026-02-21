import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TransactionCard } from './TransactionCard';
import type { Transaction } from '../../types/transaction';

const mockTransaction: Transaction = {
  id: 1,
  budget: 1,
  amount: '-125.50',
  category: 'Groceries',
  date: '2026-02-12',
  created_at: '2026-02-12T10:00:00Z',
  updated_at: '2026-02-12T10:00:00Z',
};

describe('TransactionCard', () => {
  const onSelect = vi.fn();
  const onEdit = vi.fn();
  const onDelete = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders transaction details', () => {
    render(
      <TransactionCard
        transaction={mockTransaction}
        isSelected={false}
        onSelect={onSelect}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    expect(screen.getByText('Groceries')).toBeInTheDocument();
    expect(screen.getByText('-$125.50')).toBeInTheDocument();
    expect(screen.getByText('Feb 12, 2026')).toBeInTheDocument();
  });

  it('calls onSelect when select button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TransactionCard
        transaction={mockTransaction}
        isSelected={false}
        onSelect={onSelect}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    const selectButton = screen.getByRole('button', {
      name: /view details for groceries transaction/i,
    });
    await user.click(selectButton);

    expect(onSelect).toHaveBeenCalledWith(mockTransaction.id);
  });

  it('calls onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TransactionCard
        transaction={mockTransaction}
        isSelected={false}
        onSelect={onSelect}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    await user.click(screen.getByRole('button', { name: /edit groceries transaction/i }));
    expect(onEdit).toHaveBeenCalledWith(mockTransaction.id);
  });

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TransactionCard
        transaction={mockTransaction}
        isSelected={false}
        onSelect={onSelect}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    await user.click(screen.getByRole('button', { name: /delete groceries transaction/i }));
    expect(onDelete).toHaveBeenCalledWith(mockTransaction.id);
  });

  it('highlights selected card', () => {
    const { container } = render(
      <TransactionCard
        transaction={mockTransaction}
        isSelected={true}
        onSelect={onSelect}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    const card = container.querySelector('.transaction-card');
    expect(card).toHaveClass('transaction-card--selected');
  });
});
