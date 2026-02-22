import { describe, it, expect, vi, beforeEach } from 'vitest';
import { transactionService } from './transaction.service';
import * as requesterModule from '../api/requester';
import type {
  Transaction,
  CreateTransactionPayload,
  UpdateTransactionPayload,
} from '../types/transaction';

vi.mock('../api/requester', () => ({
  requester: vi.fn(),
}));

describe('transactionService', () => {
  const requester = vi.mocked(requesterModule.requester);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getTransactions calls the correct endpoint', async () => {
    const mockResponse = {
      count: 0,
      next: null,
      previous: null,
      results: [],
    };

    requester.mockResolvedValue(mockResponse);

    const result = await transactionService.getTransactions();

    expect(result).toEqual(mockResponse);
    expect(requester).toHaveBeenCalledWith('/api/transactions/', { method: 'GET' });
  });

  it('getTransactions includes budget filter when provided', async () => {
    const mockResponse = {
      count: 0,
      next: null,
      previous: null,
      results: [],
    };

    requester.mockResolvedValue(mockResponse);

    await transactionService.getTransactions(2);

    expect(requester).toHaveBeenCalledWith('/api/transactions/?budget=2', { method: 'GET' });
  });

  it('getTransactionById calls the correct endpoint with ID', async () => {
    const mockTransaction: Transaction = {
      id: 1,
      budget: 2,
      amount: '120.00',
      category: 1,
      date: '2026-02-12',
      created_at: '2026-02-12T10:00:00Z',
      updated_at: '2026-02-12T10:00:00Z',
    };

    requester.mockResolvedValue(mockTransaction);

    const result = await transactionService.getTransactionById(1);

    expect(result).toEqual(mockTransaction);
    expect(requester).toHaveBeenCalledWith('/api/transactions/1/', { method: 'GET' });
  });

  it('createTransaction sends correct payload', async () => {
    const payload: CreateTransactionPayload = {
      budget: 1,
      amount: '250.00',
      category: 3,
      date: '2026-02-10',
    };

    const mockTransaction: Transaction = {
      id: 1,
      budget: 1,
      amount: '250.00',
      category: 3,
      date: '2026-02-10',
      created_at: '2026-02-10T10:00:00Z',
      updated_at: '2026-02-10T10:00:00Z',
    };

    requester.mockResolvedValue(mockTransaction);

    const result = await transactionService.createTransaction(payload);

    expect(result).toEqual(mockTransaction);
    expect(requester).toHaveBeenCalledWith('/api/transactions/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  });

  it('updateTransaction sends correct payload', async () => {
    const payload: UpdateTransactionPayload = {
      amount: '-50.00',
      category: 6,
    };

    const mockTransaction: Transaction = {
      id: 1,
      budget: 1,
      amount: '-50.00',
      category: 6,
      date: '2026-02-10',
      created_at: '2026-02-10T10:00:00Z',
      updated_at: '2026-02-10T10:00:00Z',
    };

    requester.mockResolvedValue(mockTransaction);

    const result = await transactionService.updateTransaction(1, payload);

    expect(result).toEqual(mockTransaction);
    expect(requester).toHaveBeenCalledWith('/api/transactions/1/', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  });

  it('deleteTransaction calls the correct endpoint', async () => {
    requester.mockResolvedValue(undefined);

    await transactionService.deleteTransaction(1);

    expect(requester).toHaveBeenCalledWith('/api/transactions/1/', {
      method: 'DELETE',
    });
  });
});
