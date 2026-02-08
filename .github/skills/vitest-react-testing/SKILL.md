---
name: vitest-react-testing
description: Write unit tests for React components using Vitest and React Testing Library
license: MIT
---

# Vitest + React Testing Library

## When to Use This Skill

- Writing unit tests for React components
- Testing user interactions (clicks, typing, form submissions)
- Testing async behavior (API calls, loading states)
- Verifying component rendering and state changes

---

## Core Patterns

### 1. Basic Test Structure

**File Naming**: `ComponentName.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });
});
```

**Key Rules**:
- Use `describe()` for component grouping
- Use `it()` or `test()` for individual test cases
- Always use `screen` queries (not destructured from render)

---

### 2. Query Priority (Use in This Order)

```typescript
// 1. ✅ BEST: Accessible to everyone (use role/label)
screen.getByRole('button', { name: /submit/i });
screen.getByLabelText('Email');

// 2. ✅ GOOD: Semantic queries
screen.getByPlaceholderText('Enter email');
screen.getByText('Welcome');

// 3. ⚠️ LAST RESORT: Test IDs (only when above don't work)
screen.getByTestId('custom-element');

// 4. ❌ NEVER: Class names or internal implementation
// Don't use: getByClassName, querySelector
```

---

### 3. User Interactions

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button interactions', () => {
  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Click</Button>);
    
    await user.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('types into input field', async () => {
    const user = userEvent.setup();
    
    render(<input aria-label="Email" />);
    const input = screen.getByLabelText('Email');
    
    await user.type(input, 'test@example.com');
    
    expect(input).toHaveValue('test@example.com');
  });
});
```

**Key Rules**:
- Always use `userEvent.setup()` before interactions
- Use `await` with all user interactions
- Use `vi.fn()` for mock functions

---

### 4. Testing Forms

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('submits form with valid data', async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();
    
    render(<LoginForm onSubmit={handleSubmit} />);
    
    // Fill form fields
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /login/i }));
    
    // Verify submission
    expect(handleSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });
  
  it('shows validation error for invalid email', async () => {
    const user = userEvent.setup();
    
    render(<LoginForm onSubmit={vi.fn()} />);
    
    await user.type(screen.getByLabelText(/email/i), 'invalid-email');
    await user.click(screen.getByRole('button', { name: /login/i }));
    
    expect(screen.getByText(/valid email/i)).toBeInTheDocument();
  });
});
```

---

### 5. Testing Async Behavior

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { UserProfile } from './UserProfile';

describe('UserProfile async', () => {
  it('shows loading state then data', async () => {
    render(<UserProfile userId="123" />);
    
    // Check loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    
    // Loading should be gone
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });
  
  it('handles error state', async () => {
    // Mock API failure
    vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('API Error'));
    
    render(<UserProfile userId="123" />);
    
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
```

**Key Rules**:
- Use `waitFor()` for async updates
- Use `findBy` queries (they wait automatically): `await screen.findByText('loaded')`
- Use `queryBy` to assert element doesn't exist

---

### 6. Mocking API Calls

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Component with API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('fetches and displays data', async () => {
    // Mock fetch
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ name: 'John Doe' }),
    });
    
    render(<UserProfile userId="123" />);
    
    await screen.findByText('John Doe');
    
    expect(global.fetch).toHaveBeenCalledWith('/api/users/123');
  });
});
```

---

### 7. Testing Context/Providers

```typescript
import { render, screen } from '@testing-library/react';
import { AuthProvider } from '../context/AuthContext';

describe('Component with context', () => {
  const renderWithAuth = (component: React.ReactElement, user = null) => {
    return render(
      <AuthProvider value={{ user }}>
        {component}
      </AuthProvider>
    );
  };
  
  it('shows login button when not authenticated', () => {
    renderWithAuth(<Dashboard />, null);
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });
  
  it('shows user name when authenticated', () => {
    renderWithAuth(<Dashboard />, { name: 'John' });
    expect(screen.getByText('Welcome, John')).toBeInTheDocument();
  });
});
```

---

## Test Quality Checklist

- [ ] **File named correctly**: `ComponentName.test.tsx`
- [ ] **Describes component**: `describe('ComponentName', () => {})`
- [ ] **Uses accessible queries**: `getByRole`, `getByLabelText` (not class names)
- [ ] **Tests user behavior**: What user sees/does (not implementation)
- [ ] **Async handled properly**: `await user.click()`, `waitFor()`, `findBy`
- [ ] **Mocks are setup**: Use `vi.fn()` for callbacks, mock fetch/API
- [ ] **Happy path tested**: Default/successful behavior works
- [ ] **Error cases tested**: Validation errors, API failures
- [ ] **Edge cases covered**: Empty states, loading states, disabled states
- [ ] **Cleanup done**: `beforeEach(() => vi.clearAllMocks())`

---

## Common Test Patterns

### Test Component Renders
```typescript
it('renders without crashing', () => {
  render(<Button>Click</Button>);
  expect(screen.getByRole('button')).toBeInTheDocument();
});
```

### Test Props
```typescript
it('applies variant prop', () => {
  render(<Button variant="primary">Click</Button>);
  expect(screen.getByRole('button')).toHaveClass('button--primary');
});
```

### Test Conditional Rendering
```typescript
it('shows loading spinner when isLoading is true', () => {
  render(<Button isLoading>Submit</Button>);
  expect(screen.getByRole('status')).toBeInTheDocument();
  expect(screen.queryByText('Submit')).not.toBeInTheDocument();
});
```

### Test Disabled State
```typescript
it('disables button when disabled prop is true', () => {
  render(<Button disabled>Click</Button>);
  expect(screen.getByRole('button')).toBeDisabled();
});
```

---

## Commands

### Run Tests
```bash
npm test
```

### Run in Watch Mode
```bash
npm test -- --watch
```

### Run with Coverage
```bash
npm test -- --coverage
```

### Update Snapshots
```bash
npm test -- -u
```

---

## Quality Standards

### ✅ Good Test
```typescript
it('submits form with valid credentials', async () => {
  const handleSubmit = vi.fn();
  const user = userEvent.setup();
  
  render(<LoginForm onSubmit={handleSubmit} />);
  
  await user.type(screen.getByLabelText(/email/i), 'test@example.com');
  await user.type(screen.getByLabelText(/password/i), 'password123');
  await user.click(screen.getByRole('button', { name: /login/i }));
  
  expect(handleSubmit).toHaveBeenCalledWith({
    email: 'test@example.com',
    password: 'password123',
  });
});
```

**Why Good:**
- Tests user behavior (type, click)
- Uses accessible queries (getByLabelText, getByRole)
- Has clear assertion
- Async properly handled

### ❌ Bad Test
```typescript
it('works', () => {
  const wrapper = render(<LoginForm />);
  expect(wrapper.container.querySelector('.form')).toBeTruthy();
});
```

**Why Bad:**
- Vague test name
- Uses querySelector (implementation detail)
- No actual behavior tested
- Missing user interactions

---

## Anti-Patterns

❌ **Don't**: Test implementation details  
✅ **Do**: Test user-visible behavior

❌ **Don't**: Use `querySelector` or class names  
✅ **Do**: Use `getByRole`, `getByLabelText`

❌ **Don't**: Forget `await` with user interactions  
✅ **Do**: Always `await user.click()`, `await user.type()`

❌ **Don't**: Test internal state directly  
✅ **Do**: Test what user sees after state changes

❌ **Don't**: Write tests that depend on each other  
✅ **Do**: Make each test independent

---

## References

- **Existing Tests**: See `src/components/Button.test.tsx`, `LoginForm.test.tsx`
- **React Testing Library**: https://testing-library.com/docs/react-testing-library/intro
- **Vitest**: https://vitest.dev/
- **User Event**: https://testing-library.com/docs/user-event/intro
