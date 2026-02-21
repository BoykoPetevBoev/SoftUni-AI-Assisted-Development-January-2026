import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../../context/AuthContext';
import { ToastProvider } from '../../context/ToastContext';
import { Header } from '.';

const mockUseAuth = vi.fn();

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
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
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      logout: vi.fn().mockResolvedValue(undefined),
    });
    renderHeader();
    const logo = screen.getByText('💶 Budget Tracker');
    expect(logo).toBeInTheDocument();
  });

  it('renders guest navigation links', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      logout: vi.fn().mockResolvedValue(undefined),
    });
    renderHeader();
    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toBeInTheDocument();
  });

  it('hides logout button for guests', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      logout: vi.fn().mockResolvedValue(undefined),
    });
    renderHeader();
    const logoutButton = screen.queryByRole('button', { name: /logout/i });
    expect(logoutButton).not.toBeInTheDocument();
  });

  it('has correct navigation link hrefs', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      logout: vi.fn().mockResolvedValue(undefined),
    });
    renderHeader();
    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('shows authenticated navigation links', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      logout: vi.fn().mockResolvedValue(undefined),
    });
    renderHeader();

    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /budgets/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /account/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });
});
