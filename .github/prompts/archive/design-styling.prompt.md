# UI Design, Styling, and SCSS Refactor Prompt

**Status**: ⚠️ ARCHIVED - Superseded by Design Agent (`.github/agents/design.agent.md`)

**Reason**: This prompt has been replaced by a comprehensive Design Agent that handles:
- UI design and SCSS refactoring with luxury theme enforcement
- Component styling with design system patterns
- WCAG AA accessibility requirements
- Responsive design validation
- Glassmorphism and modern CSS techniques

**Migration**: Use `@design` to call the Design Agent instead of this prompt.

---

## Original Prompt (Archived for Reference)

### Objective
Improve the UI design and styling of the application using SCSS while keeping functionality unchanged.

---

### Step 1 – Analyze Current UI
- Review existing components and layouts
- Identify missing, inconsistent, or poorly structured styles
- Identify elements without semantic or reusable CSS classes

---

### Step 2 – SCSS Refactoring and Styling

Refactor and improve styles by:

- Creating clear, reusable SCSS class names
- Applying consistent spacing, typography, and colors
- Improving layout using Flexbox/Grid where appropriate
- Organizing SCSS files logically (base, layout, components, pages)
- Removing inline styles and anti-patterns
- Ensuring styles are responsive and visually balanced

Attach appropriate CSS/SCSS classes to JSX/HTML elements as needed.

---

### Step 3 – Design Standards Enforcement

Ensure:
- Consistent naming conventions for classes
- Separation of structure and styling
- No inline or hardcoded styles
- SCSS variables used for colors, spacing, fonts
- Components are visually consistent across pages

---

### Step 4 – Verification

- Application runs successfully after styling changes
- No layout-breaking issues
- No visual regressions that affect usability
- Storybook (if present) renders components correctly

---

### Reporting
- List modified SCSS/CSS files
- List updated components with new or changed class names
- Summarize design and styling improvements
