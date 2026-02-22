import { requester } from '../api/requester';
import type { Category, CreateCategoryPayload, UpdateCategoryPayload, CategoryListResponse } from '../types/category';

const CATEGORY_API_URL = '/api/categories';

export const categoryService = {
  /**
   * Fetch all categories for the authenticated user
   */
  getCategories: async (): Promise<CategoryListResponse> => {
    return requester<CategoryListResponse>(`${CATEGORY_API_URL}/`, {
      method: 'GET',
    });
  },

  /**
   * Fetch a single category by ID
   */
  getCategoryById: async (id: number): Promise<Category> => {
    return requester<Category>(`${CATEGORY_API_URL}/${id}/`, {
      method: 'GET',
    });
  },

  /**
   * Create a new category
   */
  createCategory: async (payload: CreateCategoryPayload): Promise<Category> => {
    return requester<Category>(`${CATEGORY_API_URL}/`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Update a category (full update)
   */
  updateCategory: async (id: number, payload: UpdateCategoryPayload): Promise<Category> => {
    return requester<Category>(`${CATEGORY_API_URL}/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Partially update a category
   */
  partialUpdateCategory: async (id: number, payload: UpdateCategoryPayload): Promise<Category> => {
    return requester<Category>(`${CATEGORY_API_URL}/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Delete a category
   */
  deleteCategory: async (id: number): Promise<void> => {
    return requester<void>(`${CATEGORY_API_URL}/${id}/`, {
      method: 'DELETE',
    });
  },
};
