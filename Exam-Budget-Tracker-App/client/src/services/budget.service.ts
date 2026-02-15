import { requester } from '../api/requester';
import type { Budget, CreateBudgetPayload, UpdateBudgetPayload, BudgetListResponse } from '../types/budget';

const BUDGET_API_URL = '/api/budgets';

export const budgetService = {
  /**
   * Fetch all budgets for the authenticated user
   */
  getBudgets: async (): Promise<BudgetListResponse> => {
    return requester<BudgetListResponse>(`${BUDGET_API_URL}/`, {
      method: 'GET',
    });
  },

  /**
   * Fetch a single budget by ID
   */
  getBudgetById: async (id: number): Promise<Budget> => {
    return requester<Budget>(`${BUDGET_API_URL}/${id}/`, {
      method: 'GET',
    });
  },

  /**
   * Create a new budget
   */
  createBudget: async (payload: CreateBudgetPayload): Promise<Budget> => {
    return requester<Budget>(`${BUDGET_API_URL}/`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Update a budget (full update)
   */
  updateBudget: async (id: number, payload: UpdateBudgetPayload): Promise<Budget> => {
    return requester<Budget>(`${BUDGET_API_URL}/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Partially update a budget
   */
  partialUpdateBudget: async (id: number, payload: UpdateBudgetPayload): Promise<Budget> => {
    return requester<Budget>(`${BUDGET_API_URL}/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Delete a budget
   */
  deleteBudget: async (id: number): Promise<void> => {
    await requester<void>(`${BUDGET_API_URL}/${id}/`, {
      method: 'DELETE',
    });
  },
};
