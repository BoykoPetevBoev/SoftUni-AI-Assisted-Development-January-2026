import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '../context/ToastContext';
import { BudgetDashboard } from './BudgetDashboard';

vi.mock('../components/BudgetListContainer', () => ({
  BudgetListContainer: ({ onCreateClick }: { onCreateClick: () => void }) => (
    <button onClick={onCreateClick}>Open Form</button>
  ),
}));

vi.mock('../hooks/useAuth', () => ({
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

describe('BudgetDashboard', () => {
  it('opens form modal when create button is clicked', async () => {
    const user = userEvent.setup();
    render(<BudgetDashboard />, { wrapper: Wrapper });

    const createButton = screen.getByRole('button', { name: /open form/i });
    await user.click(createButton);

    expect(screen.getByRole('heading', { name: 'Create Budget' })).toBeInTheDocument();
  });

  it('closes form modal when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<BudgetDashboard />, { wrapper: Wrapper });

    const createButton = screen.getByRole('button', { name: /open form/i });
    await user.click(createButton);

    const closeButton = screen.getByRole('button', { name: /close modal/i });
    await user.click(closeButton);

    expect(screen.queryByText('Create Budget')).not.toBeInTheDocument();
  });
});
