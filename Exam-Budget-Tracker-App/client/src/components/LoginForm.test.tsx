import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import { ApiError } from '../api/requester';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('LoginForm', () => {
  const mockLogin = vi.fn();
  const mockShowSuccess = vi.fn();
  const mockShowError = vi.fn();

  const authContextValue = {
    user: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
    login: mockLogin,
    register: vi.fn(),
    logout: vi.fn(),
    clearError: vi.fn(),
  };

  const toastContextValue = {
    showToast: vi.fn(),
    showSuccess: mockShowSuccess,
    showError: mockShowError,
    showInfo: vi.fn(),
    showWarning: vi.fn(),
    removeToast: vi.fn(),
  };

  const renderLoginForm = () => {
    return render(
      <BrowserRouter>
        <ToastContext.Provider value={toastContextValue}>
          <AuthContext.Provider value={authContextValue}>
            <LoginForm />
          </AuthContext.Provider>
        </ToastContext.Provider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    mockLogin.mockClear();
    mockNavigate.mockClear();
    mockShowSuccess.mockClear();
    mockShowError.mockClear();
  });

  it('renders login form with username and password fields', () => {
    renderLoginForm();

    expect(screen.getByLabelText(/^username$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    const user = userEvent.setup();
    renderLoginForm();

    const submitButton = screen.getByRole('button', { name: /login/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/username must be at least 3 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    });

    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('shows validation error for short username', async () => {
    const user = userEvent.setup();
    renderLoginForm();

    const usernameInput = screen.getByLabelText(/^username$/i);
    await user.type(usernameInput, 'ab');
    await user.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/username must be at least 3 characters/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for short password', async () => {
    const user = userEvent.setup();
    renderLoginForm();

    const usernameInput = screen.getByLabelText(/^username$/i);
    const passwordInput = screen.getByLabelText(/^password$/i);

    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'short');
    await user.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    });
  });

  it('toggles password visibility', async () => {
    const user = userEvent.setup();
    renderLoginForm();

    const passwordInput = screen.getByLabelText(/^password$/i) as HTMLInputElement;
    expect(passwordInput.type).toBe('password');

    const toggleButton = screen.getByLabelText(/show password/i);
    await user.click(toggleButton);

    expect(passwordInput.type).toBe('text');

    await user.click(toggleButton);
    expect(passwordInput.type).toBe('password');
  });

  it('calls login with correct credentials and navigates on success', async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValueOnce(undefined);
    
    renderLoginForm();

    const usernameInput = screen.getByLabelText(/^username$/i);
    const passwordInput = screen.getByLabelText(/^password$/i);

    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'testpassword123');
    await user.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('testuser', 'testpassword123');
      expect(mockShowSuccess).toHaveBeenCalledWith('Login successful!');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('shows error toast on login failure', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Invalid credentials';
    mockLogin.mockRejectedValueOnce(
      new ApiError(401, { detail: errorMessage })
    );

    renderLoginForm();

    const usernameInput = screen.getByLabelText(/^username$/i);
    const passwordInput = screen.getByLabelText(/^password$/i);

    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith(errorMessage);
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it('disables form during submission', async () => {
    const user = userEvent.setup();
    mockLogin.mockImplementation(() => new Promise(() => {})); // Never resolves

    renderLoginForm();

    const usernameInput = screen.getByLabelText(/^username$/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'testpassword123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(usernameInput).toBeDisabled();
      expect(passwordInput).toBeDisabled();
    });
  });
});
