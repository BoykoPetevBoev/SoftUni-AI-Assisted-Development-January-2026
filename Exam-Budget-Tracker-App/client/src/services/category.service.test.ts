import { describe, it, expect, vi, beforeEach } from 'vitest';
import { categoryService } from './category.service';
import * as requesterModule from '../api/requester';
import type {
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from '../types/category';

vi.mock('../api/requester', () => ({
  requester: vi.fn(),
}));

describe('categoryService', () => {
  const requester = vi.mocked(requesterModule.requester);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getCategories calls the correct endpoint', async () => {
    const mockResponse = {
      count: 0,
      next: null,
      previous: null,
      results: [],
    };

    requester.mockResolvedValue(mockResponse);

    const result = await categoryService.getCategories();

    expect(result).toEqual(mockResponse);
    expect(requester).toHaveBeenCalledWith('/api/categories/', { method: 'GET' });
  });

  it('getCategoryById calls the correct endpoint with ID', async () => {
    const mockCategory: Category = {
      id: 1,
      user: 1,
      name: 'Groceries',
      created_at: '2026-02-15T10:00:00Z',
      updated_at: '2026-02-15T10:00:00Z',
    };

    requester.mockResolvedValue(mockCategory);

    const result = await categoryService.getCategoryById(1);

    expect(result).toEqual(mockCategory);
    expect(requester).toHaveBeenCalledWith('/api/categories/1/', { method: 'GET' });
  });

  it('createCategory sends correct payload', async () => {
    const payload: CreateCategoryPayload = {
      name: 'Utilities',
    };

    const mockCategory: Category = {
      id: 2,
      user: 1,
      name: 'Utilities',
      created_at: '2026-02-15T10:00:00Z',
      updated_at: '2026-02-15T10:00:00Z',
    };

    requester.mockResolvedValue(mockCategory);

    const result = await categoryService.createCategory(payload);

    expect(result).toEqual(mockCategory);
    expect(requester).toHaveBeenCalledWith('/api/categories/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  });

  it('updateCategory sends correct payload', async () => {
    const payload: UpdateCategoryPayload = {
      name: 'Updated Category',
    };

    const mockCategory: Category = {
      id: 1,
      user: 1,
      name: 'Updated Category',
      created_at: '2026-02-15T10:00:00Z',
      updated_at: '2026-02-15T10:00:00Z',
    };

    requester.mockResolvedValue(mockCategory);

    const result = await categoryService.updateCategory(1, payload);

    expect(result).toEqual(mockCategory);
    expect(requester).toHaveBeenCalledWith('/api/categories/1/', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  });

  it('partialUpdateCategory sends correct payload', async () => {
    const payload: UpdateCategoryPayload = {
      name: 'Partial Update',
    };

    const mockCategory: Category = {
      id: 1,
      user: 1,
      name: 'Partial Update',
      created_at: '2026-02-15T10:00:00Z',
      updated_at: '2026-02-15T10:00:00Z',
    };

    requester.mockResolvedValue(mockCategory);

    const result = await categoryService.partialUpdateCategory(1, payload);

    expect(result).toEqual(mockCategory);
    expect(requester).toHaveBeenCalledWith('/api/categories/1/', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  });

  it('deleteCategory calls the correct endpoint', async () => {
    requester.mockResolvedValue(undefined);

    await categoryService.deleteCategory(1);

    expect(requester).toHaveBeenCalledWith('/api/categories/1/', {
      method: 'DELETE',
    });
  });
});
