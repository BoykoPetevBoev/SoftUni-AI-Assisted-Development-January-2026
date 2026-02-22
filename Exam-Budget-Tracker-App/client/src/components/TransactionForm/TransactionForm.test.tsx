import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '../../context/ToastContext';
import { TransactionForm } from './TransactionForm';

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

describe('TransactionForm', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <TransactionForm isOpen={false} onClose={mockOnClose} budgetId={1} />,
      { wrapper: Wrapper }
    );

    expect(container.querySelector('.transaction-form-modal')).not.toBeInTheDocument();
  });

  it('renders when isOpen is true', () => {
    render(<TransactionForm isOpen={true} onClose={mockOnClose} budgetId={1} />, {
      wrapper: Wrapper,
    });

    expect(screen.getByRole('heading', { name: 'Add Transaction' })).toBeInTheDocument();
  });

  it('closes modal when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<TransactionForm isOpen={true} onClose={mockOnClose} budgetId={1} />, {
      wrapper: Wrapper,
    });

    const closeButton = screen.getByRole('button', { name: /close modal/i });
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('shows validation errors for empty required fields', async () => {
    const user = userEvent.setup();
    render(<TransactionForm isOpen={true} onClose={mockOnClose} budgetId={1} />, {
      wrapper: Wrapper,
    });

    const submitButton = screen.getByRole('button', { name: /add transaction/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Amount is required')).toBeInTheDocument();
      expect(screen.getByText('Date is required')).toBeInTheDocument();
    });
  });
});
