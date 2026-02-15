# Budget Tracker - Frontend

A modern, production-ready React application for managing personal budgets and transactions. Built with React 18, TypeScript, Vite, React Query, and React Hook Form.

## 📋 Features

- **User Authentication**: JWT-based login and registration with token refresh
- **Budget Management**: Create, read, update, and delete multiple budgets per user
- **Responsive Design**: Mobile-first design that works on all screen sizes
- **Form Validation**: Client-side validation using Zod schemas that mirror backend validation
- **State Management**: React Query for data fetching and caching
- **Error Handling**: Comprehensive error handling with toast notifications
- **Component Isolation**: Storybook for component documentation and development

## 🏗️ Project Structure

```
src/
├── api/                  # HTTP client configuration
│   └── requester.ts     # Base HTTP client with JWT handling
├── components/          # Reusable UI components
│   ├── BudgetCard/
│   ├── BudgetForm/
│   ├── BudgetList/
│   ├── Button/
│   ├── LoginForm/
│   ├── RegisterForm/
│   ├── Toast/
│   └── ProtectedRoute/
├── context/            # Global state management
│   ├── AuthContext.tsx
│   └── ToastContext.tsx
├── hooks/              # Custom React hooks
│   ├── useAuth.ts
│   ├── useBudgets.ts
│   ├── useBudget.ts
│   ├── useCreateBudget.ts
│   ├── useUpdateBudget.ts
│   ├── useDeleteBudget.ts
│   ├── budgetKeys.ts
│   ├── useToast.ts
│   └── useAuthMutations.ts
├── pages/              # Page components
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   └── BudgetDashboard.tsx
├── services/           # API service layer
│   ├── auth.service.ts
│   └── budget.service.ts
├── types/              # TypeScript type definitions
│   ├── auth.ts
│   └── budget.ts
├── styles/             # Global styles and design system
└── utils/              # Utility functions
    ├── tokenStorage.ts
    └── formErrorHandler.ts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
cd client
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

Start Storybook for component development:

```bash
npm run storybook
```

### Building

Create a production build:

```bash
npm run build
```

### Testing

Run unit tests with Vitest:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

### Linting

Check code quality:

```bash
npm run lint
```

Type checking:

```bash
npm run type-check
```

## 📊 Budget Module

The Budget Module provides comprehensive budget management functionality.

### Components

- **BudgetDashboard**: Main page for budget management (`src/pages/BudgetDashboard.tsx`)
- **BudgetList**: Displays all user's budgets with edit/delete actions (`src/components/BudgetList.tsx`)
- **BudgetCard**: Individual budget card component (`src/components/BudgetCard.tsx`)
- **BudgetForm**: Modal form for creating/editing budgets (`src/components/BudgetForm/BudgetForm.tsx`)

### React Query Hooks

#### Queries
- **useBudgets()**: Fetch all user's budgets (paginated)
- **useBudget(id)**: Fetch a single budget by ID

#### Mutations
- **useCreateBudget()**: Create a new budget
- **useUpdateBudget(id)**: Update an existing budget
- **useDeleteBudget()**: Delete a budget

### Service Layer

API endpoints are managed through `src/services/budget.service.ts`:

```typescript
budgetService.getBudgets()           // GET /api/budgets/
budgetService.getBudgetById(id)      // GET /api/budgets/{id}/
budgetService.createBudget(payload)  // POST /api/budgets/
budgetService.updateBudget(id, payload)     // PUT /api/budgets/{id}/
budgetService.partialUpdateBudget(id, payload)  // PATCH /api/budgets/{id}/
budgetService.deleteBudget(id)       // DELETE /api/budgets/{id}/
```

### Type Definitions

Budget-related types are defined in `src/types/budget.ts`:

```typescript
interface Budget {
  id: number;
  user: number;
  title: string;
  description: string;
  date: string;           // YYYY-MM-DD format
  initial_amount: string; // Decimal as string
  created_at: string;     // ISO 8601 timestamp
  updated_at: string;     // ISO 8601 timestamp
}

interface CreateBudgetPayload {
  title: string;
  description: string;
  date: string;
  initial_amount: string | number;
}
```

### Validation

Form validation uses Zod schemas that mirror backend validation:

```typescript
const budgetFormSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(5000).optional(),
  date: z.string().refine((date) => !isNaN(new Date(date).getTime())),
  initial_amount: z.number().positive().max(999999999.99),
});
```

### Usage Example

```typescript
import { useBudgets, useCreateBudget } from './hooks';
import { BudgetDashboard } from './pages';

function App() {
  return <BudgetDashboard />;
}
```

## 🔐 Authentication

- JWT tokens stored in sessionStorage
- Auto-refresh of access tokens on 401 responses
- Protected routes require authentication
- Logout clears tokens and React Query cache

## 🎨 Styling

- SCSS with modular component styles
- Design system variables in `src/styles/variables.scss`
- Responsive design with mobile-first approach
- BEM naming convention for CSS classes

## 🧪 Testing

Tests use Vitest and React Testing Library:

- Unit tests for components, hooks, and services
- Component tests use accessible queries (getByRole, getByLabelText)
- Tests mock React Query providers and API calls
- Target >80% code coverage

## 📖 API Reference

See [server/README.md](../server/README.md) for complete API documentation.

## ✨ Key Features

- **Multi-budget Support**: Users can create and manage multiple budgets
- **Modal Forms**: Create/Edit forms use modal overlays for non-navigational UX
- **Error Handling**: Clear error messages with retry options
- **Loading States**: Spinners and disabled buttons during async operations
- **Optimistic Updates**: React Query cache invalidation on mutations
- **Responsive**: Works seamlessly on mobile, tablet, and desktop

## 🛠️ Tech Stack

- **React**: 18.3.1 - UI library
- **TypeScript**: 5.6.2 - Type safety
- **Vite**: 5.4.2 - Fast build tool
- **React Query**: 5.56.2 - Data fetching and caching
- **React Hook Form**: 7.53.0 - Form state management
- **Zod**: 3.23.8 - Schema validation
- **SCSS**: Styling with variables and mixins
- **Vitest**: 2.1.1 - Unit testing
- **React Testing Library**: 16.0.1 - Component testing
- **Storybook**: 8.3.0 - Component documentation

## 📝 React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

