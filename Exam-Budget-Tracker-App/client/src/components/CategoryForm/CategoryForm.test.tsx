import { describe, it, expect, beforeEach, vi } from 'vitest';
import React, { type ReactNode } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '../../context/ToastContext';
import { CategoryForm } from './CategoryForm';

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({ isAuthenticated: true }),
}));

describe('CategoryForm', () => {
  const mockOnClose = vi.fn();
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
  });

  const Wrapper = ({ children }: { children: ReactNode }) =>
    React.createElement(
      QueryClientProvider,
      { client: queryClient },
      React.createElement(ToastProvider, { children })
    );

  it('should render category form', () => {
    render(<CategoryForm isOpen={true} onClose={mockOnClose} />, { wrapper: Wrapper });
    expect(screen.getByRole('heading', { name: 'Create Category' })).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    render(<CategoryForm isOpen={false} onClose={mockOnClose} />, { wrapper: Wrapper});
    expect(screen.queryByText('Create Category')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Close modal')).not.toBeInTheDocument();
  });

  it('should call onClose when close button clicked', async () => {
    const user = userEvent.setup();
    render(<CategoryForm isOpen={true} onClose={mockOnClose} />, { wrapper: Wrapper });
    await user.click(screen.getByLabelText('Close modal'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should validate required name field', async () => {
    const user = userEvent.setup();
    render(<CategoryForm isOpen={true} onClose={mockOnClose} />, { wrapper: Wrapper });
    await user.click(screen.getByRole('button', { name: /create category/i }));
    await waitFor(() => {
      expect(screen.getByText('Category name is required')).toBeInTheDocument();
    });
  });
});
