import { describe, it, expect, vi, beforeEach } from 'vitest';
import React, { type ReactNode } from 'react';
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDeleteCategory } from './useDeleteCategory';
import { categoryService } from '../services/category.service';
import { categoryKeys } from './categoryKeys';
import { useToast } from './useToast';

vi.mock('../services/category.service');
vi.mock('./useToast', () => ({
  useToast: vi.fn(),
}));

const createWrapper = (queryClient: QueryClient) => ({
  children,
}: {
  children: ReactNode;
}) => React.createElement(QueryClientProvider, { client: queryClient }, children);

describe('useDeleteCategory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deletes category and invalidates list', async () => {
    const showToast = vi.fn();
    const queryClient = new QueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    vi.mocked(useToast).mockReturnValue({
      showToast,
      showSuccess: vi.fn(),
      showError: vi.fn(),
      showInfo: vi.fn(),
      showWarning: vi.fn(),
      removeToast: vi.fn(),
    });

    vi.mocked(categoryService.deleteCategory).mockResolvedValue(undefined);

    const { result } = renderHook(() => useDeleteCategory(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      await result.current.mutateAsync(5);
    });

    expect(categoryService.deleteCategory).toHaveBeenCalledWith(5);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: categoryKeys.list() });
    expect(showToast).toHaveBeenCalledWith('Category deleted successfully', 'success');
  });

  it('shows error toast when delete fails', async () => {
    const showToast = vi.fn();
    const queryClient = new QueryClient();

    vi.mocked(useToast).mockReturnValue({
      showToast,
      showSuccess: vi.fn(),
      showError: vi.fn(),
      showInfo: vi.fn(),
      showWarning: vi.fn(),
      removeToast: vi.fn(),
    });

    vi.mocked(categoryService.deleteCategory).mockRejectedValue(
      new Error('Delete failed')
    );

    const { result } = renderHook(() => useDeleteCategory(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      await expect(result.current.mutateAsync(5)).rejects.toThrow('Delete failed');
    });

    expect(showToast).toHaveBeenCalledWith('Delete failed', 'error');
  });
});
