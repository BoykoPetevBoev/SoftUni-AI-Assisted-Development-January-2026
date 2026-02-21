import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../../context/AuthContext';
import { ToastProvider } from '../../context/ToastContext';
import { Header } from '.';

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    logout: vi.fn().mockResolvedValue(undefined),
  }),
}));

vi.mock('../hooks/useToast', () => ({
  useToast: () => ({
    showSuccess: vi.fn(),
  }),
}));

const renderHeader = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ToastProvider>
          <AuthProvider>
            <Header />
          </AuthProvider>
        </ToastProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Header Component', () => {
  it('renders the logo', () => {
    renderHeader();
    const logo = screen.getByText('💰 Budget Tracker');
    expect(logo).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    renderHeader();
    const homeLink = screen.getByRole('link', { name: /home/i });
    const budgetsLink = screen.getByRole('link', { name: /budgets/i });
    expect(homeLink).toBeInTheDocument();
    expect(budgetsLink).toBeInTheDocument();
  });

  it('renders logout button', () => {
    renderHeader();
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    expect(logoutButton).toBeInTheDocument();
  });

  it('has correct navigation link hrefs', () => {
    renderHeader();
    const homeLink = screen.getByRole('link', { name: /home/i });
    const budgetsLink = screen.getByRole('link', { name: /budgets/i });
    expect(homeLink).toHaveAttribute('href', '/');
    expect(budgetsLink).toHaveAttribute('href', '/budgets');
  });
});
