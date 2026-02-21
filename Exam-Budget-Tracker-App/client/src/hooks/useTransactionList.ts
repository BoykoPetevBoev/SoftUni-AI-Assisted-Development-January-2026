import { useState } from 'react';
import { useTransactions } from './useTransactions';
import { useDeleteTransaction } from './useDeleteTransaction';
import type { Transaction } from '../types/transaction';

interface UseTransactionListResult {
  transactions: Transaction[];
  isLoading: boolean;
  error: unknown;
  refetch: () => Promise<unknown>;
  deleteConfirmId: number | null;
  isDeleting: boolean;
  handleDeleteClick: (transactionId: number) => void;
  handleConfirmDelete: (transactionId: number) => void;
  handleCancelDelete: () => void;
}

export const useTransactionList = (budgetId?: number): UseTransactionListResult => {
  const { data, isLoading, error, refetch } = useTransactions(budgetId);
  const deleteMutation = useDeleteTransaction(budgetId);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const handleDeleteClick = (transactionId: number) => {
    setDeleteConfirmId(transactionId);
  };

  const handleConfirmDelete = (transactionId: number) => {
    deleteMutation.mutate(transactionId, {
      onSuccess: () => {
        setDeleteConfirmId(null);
      },
    });
  };

  const handleCancelDelete = () => {
    setDeleteConfirmId(null);
  };

  return {
    transactions: data?.results || [],
    isLoading,
    error,
    refetch,
    deleteConfirmId,
    isDeleting: deleteMutation.isPending,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
  };
};
