import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProtectedRoute } from './ProtectedRoute';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Navigate: ({ to }: { to: string }) => <div>Navigating to {to}</div>,
  };
});

describe('ProtectedRoute', () => {
  const renderProtectedRoute = (isAuthenticated: boolean, isLoading: boolean = false) => {
    const authContextValue = {
      user: isAuthenticated ? { id: 1, username: 'test', email: 'test@example.com', first_name: '', last_name: '' } : null,
      isLoading,
      error: null,
      isAuthenticated,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      clearError: vi.fn(),
    };

    return render(
      <BrowserRouter>
        <AuthContext.Provider value={authContextValue}>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </AuthContext.Provider>
      </BrowserRouter>
    );
  };

  it('renders children when user is authenticated', () => {
    renderProtectedRoute(true);
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to login when user is not authenticated', () => {
    renderProtectedRoute(false);
    expect(screen.getByText('Navigating to /login')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('shows loading state while checking authentication', () => {
    renderProtectedRoute(false, true);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});
