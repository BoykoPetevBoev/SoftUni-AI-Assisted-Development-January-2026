import type { UseFormSetError, FieldPath } from 'react-hook-form';
import { ApiError } from '../api/requester';

export function formatErrorMessage(error: string[] | string): string {
  return Array.isArray(error) ? error[0] : error;
}

interface ErrorData {
  detail?: string[] | string;
  non_field_errors?: string[] | string;
  [key: string]: string[] | string | undefined;
}

export function handleApiFormError<T extends Record<string, unknown>>(
  error: unknown,
  setError: UseFormSetError<T>,
  showError: (message: string) => void,
  fieldMapping?: Record<string, string>
): void {
  if (error instanceof ApiError) {
    const errorData = error.data as ErrorData;

    Object.entries(errorData).forEach(([key, value]) => {
      if (key === 'detail') {
        showError(formatErrorMessage(value as string[] | string));
      } else if (key === 'non_field_errors') {
        showError(formatErrorMessage(value as string[] | string));
      } else if (value) {
        const fieldName = (fieldMapping?.[key] || key) as FieldPath<T>;
        setError(fieldName, {
          message: formatErrorMessage(value as string[] | string),
        });
      }
    });
  } else {
    showError('An unexpected error occurred');
  }
}
