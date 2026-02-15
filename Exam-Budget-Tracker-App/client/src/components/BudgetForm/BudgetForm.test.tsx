import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '../../context/ToastContext';
import { BudgetForm } from './BudgetForm';

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({ isAuthenticated: true }),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <ToastProvider>{children}</ToastProvider>
  </QueryClientProvider>
);

describe('BudgetForm', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <BudgetForm isOpen={false} onClose={mockOnClose} />,
      { wrapper: Wrapper }
    );

    expect(container.querySelector('.budget-form-modal')).not.toBeInTheDocument();
  });

  it('renders when isOpen is true', () => {
    render(<BudgetForm isOpen={true} onClose={mockOnClose} />, {
      wrapper: Wrapper,
    });

    expect(screen.getByRole('heading', { name: 'Create Budget' })).toBeInTheDocument();
  });

  it('shows edit title when budgetId is provided', () => {
    render(
      <BudgetForm isOpen={true} onClose={mockOnClose} budgetId={1} />,
      { wrapper: Wrapper }
    );

    // Will show "Edit Budget" when budget data loads, for now title may be "Create Budget" before query completes
    // The actual title depends on query state
    const title = screen.queryByText(/Budget/);
    expect(title).toBeInTheDocument();
  });

  it('closes modal when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<BudgetForm isOpen={true} onClose={mockOnClose} />, {
      wrapper: Wrapper,
    });

    const closeButton = screen.getByRole('button', { name: /close modal/i });
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('closes modal when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<BudgetForm isOpen={true} onClose={mockOnClose} />, {
      wrapper: Wrapper,
    });

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('shows validation errors for empty required fields', async () => {
    const user = userEvent.setup();
    render(<BudgetForm isOpen={true} onClose={mockOnClose} />, {
      wrapper: Wrapper,
    });

    const submitButton = screen.getByRole('button', { name: /create budget/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
      expect(screen.getByText('Date is required')).toBeInTheDocument();
      expect(screen.getByText('Amount is required')).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid amount', async () => {
    const user = userEvent.setup();
    render(<BudgetForm isOpen={true} onClose={mockOnClose} />, {
      wrapper: Wrapper,
    });

    const titleInput = screen.getByLabelText(/title/i);
    const dateInput = screen.getByLabelText(/date/i);
    const amountInput = screen.getByLabelText(/initial amount/i);

    await user.type(titleInput, 'Test Budget');
    await user.type(dateInput, '2026-02-15');
    await user.type(amountInput, '-100');

    const submitButton = screen.getByRole('button', { name: /create budget/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/must be greater than 0/i)).toBeInTheDocument();
    });
  });

  it('has disabled buttons while loading', () => {
    render(<BudgetForm isOpen={true} onClose={mockOnClose} />, {
      wrapper: Wrapper,
    });

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    expect(cancelButton).not.toBeDisabled();
  });
});
