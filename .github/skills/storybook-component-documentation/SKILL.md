---
name: storybook-component-documentation
description: Create and maintain Storybook stories for React components
license: MIT
---

# Storybook Component Documentation

## When to Use This Skill

- Creating new React components that need visual documentation
- Adding interactive examples for component usage
- Testing component variations and states
- Providing a component library for the team

---

## Core Patterns

### 1. Basic Story Structure

**File Naming**: `ComponentName.stories.tsx`

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline'],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;
```

**Key Rules**:
- Use TypeScript with proper Meta/StoryObj types
- Include `tags: ['autodocs']` for automatic documentation
- Define argTypes for interactive controls

---

### 2. Story Variants

Create stories for different component states:

```typescript
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    children: 'Disabled Button',
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    variant: 'primary',
    children: 'Loading...',
    isLoading: true,
  },
};
```

**Best Practice**: Cover all visual states (default, hover, disabled, loading, error)

---

### 3. Interactive Args & Controls

```typescript
argTypes: {
  // Text input
  children: {
    control: 'text',
    description: 'Button label text',
  },
  
  // Boolean toggle
  disabled: {
    control: 'boolean',
    description: 'Disable the button',
  },
  
  // Select dropdown
  variant: {
    control: 'select',
    options: ['primary', 'secondary', 'outline'],
    description: 'Button visual style',
  },
  
  // Color picker
  backgroundColor: {
    control: 'color',
  },
}
```

---

### 4. Actions for Event Handlers

```typescript
import { fn } from '@storybook/test';

export const WithActions: Story = {
  args: {
    onClick: fn(), // Logs clicks in Actions panel
    onMouseEnter: fn(),
  },
};
```

**Usage**: Use `fn()` from `@storybook/test` to track interactions

---

### 5. Play Functions (Interaction Testing)

```typescript
import { expect, userEvent, within } from '@storybook/test';

export const TestInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    
    // Test button is rendered
    await expect(button).toBeInTheDocument();
    
    // Simulate click
    await userEvent.click(button);
    
    // Verify interaction
    await expect(button).toHaveTextContent('Clicked');
  },
};
```

---

### 6. Decorators for Context

Wrap stories with providers or layouts:

```typescript
import { ThemeProvider } from '../context/ThemeContext';

const meta = {
  title: 'Components/Button',
  component: Button,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ padding: '3rem' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof Button>;
```

---

## Component Story Checklist

When creating stories, ensure:

- [ ] **File named correctly**: `ComponentName.stories.tsx`
- [ ] **Title follows structure**: `Components/ComponentName` or `Pages/PageName`
- [ ] **Tags include autodocs**: `tags: ['autodocs']`
- [ ] **All props have argTypes**: With controls and descriptions
- [ ] **Default story exists**: Shows typical usage
- [ ] **Edge cases covered**: Loading, error, disabled, empty states
- [ ] **Actions defined**: For onClick, onChange, etc.
- [ ] **Decorators added**: If component needs context/providers
- [ ] **Play function**: For complex interactions (optional)

---

## Quality Standards

### ✅ Good Story
```typescript
export const LoginFormDefault: Story = {
  args: {
    onSubmit: fn(),
    isLoading: false,
  },
};

export const LoginFormLoading: Story = {
  args: {
    onSubmit: fn(),
    isLoading: true,
  },
};

export const LoginFormWithError: Story = {
  args: {
    onSubmit: fn(),
    error: 'Invalid credentials',
  },
};
```

### ❌ Bad Story
```typescript
export const Default: Story = {}; // No args, no context
```

---

## Commands

### Run Storybook
```bash
npm run storybook
```

### Build Storybook
```bash
npm run build-storybook
```

### Test Stories
```bash
npm run test-storybook
```

---

## References

- **Existing Stories**: See `src/components/Button.stories.tsx`, `LoginForm.stories.tsx`
- **Storybook Docs**: https://storybook.js.org/docs/react/writing-stories/introduction
- **Testing**: https://storybook.js.org/docs/react/writing-tests/interaction-testing

---

## Anti-Patterns

❌ **Don't**: Create one story with all variants combined  
✅ **Do**: Create separate stories for each variant

❌ **Don't**: Skip argTypes (no interactive controls)  
✅ **Do**: Define argTypes for all props

❌ **Don't**: Use real API calls in stories  
✅ **Do**: Mock data and functions with `fn()`

❌ **Don't**: Forget to test edge cases  
✅ **Do**: Cover loading, error, empty, disabled states
