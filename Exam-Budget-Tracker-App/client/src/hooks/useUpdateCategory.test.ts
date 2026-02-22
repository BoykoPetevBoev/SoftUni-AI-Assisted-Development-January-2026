import { describe, it, expect, vi, beforeEach } from 'vitest';
import React, { type ReactNode } from 'react';
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUpdateCategory } from './useUpdateCategory';
import { categoryService } from '../services/category.service';
import { categoryKeys } from './categoryKeys';
import { useToast } from './useToast';
import type { Category, UpdateCategoryPayload } from '../types/category';

vi.mock('../services/category.service');
vi.mock('./useToast', () => ({
  useToast: vi.fn(),
}));

const mockCategory: Category = {
  id: 1,
  user: 1,
  name: 'Updated Category',
  created_at: '2026-02-10T08:00:00Z',
  updated_at: '2026-02-10T08:00:00Z',
};

const createWrapper = (queryClient: QueryClient) => ({
  children,
}: {
  children: ReactNode;
}) => React.createElement(QueryClientProvider, { client: queryClient }, children);

describe('useUpdateCategory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('updates category and invalidates list and detail', async () => {
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

    vi.mocked(categoryService.updateCategory).mockResolvedValue(mockCategory);

    const { result } = renderHook(() => useUpdateCategory(1), {
      wrapper: createWrapper(queryClient),
    });

    const payload: UpdateCategoryPayload = { name: 'Updated Category' };

    await act(async () => {
      await result.current.mutateAsync(payload);
    });

    expect(categoryService.updateCategory).toHaveBeenCalledWith(1, payload);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: categoryKeys.list() });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: categoryKeys.detail(1) });
    expect(showToast).toHaveBeenCalledWith('Category updated successfully', 'success');
  });

  it('throws when categoryId is missing', async () => {
    const queryClient = new QueryClient();
    const { result } = renderHook(() => useUpdateCategory(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      await expect(result.current.mutateAsync({ name: 'Test' })).rejects.toThrow(
        'Category ID is required'
      );
    });
  });

  it('shows error toast when update fails', async () => {
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

    vi.mocked(categoryService.updateCategory).mockRejectedValue(
      new Error('Update failed')
    );

    const { result } = renderHook(() => useUpdateCategory(1), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      await expect(result.current.mutateAsync({ name: 'Test' })).rejects.toThrow(
        'Update failed'
      );
    });

    expect(showToast).toHaveBeenCalledWith('Update failed', 'error');
  });
});
