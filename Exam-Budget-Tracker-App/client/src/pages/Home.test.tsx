import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Home } from './Home';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../hooks/useToast', () => ({
  useToast: vi.fn(),
}));

const navigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

describe('Home', () => {
  const logout = vi.fn();
  const showSuccess = vi.fn();
  beforeEach(() => {
    vi.clearAllMocks();
    const authValue: ReturnType<typeof useAuth> = {
      user: {
        id: 1,
        username: 'user',
        email: 'user@example.com',
        first_name: 'User',
        last_name: 'Test',
      },
      isLoading: false,
      error: null,
      isAuthenticated: true,
      login: vi.fn(),
      register: vi.fn(),
      logout,
      clearError: vi.fn(),
    };

    vi.mocked(useAuth).mockReturnValue(authValue);
    vi.mocked(useToast).mockReturnValue({
      showToast: vi.fn(),
      showSuccess,
      showError: vi.fn(),
      showInfo: vi.fn(),
      showWarning: vi.fn(),
      removeToast: vi.fn(),
    });
  });

  it('renders navigation links', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /budgets/i })).toBeInTheDocument();
  });

  it('logs out and navigates to login', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /logout/i }));

    expect(logout).toHaveBeenCalled();
    expect(showSuccess).toHaveBeenCalledWith('Logged out successfully');
    expect(navigate).toHaveBeenCalledWith('/login');
  });
});
