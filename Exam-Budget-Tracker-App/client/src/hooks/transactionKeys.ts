/**
 * Query key factory for transaction-related queries
 * Follows the pattern: ['transactions', 'scope', ...identifiers]
 */
export const transactionKeys = {
  all: ['transactions'] as const,
  lists: () => [...transactionKeys.all, 'list'] as const,
  list: (filters?: { budgetId?: number }) => [
    ...transactionKeys.lists(),
    filters ?? {},
  ] as const,
  details: () => [...transactionKeys.all, 'detail'] as const,
  detail: (id?: number) => [...transactionKeys.details(), id] as const,
};
