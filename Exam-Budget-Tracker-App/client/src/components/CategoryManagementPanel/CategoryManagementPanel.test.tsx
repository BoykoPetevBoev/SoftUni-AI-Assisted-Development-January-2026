import { describe, it, expect, beforeEach, vi } from 'vitest';
import React, { type ReactNode } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '../../context/ToastContext';
import { CategoryManagementPanel } from './CategoryManagementPanel';
import { categoryService } from '../../services/category.service';

vi.mock('../../services/category.service');
vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({ isAuthenticated: true, user: null }),
}));

const createWrapper = (queryClient: QueryClient) => ({
  children,
}: {
  children: ReactNode;
}) =>
  React.createElement(
    QueryClientProvider,
    { client: queryClient },
    React.createElement(ToastProvider, { children })
  );

describe('CategoryManagementPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render category management panel', async () => {
    const queryClient = new QueryClient();
    vi.mocked(categoryService.getCategories).mockResolvedValue({
      count: 0,
      next: null,
      previous: null,
      results: [],
    });

    render(<CategoryManagementPanel />, { wrapper: createWrapper(queryClient) });

    await waitFor(() => {
      expect(screen.getByText('Categories')).toBeInTheDocument();
    });
  });

  it('should render create button and open form on click', async () => {
    const queryClient = new QueryClient();
    const user = userEvent.setup();
    vi.mocked(categoryService.getCategories).mockResolvedValue({
      count: 0,
      next: null,
      previous: null,
      results: [],
    });

    render(<CategoryManagementPanel />, { wrapper: createWrapper(queryClient) });

    const createBtn = await screen.findByText('+ New Category');
    await user.click(createBtn);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Create Category' })).toBeInTheDocument();
    });
  });
});
