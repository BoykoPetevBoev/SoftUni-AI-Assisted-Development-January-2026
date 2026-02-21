import { useMemo, useState } from 'react';
import { useBudget } from './useBudget';
import { useTransactions } from './useTransactions';
import { useDeleteTransaction } from './useDeleteTransaction';
import type { Transaction } from '../types/transaction';

interface UseBudgetDetailsResult {
  budgetTitle: string;
  budgetDescription: string;
  formattedDate: string;
  formattedInitialAmount: string;
  formattedBalance: string;
  isBudgetLoading: boolean;
  budgetError: unknown;
  transactions: Transaction[];
  isTransactionsLoading: boolean;
  transactionsError: unknown;
  refetchTransactions: () => Promise<unknown>;
  selectedTransaction: Transaction | null;
  selectedTransactionId: number | null;
  isFormOpen: boolean;
  editingTransactionId: number | null;
  deleteConfirmId: number | null;
  isDeleting: boolean;
  openCreateForm: () => void;
  openEditForm: (transactionId: number) => void;
  closeForm: () => void;
  handleSelectTransaction: (transactionId: number) => void;
  handleDeleteClick: (transactionId: number) => void;
  handleConfirmDelete: (transactionId: number) => void;
  handleCancelDelete: () => void;
}

export const useBudgetDetails = (budgetId?: number): UseBudgetDetailsResult => {
  const { data: budget, isLoading: isBudgetLoading, error: budgetError } =
    useBudget(budgetId);
  const {
    data: transactionsData,
    isLoading: isTransactionsLoading,
    error: transactionsError,
    refetch: refetchTransactions,
  } = useTransactions(budgetId);
  const deleteMutation = useDeleteTransaction(budgetId);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransactionId, setEditingTransactionId] = useState<number | null>(null);
  const [selectedTransactionId, setSelectedTransactionId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const transactions = useMemo(
    () => transactionsData?.results ?? [],
    [transactionsData?.results]
  );

  const budgetDate = budget?.date ?? '';
  const formattedDate = useMemo(() => {
    if (!budgetDate) return '';
    return new Date(budgetDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }, [budgetDate]);

  const initialAmount = budget?.initial_amount ?? '';
  const formattedInitialAmount = useMemo(() => {
    if (!initialAmount) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Number(initialAmount));
  }, [initialAmount]);

  const balance = budget?.balance ?? '';
  const formattedBalance = useMemo(() => {
    if (!balance) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Number(balance));
  }, [balance]);

  const selectedTransaction = useMemo(() => {
    if (!selectedTransactionId) return null;
    return transactions.find((transaction) => transaction.id === selectedTransactionId) ?? null;
  }, [transactions, selectedTransactionId]);

  const openCreateForm = () => {
    setEditingTransactionId(null);
    setIsFormOpen(true);
  };

  const openEditForm = (transactionId: number) => {
    setEditingTransactionId(transactionId);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingTransactionId(null);
  };

  const handleSelectTransaction = (transactionId: number) => {
    setSelectedTransactionId(transactionId);
  };

  const handleDeleteClick = (transactionId: number) => {
    setDeleteConfirmId(transactionId);
  };

  const handleConfirmDelete = (transactionId: number) => {
    deleteMutation.mutate(transactionId, {
      onSuccess: () => {
        setDeleteConfirmId(null);
        if (selectedTransactionId === transactionId) {
          setSelectedTransactionId(null);
        }
      },
    });
  };

  const handleCancelDelete = () => {
    setDeleteConfirmId(null);
  };

  return {
    budgetTitle: budget?.title ?? '',
    budgetDescription: budget?.description ?? '',
    formattedDate,
    formattedInitialAmount,
    formattedBalance,
    isBudgetLoading,
    budgetError,
    transactions,
    isTransactionsLoading,
    transactionsError,
    refetchTransactions,
    selectedTransaction,
    selectedTransactionId,
    isFormOpen,
    editingTransactionId,
    deleteConfirmId,
    isDeleting: deleteMutation.isPending,
    openCreateForm,
    openEditForm,
    closeForm,
    handleSelectTransaction,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
  };
};
