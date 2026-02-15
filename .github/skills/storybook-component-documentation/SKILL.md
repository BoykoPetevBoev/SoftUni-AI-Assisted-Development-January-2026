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

## Core Patterns Overview

**Basic Story Structure**: Stories are TypeScript files named `ComponentName.stories.tsx`. Each story file imports the component and creates metadata with Meta and StoryObj types. Include `tags: ['autodocs']` for automatic documentation generation. Define argTypes for interactive controls in the sidebar.

**Story Variants**: Create separate stories for each component state (default, loading, disabled, error, empty). Each story is an object with an `args` property containing the component props. Use descriptive story names that reflect the state they represent.

**Interactive Args & Controls**: Define argTypes for all props with control types (text, boolean, select, color, etc.). Include descriptions for each control. This allows Storybook to generate interactive controls in the UI panel.

**Actions for Event Handlers**: Use the `fn()` function from `@storybook/test` to mock event handlers. This tracks interactions in the Actions panel. Helpful for testing onClick, onChange, and other callbacks.

**Play Functions (Interaction Testing)**: Write test-like code in the `play` function to interact with components. Use `userEvent` for realistic interactions. Verify behavior with `expect` statements. These tests run automatically in Storybook.

**Decorators for Context**: Wrap stories with context providers (theme, layout, etc.) using decorators. A decorator is a function that returns JSX wrapping the Story. Apply at the meta level for all stories or per-story.

---

## Key Rules

- File named correctly: `ComponentName.stories.tsx`
- Title follows structure: `Components/ComponentName` or `Pages/PageName`
- Tags include autodocs: `tags: ['autodocs']`
- All props have argTypes: With controls and descriptions
- Default story exists: Shows typical usage
- Edge cases covered: Loading, error, disabled, empty states
- Actions defined: For onClick, onChange, etc.
- Decorators added: If component needs context/providers
- Play function: For complex interactions (optional)

---

## Quality Standards

✅ **Good Story**: Has args, multiple variants, proper controls, descriptions.

❌ **Bad Story**: No args, no context, edge cases not covered.

---

## Commands

```bash
# Run Storybook
npm run storybook

# Build Storybook
npm run build-storybook

# Test Stories
npm run test-storybook
```

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

---

## References

- **Existing Stories**: See `src/components/Button.stories.tsx`, `LoginForm.stories.tsx`
- **Storybook Docs**: https://storybook.js.org/docs/react/writing-stories/introduction
- **Testing**: https://storybook.js.org/docs/react/writing-tests/interaction-testing

---

# CODE EXAMPLES

## 1. Basic Story Structure

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

## 2. Story Variants

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

## 3. Interactive Args & Controls

```typescript
argTypes: {
  children: {
    control: 'text',
    description: 'Button label text',
  },
  
  disabled: {
    control: 'boolean',
    description: 'Disable the button',
  },
  
  variant: {
    control: 'select',
    options: ['primary', 'secondary', 'outline'],
    description: 'Button visual style',
  },
  
  backgroundColor: {
    control: 'color',
  },
}
```

## 4. Actions for Event Handlers

```typescript
import { fn } from '@storybook/test';

export const WithActions: Story = {
  args: {
    onClick: fn(),
    onMouseEnter: fn(),
  },
};
```

## 5. Play Functions (Interaction Testing)

```typescript
import { expect, userEvent, within } from '@storybook/test';

export const TestInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    
    await expect(button).toBeInTheDocument();
    
    await userEvent.click(button);
    
    await expect(button).toHaveTextContent('Clicked');
  },
};
```

## 6. Decorators for Context

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

## 7. Good Story Examples

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

## 8. Bad Story Example (to avoid)

```typescript
// DON'T DO THIS
export const Default: Story = {}; // No args, no context
```
