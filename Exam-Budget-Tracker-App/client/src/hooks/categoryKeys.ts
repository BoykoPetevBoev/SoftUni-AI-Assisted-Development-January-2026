/**
 * Query key factory for category-related queries
 * Follows the pattern: ['categories', 'scope', ...identifiers]
 */
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: () => categoryKeys.lists(),
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id?: number) => [...categoryKeys.details(), id] as const,
};
