import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BudgetCard } from './BudgetCard';
import type { Budget } from '../types/budget';

const mockBudget: Budget = {
  id: 1,
  user: 1,
  title: 'Monthly Budget',
  description: 'My monthly budget',
  date: '2026-02-15',
  initial_amount: '5000.00',
  created_at: '2026-02-15T10:00:00Z',
  updated_at: '2026-02-15T10:00:00Z',
};

describe('BudgetCard', () => {
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders budget information', () => {
    render(
      <BudgetCard
        budget={mockBudget}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Monthly Budget')).toBeInTheDocument();
    expect(screen.getByText('My monthly budget')).toBeInTheDocument();
  });

  it('formats and displays amount correctly', () => {
    render(
      <BudgetCard
        budget={mockBudget}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('$5,000.00')).toBeInTheDocument();
  });

  it('formats and displays date correctly', () => {
    render(
      <BudgetCard
        budget={mockBudget}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Feb 15, 2026')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <BudgetCard
        budget={mockBudget}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButton = screen.getByRole('button', { name: /edit budget/i });
    await user.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockBudget.id);
  });

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <BudgetCard
        budget={mockBudget}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /delete budget/i });
    await user.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(mockBudget.id);
  });

  it('truncates long descriptions', () => {
    const longBudget: Budget = {
      ...mockBudget,
      description: 'A'.repeat(150), // 150 characters
    };

    render(
      <BudgetCard
        budget={longBudget}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const text = screen.getByText(/^A{100}\.\.\.$/);
    expect(text).toBeInTheDocument();
  });

  it('handles empty description gracefully', () => {
    const noBudget: Budget = { ...mockBudget, description: '' };

    const { container } = render(
      <BudgetCard
        budget={noBudget}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const description = container.querySelector('.budget-card__description');
    expect(description).not.toBeInTheDocument();
  });
});
