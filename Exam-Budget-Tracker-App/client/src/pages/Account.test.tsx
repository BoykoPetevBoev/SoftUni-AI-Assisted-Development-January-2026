import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Account } from './Account';
import { useAuth } from '../hooks/useAuth';

vi.mock('../components/Header', () => ({
  Header: () => <div>Header</div>,
}));

vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('Account', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      user: {
        id: 1,
        username: 'TestTest1',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
      },
      isLoading: false,
      error: null,
      isAuthenticated: true,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      clearError: vi.fn(),
    });
  });

  it('renders account information', () => {
    render(
      <MemoryRouter>
        <Account />
      </MemoryRouter>
    );

    expect(screen.getByText('Account Information')).toBeInTheDocument();
    expect(screen.getByText('TestTest1')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
  });
});
