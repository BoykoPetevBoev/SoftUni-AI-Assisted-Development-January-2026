---
name: react-form-development
description: Build robust forms with React Hook Form and Zod validation
license: MIT
---

# React Hook Form + Zod Validation

## When to Use This Skill

- Building forms with validation (login, registration, data entry)
- Managing form state efficiently
- Displaying validation errors to users
- Submitting form data to APIs
- Testing form interactions and validation

---

## Core Patterns

### 1. Basic Form Setup

**File**: `src/components/LoginForm/LoginForm.tsx`

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Define Zod schema
const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    console.log('Form data:', data);
    // Call API here
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register('email')}
        />
        {errors.email && (
          <span className="error">{errors.email.message}</span>
        )}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          {...register('password')}
        />
        {errors.password && (
          <span className="error">{errors.password.message}</span>
        )}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Loading...' : 'Login'}
      </button>
    </form>
  );
};
```

**Key Rules**:
- Define Zod schema outside component (reusable, testable)
- Use `zodResolver` to integrate with React Hook Form
- Use `z.infer<typeof schema>` for TypeScript types
- Display validation errors inline below inputs
- Disable submit button while submitting

---

### 2. Complex Validation Schema

**File**: `src/components/RegisterForm/schema.ts`

```typescript
import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  
  confirmPassword: z.string(),
  
  terms: z.boolean()
    .refine((val) => val === true, {
      message: 'You must accept the terms and conditions',
    }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'], // Error appears on confirmPassword field
});

export type RegisterFormData = z.infer<typeof registerSchema>;
```

**Key Rules**:
- Use `.regex()` for pattern validation
- Use `.min()` and `.max()` for length validation
- Use `.refine()` for custom validation logic
- Use `.refine()` with `path` for cross-field validation
- Separate schema from component (easier testing)

---

### 3. Form with Default Values

**File**: `src/components/ProfileForm/ProfileForm.tsx`

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  bio: z.string().max(500, 'Bio must be at most 500 characters').optional(),
  age: z.coerce.number().min(18, 'Must be at least 18 years old').optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  initialData?: Partial<ProfileFormData>;
  onSubmit: (data: ProfileFormData) => Promise<void>;
}

export const ProfileForm = ({ initialData, onSubmit }: ProfileFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialData,
  });

  // Reset form when initialData changes (e.g., after fetch)
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="firstName">First Name</label>
        <input id="firstName" {...register('firstName')} />
        {errors.firstName && <span className="error">{errors.firstName.message}</span>}
      </div>

      <div>
        <label htmlFor="lastName">Last Name</label>
        <input id="lastName" {...register('lastName')} />
        {errors.lastName && <span className="error">{errors.lastName.message}</span>}
      </div>

      <div>
        <label htmlFor="bio">Bio</label>
        <textarea id="bio" {...register('bio')} rows={4} />
        {errors.bio && <span className="error">{errors.bio.message}</span>}
      </div>

      <div>
        <label htmlFor="age">Age</label>
        <input id="age" type="number" {...register('age')} />
        {errors.age && <span className="error">{errors.age.message}</span>}
      </div>

      <button type="submit" disabled={isSubmitting || !isDirty}>
        {isSubmitting ? 'Saving...' : 'Save Profile'}
      </button>
    </form>
  );
};
```

**Key Rules**:
- Use `defaultValues` for initial data (edit forms)
- Use `reset()` to update form when data changes
- Use `isDirty` to detect if form was modified
- Use `z.coerce.number()` for number inputs (converts string to number)
- Use `.optional()` for optional fields

---

### 4. Form Error Handling

**File**: `src/components/TransactionForm/TransactionForm.tsx`

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';

const transactionSchema = z.object({
  amount: z.coerce.number()
    .positive('Amount must be positive')
    .max(1000000, 'Amount cannot exceed 1,000,000'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

export const TransactionForm = () => {
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
  });

  const onSubmit = async (data: TransactionFormData) => {
    setApiError(null); // Clear previous API errors

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        
        // If backend returns field-specific errors
        if (error.field === 'amount') {
          setError('amount', {
            type: 'server',
            message: error.message,
          });
        } else {
          // General error
          setApiError(error.message || 'Failed to create transaction');
        }
        return;
      }

      reset(); // Clear form on success
      alert('Transaction created successfully!');
    } catch (err) {
      setApiError('Network error. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {apiError && (
        <div className="error-banner" role="alert">
          {apiError}
        </div>
      )}

      <div>
        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          type="number"
          step="0.01"
          {...register('amount')}
        />
        {errors.amount && (
          <span className="error">{errors.amount.message}</span>
        )}
      </div>

      <div>
        <label htmlFor="category">Category</label>
        <select id="category" {...register('category')}>
          <option value="">Select category</option>
          <option value="food">Food</option>
          <option value="transport">Transport</option>
          <option value="entertainment">Entertainment</option>
        </select>
        {errors.category && (
          <span className="error">{errors.category.message}</span>
        )}
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <input id="description" {...register('description')} />
      </div>

      <div>
        <label htmlFor="date">Date</label>
        <input id="date" type="date" {...register('date')} />
        {errors.date && (
          <span className="error">{errors.date.message}</span>
        )}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Transaction'}
      </button>
    </form>
  );
};
```

**Key Rules**:
- Use `setError()` for programmatic field errors (e.g., from API)
- Separate API errors from validation errors
- Use `reset()` to clear form after successful submission
- Display API errors in banner above form
- Use `role="alert"` for error banners (accessibility)

---

### 5. Password Field Pattern

**File**: `src/components/PasswordField/PasswordField.tsx`

```typescript
import { useState } from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface PasswordFieldProps {
  name: string;
  label: string;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  showStrength?: boolean;
}

export const PasswordField = ({
  name,
  label,
  register,
  errors,
  showStrength = false,
}: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');

  const getPasswordStrength = (pwd: string): string => {
    if (pwd.length === 0) return '';
    if (pwd.length < 6) return 'Weak';
    if (pwd.length < 10 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) return 'Medium';
    if (pwd.length >= 10 && /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /[0-9]/.test(pwd)) return 'Strong';
    return 'Weak';
  };

  const strength = showStrength ? getPasswordStrength(password) : null;

  return (
    <div className="password-field">
      <label htmlFor={name}>{label}</label>
      <div className="password-input-wrapper">
        <input
          id={name}
          type={showPassword ? 'text' : 'password'}
          {...register(name, {
            onChange: (e) => setPassword(e.target.value),
          })}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? '👁️' : '👁️‍🗨️'}
        </button>
      </div>
      
      {showStrength && strength && (
        <div className={`password-strength strength-${strength.toLowerCase()}`}>
          Strength: {strength}
        </div>
      )}
      
      {errors[name] && (
        <span className="error">{errors[name]?.message as string}</span>
      )}
    </div>
  );
};
```

**Usage**:
```typescript
<PasswordField
  name="password"
  label="Password"
  register={register}
  errors={errors}
  showStrength={true}
/>
```

**Key Rules**:
- Provide toggle for show/hide password
- Use `aria-label` for accessibility
- Optional password strength indicator
- Reusable component pattern
- Integrate with React Hook Form's `register`

---

### 6. Testing Forms

**File**: `src/components/LoginForm/LoginForm.test.tsx`

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('displays validation errors for invalid inputs', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    // Submit empty form
    await user.click(screen.getByRole('button', { name: /login/i }));

    // Check validation errors appear
    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    });
  });

  it('displays error for invalid email format', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'invalid-email');
    await user.tab(); // Trigger blur

    await waitFor(() => {
      expect(screen.getByText('Invalid email format')).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    
    render(<LoginForm onSubmit={onSubmit} />);

    // Fill form
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');

    // Submit
    await user.click(screen.getByRole('button', { name: /login/i }));

    // Verify submission
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('disables submit button while submitting', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<LoginForm onSubmit={onSubmit} />);

    // Fill form
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');

    const submitButton = screen.getByRole('button', { name: /login/i });

    // Submit
    await user.click(submitButton);

    // Button should be disabled while submitting
    expect(submitButton).toBeDisabled();
    expect(screen.getByRole('button', { name: /loading/i })).toBeInTheDocument();

    // Wait for submission to complete
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });
});
```

**Key Rules**:
- Test validation errors (required fields, format validation)
- Test successful submission with valid data
- Test loading states (disabled button, loading text)
- Use `waitFor()` for async validation
- Use `userEvent` for realistic interactions
- Mock `onSubmit` handler with `vi.fn()`

---

### 7. Form with Dynamic Fields

**File**: `src/components/ExpenseForm/ExpenseForm.tsx`

```typescript
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const expenseItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  amount: z.coerce.number().positive('Amount must be positive'),
});

const expenseFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  items: z.array(expenseItemSchema).min(1, 'At least one item is required'),
});

type ExpenseFormData = z.infer<typeof expenseFormSchema>;

export const ExpenseForm = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      title: '',
      items: [{ description: '', amount: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const onSubmit = (data: ExpenseFormData) => {
    console.log('Form data:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="title">Expense Title</label>
        <input id="title" {...register('title')} />
        {errors.title && <span className="error">{errors.title.message}</span>}
      </div>

      <h3>Items</h3>
      {fields.map((field, index) => (
        <div key={field.id} className="expense-item">
          <div>
            <label htmlFor={`items.${index}.description`}>Description</label>
            <input {...register(`items.${index}.description`)} />
            {errors.items?.[index]?.description && (
              <span className="error">{errors.items[index]?.description?.message}</span>
            )}
          </div>

          <div>
            <label htmlFor={`items.${index}.amount`}>Amount</label>
            <input type="number" step="0.01" {...register(`items.${index}.amount`)} />
            {errors.items?.[index]?.amount && (
              <span className="error">{errors.items[index]?.amount?.message}</span>
            )}
          </div>

          <button type="button" onClick={() => remove(index)}>
            Remove
          </button>
        </div>
      ))}

      {errors.items && typeof errors.items.message === 'string' && (
        <span className="error">{errors.items.message}</span>
      )}

      <button
        type="button"
        onClick={() => append({ description: '', amount: 0 })}
      >
        Add Item
      </button>

      <button type="submit">Submit</button>
    </form>
  );
};
```

**Key Rules**:
- Use `useFieldArray` for dynamic fields
- Use `field.id` as key (not index)
- Use `append()` to add fields
- Use `remove(index)` to remove fields
- Validate array length with `.min()` or `.max()`
- Access nested errors with `errors.items?.[index]?.field`

---

## Anti-Patterns (❌ AVOID)

### ❌ Don't use uncontrolled forms without validation
```typescript
// BAD - No validation, hard to test
const BadForm = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    // No validation!
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
};
```

### ❌ Don't duplicate validation logic
```typescript
// BAD - Validation in both frontend and submit handler
const BadForm = () => {
  const onSubmit = (data) => {
    // Don't validate again here - Zod already did this
    if (!data.email || !data.email.includes('@')) {
      alert('Invalid email');
      return;
    }
  };
};
```

### ❌ Don't forget to handle loading states
```typescript
// BAD - No loading state, button can be clicked multiple times
<button type="submit">Submit</button>

// GOOD
<button type="submit" disabled={isSubmitting}>
  {isSubmitting ? 'Submitting...' : 'Submit'}
</button>
```

### ❌ Don't use inline styles for errors
```typescript
// BAD - Inline styles, not accessible
{errors.email && <span style={{ color: 'red' }}>{errors.email.message}</span>}

// GOOD - CSS class, semantic HTML
{errors.email && <span className="error" role="alert">{errors.email.message}</span>}
```

---

## Quality Checklist

Before submitting a form implementation:

- [ ] Zod schema defined with clear error messages
- [ ] All fields have proper HTML labels linked with `htmlFor`
- [ ] Validation errors display inline below inputs
- [ ] Submit button disabled while `isSubmitting`
- [ ] API errors handled and displayed to user
- [ ] Form resets after successful submission (if appropriate)
- [ ] Password fields have show/hide toggle
- [ ] Required fields marked with `*` or "(required)" label
- [ ] Form has proper TypeScript types from Zod schema
- [ ] Form tested with valid and invalid inputs
- [ ] Accessible: ARIA labels, error roles, keyboard navigation
- [ ] Loading states communicated visually

---

## Common Zod Validators

```typescript
// String
z.string()
  .min(3, 'Minimum 3 characters')
  .max(50, 'Maximum 50 characters')
  .email('Invalid email')
  .url('Invalid URL')
  .regex(/pattern/, 'Custom pattern message')
  .trim() // Remove whitespace
  .toLowerCase() // Convert to lowercase

// Number
z.number()
  .min(0, 'Must be positive')
  .max(100, 'Too large')
  .positive('Must be positive')
  .int('Must be integer')

z.coerce.number() // Convert string to number (for input type="number")

// Boolean
z.boolean()

// Date
z.date()
z.string().datetime() // ISO string
z.coerce.date() // Convert string to Date

// Optional/Nullable
z.string().optional() // undefined | string
z.string().nullable() // null | string
z.string().nullish() // null | undefined | string

// Enums
z.enum(['option1', 'option2', 'option3'])

// Custom validation
z.string().refine((val) => val !== 'admin', {
  message: 'Username cannot be "admin"',
})

// Conditional validation
z.discriminatedUnion('type', [
  z.object({ type: z.literal('email'), email: z.string().email() }),
  z.object({ type: z.literal('phone'), phone: z.string() }),
])
```

---

## Resources

- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [Zod Resolver](https://github.com/react-hook-form/resolvers#zod)
