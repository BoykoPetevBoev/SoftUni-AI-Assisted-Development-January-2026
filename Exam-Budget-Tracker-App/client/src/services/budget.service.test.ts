import { describe, it, expect, vi, beforeEach } from 'vitest';
import { budgetService } from './budget.service';
import * as requesterModule from '../api/requester';
import type { Budget, CreateBudgetPayload } from '../types/budget';

vi.mock('../api/requester', () => ({
  requester: vi.fn(),
}));

describe('budgetService', () => {
  const requester = vi.mocked(requesterModule.requester);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getBudgets calls the correct endpoint', async () => {
    const mockResponse = {
      count: 0,
      next: null,
      previous: null,
      results: [],
    };

    requester.mockResolvedValue(mockResponse);

    const result = await budgetService.getBudgets();

    expect(result).toEqual(mockResponse);
    expect(requester).toHaveBeenCalledWith('/api/budgets/', { method: 'GET' });
  });

  it('getBudgetById calls the correct endpoint with ID', async () => {
    const mockBudget: Budget = {
      id: 1,
      user: 1,
      title: 'Test Budget',
      description: 'Test',
      date: '2026-02-15',
      initial_amount: '5000.00',
      created_at: '2026-02-15T10:00:00Z',
      updated_at: '2026-02-15T10:00:00Z',
    };

    requester.mockResolvedValue(mockBudget);

    const result = await budgetService.getBudgetById(1);

    expect(result).toEqual(mockBudget);
    expect(requester).toHaveBeenCalledWith('/api/budgets/1/', { method: 'GET' });
  });

  it('createBudget sends correct payload', async () => {
    const payload: CreateBudgetPayload = {
      title: 'New Budget',
      description: 'Test description',
      date: '2026-02-15',
      initial_amount: '5000.00',
    };

    const mockBudget: Budget = {
      id: 1,
      user: 1,
      title: payload.title,
      description: payload.description ?? '',
      date: payload.date,
      initial_amount: '5000.00',
      created_at: '2026-02-15T10:00:00Z',
      updated_at: '2026-02-15T10:00:00Z',
    };

    requester.mockResolvedValue(mockBudget);

    const result = await budgetService.createBudget(payload);

    expect(result).toEqual(mockBudget);
    expect(requester).toHaveBeenCalledWith('/api/budgets/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  });

  it('updateBudget sends correct payload', async () => {
    const payload = { title: 'Updated Budget' };

    const mockBudget: Budget = {
      id: 1,
      user: 1,
      title: 'Updated Budget',
      description: 'Test',
      date: '2026-02-15',
      initial_amount: '5000.00',
      created_at: '2026-02-15T10:00:00Z',
      updated_at: '2026-02-15T10:00:00Z',
    };

    requester.mockResolvedValue(mockBudget);

    const result = await budgetService.updateBudget(1, payload);

    expect(result).toEqual(mockBudget);
    expect(requester).toHaveBeenCalledWith('/api/budgets/1/', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  });

  it('deleteBudget calls the correct endpoint', async () => {
    requester.mockResolvedValue(undefined);

    await budgetService.deleteBudget(1);

    expect(requester).toHaveBeenCalledWith('/api/budgets/1/', {
      method: 'DELETE',
    });
  });
});
