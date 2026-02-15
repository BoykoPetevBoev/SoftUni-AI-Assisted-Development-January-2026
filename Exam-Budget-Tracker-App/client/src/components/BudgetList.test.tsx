import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BudgetList } from './BudgetList';
import type { Budget } from '../types/budget';

const mockBudgets: Budget[] = [
  {
    id: 1,
    user: 1,
    title: 'Monthly Budget',
    description: 'My monthly budget',
    date: '2026-02-15',
    initial_amount: '5000.00',
    created_at: '2026-02-15T10:00:00Z',
    updated_at: '2026-02-15T10:00:00Z',
  },
  {
    id: 2,
    user: 1,
    title: 'Yearly Budget',
    description: '',
    date: '2026-01-01',
    initial_amount: '50000.00',
    created_at: '2026-01-01T10:00:00Z',
    updated_at: '2026-01-01T10:00:00Z',
  },
];

describe('BudgetList', () => {
  const mockOnEditClick = vi.fn();
  const mockOnCreateClick = vi.fn();
  const mockOnRetry = vi.fn();
  const mockOnDeleteClick = vi.fn();
  const mockOnConfirmDelete = vi.fn();
  const mockOnCancelDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state initially', () => {
    render(
      <BudgetList
        budgets={[]}
        isLoading={true}
        error={null}
        onRetry={mockOnRetry}
        deleteConfirmId={null}
        isDeleting={false}
        onDeleteClick={mockOnDeleteClick}
        onConfirmDelete={mockOnConfirmDelete}
        onCancelDelete={mockOnCancelDelete}
        onEditClick={mockOnEditClick}
        onCreateClick={mockOnCreateClick}
      />
    );

    expect(screen.getByText('Loading budgets...')).toBeInTheDocument();
  });

  it('shows error state with retry button', () => {
    render(
      <BudgetList
        budgets={[]}
        isLoading={false}
        error={new Error('Failed to load')}
        onRetry={mockOnRetry}
        deleteConfirmId={null}
        isDeleting={false}
        onDeleteClick={mockOnDeleteClick}
        onConfirmDelete={mockOnConfirmDelete}
        onCancelDelete={mockOnCancelDelete}
        onEditClick={mockOnEditClick}
        onCreateClick={mockOnCreateClick}
      />
    );

    expect(screen.getByText('Failed to load budgets. Please try again.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('shows empty state when no budgets', () => {
    render(
      <BudgetList
        budgets={[]}
        isLoading={false}
        error={null}
        onRetry={mockOnRetry}
        deleteConfirmId={null}
        isDeleting={false}
        onDeleteClick={mockOnDeleteClick}
        onConfirmDelete={mockOnConfirmDelete}
        onCancelDelete={mockOnCancelDelete}
        onEditClick={mockOnEditClick}
        onCreateClick={mockOnCreateClick}
      />
    );

    expect(screen.getByText('No budgets yet')).toBeInTheDocument();
    expect(screen.getByText('Create your first budget to get started')).toBeInTheDocument();
  });

  it('displays budgets when loaded', () => {
    render(
      <BudgetList
        budgets={mockBudgets}
        isLoading={false}
        error={null}
        onRetry={mockOnRetry}
        deleteConfirmId={null}
        isDeleting={false}
        onDeleteClick={mockOnDeleteClick}
        onConfirmDelete={mockOnConfirmDelete}
        onCancelDelete={mockOnCancelDelete}
        onEditClick={mockOnEditClick}
        onCreateClick={mockOnCreateClick}
      />
    );

    expect(screen.getByText('Monthly Budget')).toBeInTheDocument();
    expect(screen.getByText('Yearly Budget')).toBeInTheDocument();
  });

  it('calls onCreateClick when create button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <BudgetList
        budgets={[]}
        isLoading={false}
        error={null}
        onRetry={mockOnRetry}
        deleteConfirmId={null}
        isDeleting={false}
        onDeleteClick={mockOnDeleteClick}
        onConfirmDelete={mockOnConfirmDelete}
        onCancelDelete={mockOnCancelDelete}
        onEditClick={mockOnEditClick}
        onCreateClick={mockOnCreateClick}
      />
    );

    const createButton = screen.getByRole('button', { name: /create budget/i });
    await user.click(createButton);

    expect(mockOnCreateClick).toHaveBeenCalled();
  });

  it('calls onEditClick when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <BudgetList
        budgets={[mockBudgets[0]]}
        isLoading={false}
        error={null}
        onRetry={mockOnRetry}
        deleteConfirmId={null}
        isDeleting={false}
        onDeleteClick={mockOnDeleteClick}
        onConfirmDelete={mockOnConfirmDelete}
        onCancelDelete={mockOnCancelDelete}
        onEditClick={mockOnEditClick}
        onCreateClick={mockOnCreateClick}
      />
    );

    const editButton = screen.getByRole('button', { name: /edit budget monthly budget/i });
    await user.click(editButton);

    expect(mockOnEditClick).toHaveBeenCalledWith(mockBudgets[0].id);
  });

  it('shows delete confirmation dialog', async () => {
    render(
      <BudgetList
        budgets={[mockBudgets[0]]}
        isLoading={false}
        error={null}
        onRetry={mockOnRetry}
        deleteConfirmId={mockBudgets[0].id}
        isDeleting={false}
        onDeleteClick={mockOnDeleteClick}
        onConfirmDelete={mockOnConfirmDelete}
        onCancelDelete={mockOnCancelDelete}
        onEditClick={mockOnEditClick}
        onCreateClick={mockOnCreateClick}
      />
    );

    expect(screen.getByText('Delete Budget?')).toBeInTheDocument();
    expect(screen.getByText(/cannot be undone/i)).toBeInTheDocument();
  });
});
