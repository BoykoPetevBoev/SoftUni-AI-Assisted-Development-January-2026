import { z } from 'zod';

export interface Category {
  id: number;
  user: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryPayload {
  name: string;
}

export interface UpdateCategoryPayload {
  name?: string;
}

export interface CategoryListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Category[];
}

export type CategoryFormValues = CreateCategoryPayload;

// Zod schema for validation
export const categoryFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .max(100, 'Category name must not exceed 100 characters')
    .trim(),
});

export type CategoryFormData = z.input<typeof categoryFormSchema>;
