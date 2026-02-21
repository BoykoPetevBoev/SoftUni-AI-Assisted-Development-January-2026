import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Home } from './Home';
import { useAuth } from '../hooks/useAuth';
import { ToastProvider } from '../context/ToastContext';

vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const authValue: ReturnType<typeof useAuth> = {
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      clearError: vi.fn(),
    };

    vi.mocked(useAuth).mockReturnValue(authValue);
  });

  it('renders guest navigation links', () => {
    render(
      <ToastProvider>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </ToastProvider>
    );

    expect(screen.getByRole('link', { name: /start free/i })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /i already have an account/i })
    ).toBeInTheDocument();
  });
});
