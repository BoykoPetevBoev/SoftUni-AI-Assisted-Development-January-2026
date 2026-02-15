---
name: react-query-api-service
description: Create API services and React Query hooks for data fetching
license: MIT
---

# React Query API Service

## When to Use This Skill

- Fetching data from backend APIs
- Creating mutations for POST/PUT/DELETE operations
- Managing loading/error states
- Caching and invalidating data

---

## Core Patterns Overview

**Service Layer Pattern**: Create service files that contain all API calls for a specific entity. Each service exports an object with methods for different operations (getAll, getById, create, update, delete). Services use a base `apiRequest` utility for consistency. Return properly typed responses.

**React Query Hooks for Queries**: Create custom hooks that wrap React Query's `useQuery`. Each query needs a unique `queryKey` (as an array). Include an `enabled` condition for conditional queries (e.g., only fetch if ID exists). Return `data`, `isLoading`, `error`, and other state from React Query.

**React Query Hooks for Mutations**: Wrap mutations with `useMutation`. Always use `queryClient.invalidateQueries()` in `onSuccess` to refresh related data. Show toast notifications on success/error. Return `mutate`, `isPending`, and other mutation state to components.

**Query Keys Pattern**: Define query keys as constants to avoid string duplication. Use a hierarchical structure (e.g., `['users', 'list']`, `['users', 'detail', id]`). Follow a consistent naming convention. Use this pattern to manage cache invalidation effectively.

**File Structure**: Organize code into `services/` (API calls), `hooks/` (React Query hooks), `api/` (base utilities), and `types/` (TypeScript types). Each entity gets its own service file and corresponding hook files.

**Common Patterns**: List queries return all items with `queryKey: ['items']`. Detail queries return single items with `queryKey: ['items', id]` and `enabled: !!id` condition. Use the same patterns for create/update/delete mutations across all entities.

---

## Key Rules

- Create service files with API methods
- Define hooks that use React Query
- Use query keys as arrays (not strings)
- Include `enabled` condition for conditional queries
- Always `invalidateQueries` after mutations
- Use `isPending` instead of `isLoading` for mutations
- Return proper TypeScript types from services
- Show toast notifications for errors
- Use service layer, avoid direct API calls in components
- Organize by entity (users, transactions, etc.)
- Define query keys as constants
- Filter queries at the queryset level

---

## Anti-Patterns

❌ **Don't**: Fetch data in useEffect  
✅ **Do**: Use React Query hooks

❌ **Don't**: Manually manage loading/error state  
✅ **Do**: Use `isLoading`, `error` from React Query

❌ **Don't**: Forget cache invalidation after mutations  
✅ **Do**: Always `invalidateQueries` in `onSuccess`

❌ **Don't**: Use string literals for query keys  
✅ **Do**: Define query keys as constants

❌ **Don't**: Make API calls directly in components  
✅ **Do**: Create service layer + React Query hooks

---

## Quality Checklist

- [ ] **Service file created**: `src/services/entityService.ts`
- [ ] **Hook file created**: `src/hooks/useEntity.ts`
- [ ] **Query keys defined**: Consistent naming with array format
- [ ] **Error handling**: `onError` callback with toast notification
- [ ] **Cache invalidation**: `invalidateQueries` after mutations
- [ ] **Loading states**: Use `isLoading` or `isPending`
- [ ] **TypeScript types**: Return types and DTOs defined
- [ ] **Enabled condition**: For conditional queries (e.g., `enabled: !!id`)

---

## Common Patterns

### List Query Pattern
```
useQuery({ queryKey: ['items'], queryFn: getAll })
```

### Detail Query Pattern
```
useQuery({ queryKey: ['items', id], queryFn: () => getById(id), enabled: !!id })
```

### Create Mutation Pattern
```
useMutation({ mutationFn: create, onSuccess: () => invalidateQueries(['items']) })
```

### Update Mutation Pattern
```
useMutation({ mutationFn: (data) => update(id, data), onSuccess: () => invalidateQueries(['items']) })
```

### Delete Mutation Pattern
```
useMutation({ mutationFn: delete, onSuccess: () => invalidateQueries(['items']) })
```

---

## References

- **Existing Code**: `src/api/requester.ts` for base API utility
- **React Query Docs**: https://tanstack.com/query/latest
- **Project Pattern**: Service layer → React Query hook → Component

---

# CODE EXAMPLES

## 1. Basic Service Function

**File**: `src/services/userService.ts`

```typescript
import { apiRequest } from '../api/requester';

export const userService = {
  // GET request
  getUser: async (id: string) => {
    return apiRequest<User>(`/users/${id}`);
  },
  
  // POST request
  createUser: async (data: CreateUserDto) => {
    return apiRequest<User>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  // PUT request
  updateUser: async (id: string, data: UpdateUserDto) => {
    return apiRequest<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  // DELETE request
  deleteUser: async (id: string) => {
    return apiRequest<void>(`/users/${id}`, {
      method: 'DELETE',
    });
  },
};
```

## 2. React Query Hook for GET (useQuery)

**File**: `src/hooks/useUser.ts`

```typescript
import { useQuery } from '@tanstack/react-query';
import { userService } from '../services/userService';

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getUser(id),
    enabled: !!id, // Only run if id exists
  });
};

// Usage in component
const UserProfile = ({ userId }: { userId: string }) => {
  const { data, isLoading, error } = useUser(userId);
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{data.name}</div>;
};
```

## 3. React Query Hook for POST/PUT/DELETE (useMutation)

**File**: `src/hooks/useCreateUser.ts`

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/userService';
import { useToast } from '../hooks/useToast';

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  
  return useMutation({
    mutationFn: userService.createUser,
    onSuccess: () => {
      // Invalidate users list to refetch
      queryClient.invalidateQueries({ queryKey: ['users'] });
      showToast('User created successfully', 'success');
    },
    onError: (error: Error) => {
      showToast(error.message, 'error');
    },
  });
};

// Usage in component
const CreateUserForm = () => {
  const createUser = useCreateUser();
  
  const handleSubmit = (data: CreateUserDto) => {
    createUser.mutate(data);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={createUser.isPending}>
        {createUser.isPending ? 'Creating...' : 'Create User'}
      </button>
    </form>
  );
};
```

## 4. Query Keys Pattern

**File**: `src/constants/queryKeys.ts`

```typescript
// src/constants/queryKeys.ts
export const queryKeys = {
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.users.lists(), { filters }] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },
  transactions: {
    all: ['transactions'] as const,
    list: () => [...queryKeys.transactions.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.transactions.all, 'detail', id] as const,
  },
};

// Usage
useQuery({
  queryKey: queryKeys.users.detail(userId),
  queryFn: () => userService.getUser(userId),
});
```

## 5. Complete Service + Hook Example

**Service**: `src/services/transactionService.ts`

```typescript
import { apiRequest } from '../api/requester';
import { Transaction, CreateTransactionDto } from '../types/transaction';

export const transactionService = {
  getAll: async () => {
    return apiRequest<Transaction[]>('/transactions');
  },
  
  getById: async (id: string) => {
    return apiRequest<Transaction>(`/transactions/${id}`);
  },
  
  create: async (data: CreateTransactionDto) => {
    return apiRequest<Transaction>('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  delete: async (id: string) => {
    return apiRequest<void>(`/transactions/${id}`, {
      method: 'DELETE',
    });
  },
};
```

**Hook**: `src/hooks/useTransactions.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionService } from '../services/transactionService';
import { useToast } from './useToast';

// GET all transactions
export const useTransactions = () => {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: transactionService.getAll,
  });
};

// CREATE transaction
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  
  return useMutation({
    mutationFn: transactionService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      showToast('Transaction created', 'success');
    },
    onError: (error: Error) => {
      showToast(error.message, 'error');
    },
  });
};

// DELETE transaction
export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  
  return useMutation({
    mutationFn: transactionService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      showToast('Transaction deleted', 'success');
    },
    onError: (error: Error) => {
      showToast(error.message, 'error');
    },
  });
};
```

**Usage in Component**:

```typescript
const TransactionList = () => {
  const { data: transactions, isLoading } = useTransactions();
  const deleteTransaction = useDeleteTransaction();
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      {transactions?.map(tx => (
        <div key={tx.id}>
          <span>{tx.description}</span>
          <button onClick={() => deleteTransaction.mutate(tx.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};
```

## 6. List + Detail Pattern

```typescript
// List
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
  });
};

// Detail
export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => userService.getUser(id),
    enabled: !!id,
  });
};
```

## 7. Create + Update + Delete Pattern

```typescript
export const useCreateEntity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: entityService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['entities'] }),
  });
};

export const useUpdateEntity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => entityService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['entities'] }),
  });
};

export const useDeleteEntity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: entityService.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['entities'] }),
  });
};
```
