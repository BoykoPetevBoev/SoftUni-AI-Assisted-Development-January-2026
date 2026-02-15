import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { budgetFormSchema, type BudgetFormData } from '../types/budget';
import { useBudget } from './useBudget';
import { useCreateBudget } from './useCreateBudget';
import { useUpdateBudget } from './useUpdateBudget';

interface UseBudgetFormOptions {
  budgetId?: number;
  onClose: () => void;
}

interface UseBudgetFormResult {
  isEditMode: boolean;
  isLoading: boolean;
  register: ReturnType<typeof useForm<BudgetFormData>>['register'];
  handleSubmit: ReturnType<typeof useForm<BudgetFormData>>['handleSubmit'];
  errors: ReturnType<typeof useForm<BudgetFormData>>['formState']['errors'];
  onSubmit: (data: BudgetFormData) => void;
}

export const useBudgetForm = ({ budgetId, onClose }: UseBudgetFormOptions): UseBudgetFormResult => {
  const isEditMode = !!budgetId;
  const { data: budgetData, isLoading: isBudgetLoading } = useBudget(budgetId);
  const createMutation = useCreateBudget();
  const updateMutation = useUpdateBudget(budgetId);

  const isLoading = isBudgetLoading || createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetFormSchema),
    mode: 'onBlur',
  });

  useEffect(() => {
    if (isEditMode && budgetData) {
      reset({
        title: budgetData.title,
        description: budgetData.description,
        date: budgetData.date,
        initial_amount: budgetData.initial_amount,
      });
    }
  }, [budgetData, isEditMode, reset]);

  useEffect(() => {
    if (createMutation.isSuccess || updateMutation.isSuccess) {
      reset();
      onClose();
    }
  }, [createMutation.isSuccess, updateMutation.isSuccess, onClose, reset]);

  const onSubmit = (data: BudgetFormData) => {
    if (isEditMode) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
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
