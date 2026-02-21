import { requester } from '../api/requester';
import type {
  Transaction,
  CreateTransactionPayload,
  UpdateTransactionPayload,
  TransactionListResponse,
} from '../types/transaction';

const TRANSACTION_API_URL = '/api/transactions';

export const transactionService = {
  /**
   * Fetch all transactions for the authenticated user
   */
  getTransactions: async (budgetId?: number): Promise<TransactionListResponse> => {
    const query = budgetId ? `?budget=${budgetId}` : '';
    return requester<TransactionListResponse>(`${TRANSACTION_API_URL}/${query}`, {
      method: 'GET',
    });
  },

  /**
   * Fetch a single transaction by ID
   */
  getTransactionById: async (id: number): Promise<Transaction> => {
    return requester<Transaction>(`${TRANSACTION_API_URL}/${id}/`, {
      method: 'GET',
    });
  },

  /**
   * Create a new transaction
   */
  createTransaction: async (
    payload: CreateTransactionPayload
  ): Promise<Transaction> => {
    return requester<Transaction>(`${TRANSACTION_API_URL}/`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Update a transaction
   */
  updateTransaction: async (
    id: number,
    payload: UpdateTransactionPayload
  ): Promise<Transaction> => {
    return requester<Transaction>(`${TRANSACTION_API_URL}/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Delete a transaction
   */
  deleteTransaction: async (id: number): Promise<void> => {
    await requester<void>(`${TRANSACTION_API_URL}/${id}/`, {
      method: 'DELETE',
    });
  },
};
