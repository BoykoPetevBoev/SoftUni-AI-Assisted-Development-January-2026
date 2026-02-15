/**
 * Query key factory for budget-related queries
 * Follows the pattern: ['budgets', 'scope', ...identifiers]
 */
export const budgetKeys = {
  all: ['budgets'] as const,
  lists: () => [...budgetKeys.all, 'list'] as const,
  list: () => budgetKeys.lists(),
  details: () => [...budgetKeys.all, 'detail'] as const,
  detail: (id?: number) => [...budgetKeys.details(), id] as const,
};
