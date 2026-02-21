import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BudgetListContainer } from '../BudgetListContainer';
import * as useBudgetListModule from '../../hooks/useBudgetList';
import type { Budget } from '../../types/budget';

const mockBudgets: Budget[] = [
  {
    id: 1,
    user: 1,
    title: 'Monthly Budget',
    description: 'Test budget',
    date: '2026-02-15',
    initial_amount: '5000.00',
    balance: '5000.00',
    created_at: '2026-02-15T10:00:00Z',
    updated_at: '2026-02-15T10:00:00Z',
  },
];

describe('BudgetListContainer', () => {
  const onEditClick = vi.fn();
  const onCreateClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders budgets from hook', () => {
    vi.spyOn(useBudgetListModule, 'useBudgetList').mockReturnValue({
      budgets: mockBudgets,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
      deleteConfirmId: null,
      isDeleting: false,
      handleDeleteClick: vi.fn(),
      handleConfirmDelete: vi.fn(),
      handleCancelDelete: vi.fn(),
    });

    render(
      <MemoryRouter>
        <BudgetListContainer onEditClick={onEditClick} onCreateClick={onCreateClick} />
      </MemoryRouter>
    );

    expect(screen.getByText('Your Budgets')).toBeInTheDocument();
    expect(screen.getByText('Monthly Budget')).toBeInTheDocument();
  });
});
