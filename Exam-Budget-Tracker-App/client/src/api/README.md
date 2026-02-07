/**
 * API Service Layer
 *
 * This module handles all API communication using React Query.
 * All HTTP requests should be made through React Query hooks.
 *
 * Example:
 * ```typescript
 * // api/services/budget.service.ts
 * export const fetchBudgets = () =>
 *   requester<Budget[]>('/api/budgets')
 *
 * // api/hooks/useFetchBudgets.ts
 * export const useFetchBudgets = () =>
 *   useQuery({
 *     queryKey: ['budgets'],
 *     queryFn: fetchBudgets,
 *   })
 * ```
 */
