import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { categoryFormSchema, type CategoryFormData } from '../types/category';
import { useCategory } from './useCategory';
import { useCreateCategory } from './useCreateCategory';
import { useUpdateCategory } from './useUpdateCategory';

interface UseCategoryFormOptions {
  categoryId?: number;
  onClose: () => void;
}

interface UseCategoryFormResult {
  isEditMode: boolean;
  isLoading: boolean;
  register: ReturnType<typeof useForm<CategoryFormData>>['register'];
  handleSubmit: ReturnType<typeof useForm<CategoryFormData>>['handleSubmit'];
  errors: ReturnType<typeof useForm<CategoryFormData>>['formState']['errors'];
  onSubmit: (data: CategoryFormData) => void;
}

export const useCategoryForm = ({
  categoryId,
  onClose,
}: UseCategoryFormOptions): UseCategoryFormResult => {
  const isEditMode = !!categoryId;
  const { data: categoryData, isLoading: isCategoryLoading } = useCategory(categoryId);
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory(categoryId);

  const isLoading =
    isCategoryLoading || createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    mode: 'onBlur',
  });

  useEffect(() => {
    if (isEditMode && categoryData) {
      reset({
        name: categoryData.name,
      });
    }
  }, [categoryData, isEditMode, reset]);

  useEffect(() => {
    if (createMutation.isSuccess || updateMutation.isSuccess) {
      reset();
      onClose();
    }
  }, [createMutation.isSuccess, updateMutation.isSuccess, onClose, reset]);

  const onSubmit = (data: CategoryFormData) => {
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
