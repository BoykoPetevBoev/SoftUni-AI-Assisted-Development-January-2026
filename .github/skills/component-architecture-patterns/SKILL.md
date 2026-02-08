---
name: component-architecture-patterns
description: Create simple components with subcomponents and custom hooks for code clarity
license: MIT
---

# Component Architecture Patterns

## When to Use This Skill

- Breaking down large components into smaller pieces
- Extracting logic into custom hooks
- Improving code readability and maintainability
- Sharing behavior across components

---

## Core Patterns

### 1. Subcomponents Pattern

Instead of one large component, split into smaller focused parts:

**File**: `src/components/TransactionForm.tsx`

```typescript
// Main component
export const TransactionForm = () => {
  const [formData, setFormData] = useState({...});
  
  return (
    <form onSubmit={handleSubmit}>
      <TransactionForm.Header />
      <TransactionForm.Content formData={formData} onChange={setFormData} />
      <TransactionForm.Footer onSubmit={handleSubmit} />
    </form>
  );
};

// Subcomponent 1: Header
TransactionForm.Header = () => (
  <div className="form-header">
    <h2>Add Transaction</h2>
  </div>
);

// Subcomponent 2: Content/Body
TransactionForm.Content = ({ formData, onChange }) => (
  <div className="form-content">
    <input
      value={formData.amount}
      onChange={(e) => onChange({ ...formData, amount: e.target.value })}
      placeholder="Amount"
    />
    <select
      value={formData.category}
      onChange={(e) => onChange({ ...formData, category: e.target.value })}
    >
      <option>Category</option>
    </select>
    <input
      type="date"
      value={formData.date}
      onChange={(e) => onChange({ ...formData, date: e.target.value })}
    />
  </div>
);

// Subcomponent 3: Footer
TransactionForm.Footer = ({ onSubmit }) => (
  <div className="form-footer">
    <button type="submit">Add Transaction</button>
  </div>
);
```

**Benefits:**
- ✅ Each part has single responsibility
- ✅ Easier to test individual sections
- ✅ Clear structure in JSX
- ✅ Reusable subcomponents

---

### 2. Custom Hooks for Logic

Extract business logic into custom hooks:

**File**: `src/hooks/useTransactionForm.ts`

```typescript
import { useState } from 'react';
import { CreateTransactionDto } from '../types/transaction';

export const useTransactionForm = (onSuccess: () => void) => {
  const [formData, setFormData] = useState<CreateTransactionDto>({
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
  });
  
  const [errors, setErrors] = useState<Partial<CreateTransactionDto>>({});
  
  // Validation logic
  const validate = () => {
    const newErrors: Partial<CreateTransactionDto> = {};
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be positive';
    }
    if (!formData.category) {
      newErrors.category = 'Category required';
    }
    if (!formData.date) {
      newErrors.date = 'Date required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Update form field
  const updateField = (field: keyof CreateTransactionDto, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };
  
  // Reset form
  const reset = () => {
    setFormData({
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
    });
    setErrors({});
  };
  
  return {
    formData,
    errors,
    updateField,
    validate,
    reset,
  };
};
```

**Usage**:
```typescript
const MyForm = () => {
  const form = useTransactionForm(() => {
    console.log('Form submitted');
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.validate()) {
      // Submit form.formData
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={form.formData.amount}
        onChange={(e) => form.updateField('amount', e.target.value)}
      />
      {form.errors.amount && <span>{form.errors.amount}</span>}
    </form>
  );
};
```

---

### 3. Separation of Concerns Example

**Component (UI only)**:
```typescript
// src/components/UserCard.tsx
interface UserCardProps {
  name: string;
  email: string;
  onDelete: () => void;
  isDeleting: boolean;
}

export const UserCard = ({ name, email, onDelete, isDeleting }: UserCardProps) => (
  <div className="user-card">
    <h3>{name}</h3>
    <p>{email}</p>
    <button onClick={onDelete} disabled={isDeleting}>
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  </div>
);
```

**Hook (Logic only)**:
```typescript
// src/hooks/useDeleteUser.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/userService';
import { useToast } from './useToast';

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  
  return useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      showToast('User deleted', 'success');
    },
    onError: (error: Error) => {
      showToast(error.message, 'error');
    },
  });
};
```

**Container (Composition)**:
```typescript
// src/components/UserCardContainer.tsx
interface UserCardContainerProps {
  userId: string;
}

export const UserCardContainer = ({ userId }: UserCardContainerProps) => {
  const { data: user } = useUser(userId);
  const deleteUser = useDeleteUser();
  
  if (!user) return <div>Loading...</div>;
  
  return (
    <UserCard
      name={user.name}
      email={user.email}
      onDelete={() => deleteUser.mutate(userId)}
      isDeleting={deleteUser.isPending}
    />
  );
};
```

**Benefits:**
- ✅ `UserCard` is pure, testable, reusable
- ✅ `useDeleteUser` is logic, testable independently
- ✅ `UserCardContainer` composes them together

---

### 4. Compound Component Pattern

```typescript
// Main component
export const Modal = ({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) => {
  if (!isOpen) return null;
  return <div className="modal">{children}</div>;
};

// Subcomponents
Modal.Header = ({ title }: { title: string }) => (
  <div className="modal-header">{title}</div>
);

Modal.Body = ({ children }: { children: React.ReactNode }) => (
  <div className="modal-body">{children}</div>
);

Modal.Footer = ({ children }: { children: React.ReactNode }) => (
  <div className="modal-footer">{children}</div>
);

Modal.Action = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
  <button onClick={onClick}>{children}</button>
);

// Usage
<Modal isOpen={true}>
  <Modal.Header title="Confirm Delete" />
  <Modal.Body>Are you sure?</Modal.Body>
  <Modal.Footer>
    <Modal.Action onClick={handleCancel}>Cancel</Modal.Action>
    <Modal.Action onClick={handleDelete}>Delete</Modal.Action>
  </Modal.Footer>
</Modal>
```

---

## File Structure

```
src/
├── components/
│   ├── TransactionForm/
│   │   ├── TransactionForm.tsx      # Main component with subcomponents
│   │   ├── TransactionForm.test.tsx
│   │   ├── TransactionForm.stories.tsx
│   │   └── index.ts
│   │
│   ├── UserCard.tsx                 # Pure presentational component
│   ├── UserCardContainer.tsx        # Container/logic component
│   │
│   └── Modal.tsx                    # Compound component
│
├── hooks/
│   ├── useTransactionForm.ts        # Form state & validation
│   ├── useDeleteUser.ts             # Delete mutation
│   ├── useUser.ts                   # User query
│   └── useToast.ts                  # Toast notifications
│
└── services/
    └── userService.ts              # API calls
```

---

## Quality Checklist

- [ ] **Component has single responsibility**: One main purpose
- [ ] **Subcomponents are logical**: Related parts grouped together
- [ ] **Logic extracted to hooks**: Business logic separated from UI
- [ ] **Props are clear**: TypeScript interfaces defined
- [ ] **Component is testable**: Pure components are easy to test
- [ ] **No prop drilling**: Use context if needed for deep nesting
- [ ] **Reusable pieces**: Subcomponents can be used elsewhere
- [ ] **Clean imports**: Use barrel exports (index.ts)

---

## Common Patterns

### Simple Presentational Component
```typescript
// Pure UI, no logic
interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

export const Button = ({ onClick, disabled, children }: ButtonProps) => (
  <button onClick={onClick} disabled={disabled}>
    {children}
  </button>
);
```

### Container Component (Smart)
```typescript
// Handles logic and state, delegates rendering
export const TransactionListContainer = () => {
  const { data, isLoading, error } = useTransactions();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <TransactionList items={data} />;
};
```

### Custom Hook Pattern
```typescript
// Extract reusable logic
export const useLocalStorage = (key: string, initialValue: string) => {
  const [value, setValue] = useState(() => {
    try {
      return localStorage.getItem(key) || initialValue;
    } catch {
      return initialValue;
    }
  });
  
  const setValueWithStorage = (newValue: string) => {
    setValue(newValue);
    try {
      localStorage.setItem(key, newValue);
    } catch {
      console.error('Failed to save to localStorage');
    }
  };
  
  return [value, setValueWithStorage] as const;
};
```

---

## Anti-Patterns

❌ **Don't**: Put all logic in one 500-line component  
✅ **Do**: Split into subcomponents and hooks

❌ **Don't**: Pass 10+ props through multiple levels (prop drilling)  
✅ **Do**: Use Context API or custom hooks

❌ **Don't**: Mix UI logic with business logic  
✅ **Do**: Separate into container (logic) and presentational (UI)

❌ **Don't**: Duplicate logic across components  
✅ **Do**: Extract to custom hooks

❌ **Don't**: Create components that are hard to test  
✅ **Do**: Make components pure and simple

---

## References

- **Existing Components**: Review `src/components/LoginForm.tsx`, `Button.tsx`
- **React Patterns**: https://react.dev/learn/passing-props-to-a-component
- **Custom Hooks**: https://react.dev/learn/reusing-logic-with-custom-hooks
- **Compound Components**: https://www.patterns.dev/posts/compound-pattern
