import { z } from 'zod';

export interface Transaction {
  id: number;
  budget: number;
  amount: string;
  category: number | null;
  description?: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTransactionPayload {
  budget: number;
  amount: string | number;
  category?: number | null;
  description?: string;
  date: string;
}

export interface UpdateTransactionPayload {
  budget?: number;
  amount?: string | number;
  category?: number | null;
  description?: string;
  date?: string;
}

export interface TransactionListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Transaction[];
}

export const transactionFormSchema = z.object({
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine((value) => !isNaN(Number(value)), 'Amount must be a valid number')
    .transform((value) => Number(value))
    .refine((value) => value !== 0, 'Amount must be non-zero')
    .refine(
      (value) => Math.abs(value) <= 9999999999.99,
      'Amount is too large'
    )
    .transform((value) => value.toString()),
  category: z
    .union([
      z.string().transform((val) => (val === '' ? null : Number(val))),
      z.number().nullable(),
      z.null(),
    ])
    .refine((val) => val === null || Number.isInteger(val), 'Invalid category')
    .optional()
    .default(null)
    .nullable(),
  description: z
    .string()
    .max(255, 'Description must not exceed 255 characters')
    .optional()
    .default(''),
  date: z
    .string()
    .min(1, 'Date is required')
    .refine(
      (dateStr) => !isNaN(new Date(dateStr).getTime()),
      'Date must be a valid date'
    ),
});

export type TransactionFormData = z.input<typeof transactionFormSchema>;
