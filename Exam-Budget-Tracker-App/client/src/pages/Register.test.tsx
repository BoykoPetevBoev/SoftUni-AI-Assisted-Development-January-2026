import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ToastProvider } from '../context/ToastContext';
import { Register } from './Register';
import { useAuth } from '../hooks/useAuth';

vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

const navigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

describe('Register', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders register page content', () => {
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

    render(
      <MemoryRouter>
        <ToastProvider>
          <Register />
        </ToastProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByText('Join us to manage your budget')).toBeInTheDocument();
  });

  it('redirects when already authenticated', async () => {
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
      logout: vi.fn(),
      clearError: vi.fn(),
    };
    vi.mocked(useAuth).mockReturnValue(authValue);

    render(
      <MemoryRouter>
        <ToastProvider>
          <Register />
        </ToastProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('/');
    });
  });
});
