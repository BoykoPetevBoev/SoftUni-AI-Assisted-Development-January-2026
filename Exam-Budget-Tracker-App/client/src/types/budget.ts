import { z } from 'zod';

export interface Budget {
  id: number;
  user: number;
  title: string;
  description: string;
  date: string;
  initial_amount: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBudgetPayload {
  title: string;
  description?: string;
  date: string;
  initial_amount: string | number;
}

export interface UpdateBudgetPayload {
  title?: string;
  description?: string;
  date?: string;
  initial_amount?: string | number;
}

export interface BudgetListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Budget[];
}

export type BudgetFormValues = CreateBudgetPayload;

// Zod schemas for validation
export const budgetFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must not exceed 255 characters'),
  description: z
    .string()
    .max(5000, 'Description must not exceed 5000 characters')
    .optional()
    .default(''),
  date: z
    .string()
    .min(1, 'Date is required')
    .refine(
      (dateStr) => !isNaN(new Date(dateStr).getTime()),
      'Date must be a valid date'
    ),
  initial_amount: z
    .string()
    .min(1, 'Amount is required')
    .refine((value) => !isNaN(Number(value)), 'Amount must be a valid number')
    .transform((value) => Number(value))
    .refine((amount) => amount > 0, 'Amount must be greater than 0')
    .refine(
      (amount) => amount <= 999999999.99,
      'Amount must not exceed 999,999,999.99'
    )
    .transform((amount) => amount.toString()),
});

export type BudgetFormData = z.input<typeof budgetFormSchema>;
