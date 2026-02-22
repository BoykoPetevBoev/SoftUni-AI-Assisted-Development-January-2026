import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  transactionFormSchema,
  type TransactionFormData,
  type UpdateTransactionPayload,
  type CreateTransactionPayload,
} from '../types/transaction';
import { useTransaction } from './useTransaction';
import { useCreateTransaction } from './useCreateTransaction';
import { useUpdateTransaction } from './useUpdateTransaction';
import { useToast } from './useToast';

interface UseTransactionFormOptions {
  budgetId?: number;
  transactionId?: number;
  onClose: () => void;
}

interface UseTransactionFormResult {
  isEditMode: boolean;
  isLoading: boolean;
  register: ReturnType<typeof useForm<TransactionFormData>>['register'];
  handleSubmit: ReturnType<typeof useForm<TransactionFormData>>['handleSubmit'];
  errors: ReturnType<typeof useForm<TransactionFormData>>['formState']['errors'];
  onSubmit: (data: TransactionFormData) => void;
}

export const useTransactionForm = ({
  budgetId,
  transactionId,
  onClose,
}: UseTransactionFormOptions): UseTransactionFormResult => {
  const isEditMode = !!transactionId;
  const { data: transactionData, isLoading: isTransactionLoading } =
    useTransaction(transactionId);
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction(transactionId);
  const { showToast } = useToast();

  const isLoading =
    isTransactionLoading || createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionFormSchema),
    mode: 'onBlur',
  });

  useEffect(() => {
    if (isEditMode && transactionData) {
      reset({
        amount: transactionData.amount,
        category: transactionData.category,
        date: transactionData.date,
      });
    }
  }, [transactionData, isEditMode, reset]);

  useEffect(() => {
    if (createMutation.isSuccess || updateMutation.isSuccess) {
      reset();
      onClose();
    }
  }, [createMutation.isSuccess, updateMutation.isSuccess, onClose, reset]);

  const onSubmit = (data: TransactionFormData) => {
    if (!budgetId) {
      showToast('Budget is required for this transaction', 'error');
      return;
    }

    const categoryValue = typeof data.category === 'string' ? (data.category === '' ? null : Number(data.category)) : data.category ?? null;

    if (isEditMode) {
      updateMutation.mutate({
        ...data,
        budget: budgetId,
        category: categoryValue,
      } as UpdateTransactionPayload);
    } else {
      createMutation.mutate({
        ...data,
        budget: budgetId,
        category: categoryValue,
      } as CreateTransactionPayload);
    }
  };

  return {
    isEditMode,
    isLoading,
    register,
    handleSubmit,
    errors,
    onSubmit,
  };
};
