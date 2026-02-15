# Prompt

```
/plan 
Implement the frontend for the User Budget Module, including service layer, React Query hooks (queries and mutations), and UI components for displaying and managing the user's budget.

Requirements:

Service layer for API communication with backend budget endpoints
React Query hooks for fetching budget data (useQuery)
React Query mutation hooks for create/update operations (useMutation)
Budget display components (Dashboard / budget view)
Form components for budget management
Proper error handling and loading states
TypeScript type definitions
Integration with existing authentication context
Use modal window for the form
Support all CRUD operations

Reference backend :
05-Create-User-Budget-Model-View-Serializer-Endpoints.md
server/README.md
```
---

## Plan: Frontend Budget Module Implementation

**TL;DR**: Build a multi-budget management frontend using existing patterns (service layer → React Query hooks → components). Create [budget.service.ts](src/services/budget.service.ts) with CRUD methods. Build custom hooks (`useBudgets()`, `useCreateBudget()`, etc.) for data fetching & mutations. Create BudgetForm component in a modal for create/edit, BudgetList showing user's budgets with action buttons, and BudgetDashboard for summary view. Integrate with `useAuth()` context, add Zod validation mirroring backend, handle errors with toast notifications, and test all components with Vitest + Storybook stories.

---

**Steps**

1. **Create Budget Type Definitions** in [src/types/budget.ts](src/types/budget.ts)
   - `Budget` interface: `id`, `user`, `title`, `description`, `date`, `initial_amount`, `created_at`, `updated_at`
   - `CreateBudgetPayload`: request type (excluding `id`, `user`, `created_at`, `updated_at`)
   - `BudgetListResponse`: paginated response type with `count`, `next`, `previous`, `results` array
   - `BudgetFormValues`: form-specific type with `title`, `description`, `date`, `initial_amount` (matches Zod schema)

2. **Create Budget Service Layer** in [src/services/budget.service.ts](src/services/budget.service.ts)
   - Define constants: `BUDGET_API_URL = '/api/budgets'`
   - Export async functions:
     - `getBudgets()`: GET /api/budgets/, returns paginated list of user's budgets
     - `getBudgetById(id)`: GET /api/budgets/{id}/, returns single budget
     - `createBudget(payload)`: POST /api/budgets/, returns created budget
     - `updateBudget(id, payload)`: PUT /api/budgets/{id}/, returns updated budget
     - `partialUpdateBudget(id, payload)`: PATCH /api/budgets/{id}/, returns updated budget
     - `deleteBudget(id)`: DELETE /api/budgets/{id}/, returns 204 No Content
   - All methods use `requester<T>()` for type-safe requests, inherit auth from existing requester setup
   - Handle errors by letting `requester` propagate `ApiError`

3. **Create Budget Query Keys** in [src/hooks/budgetKeys.ts](src/hooks/budgetKeys.ts)
   - Define constants following pattern from codebase:
     - `budgetKeys.all = ['budgets']`
     - `budgetKeys.list = () => [...budgetKeys.all, 'list']`
     - `budgetKeys.detail = (id) => [...budgetKeys.all, 'detail', id]`
   - Use these in all query/mutation implementations for cache consistency

4. **Create React Query Hooks** in [src/hooks/](src/hooks/) (one file per hook):
   - **useBudgets.ts**: Query hook for list
     - Uses `useQuery({ queryKey: budgetKeys.list(), queryFn: getBudgets, enabled: !!user })` 
     - Conditional fetch only when authenticated
     - Return `{ data, isLoading, error, refetch }`
   
   - **useBudget.ts**: Query hook for single budget
     - Uses `useQuery({ queryKey: budgetKeys.detail(id), queryFn: () => getBudgetById(id), enabled: !!id })`
     - Conditional fetch only when `id` exists
     - Return `{ data, isLoading, error }`
   
   - **useCreateBudget.ts**: Mutation hook for POST
     - Uses `useMutation({ mutationFn: createBudget })`
     - `onSuccess`: call `queryClient.invalidateQueries({ queryKey: budgetKeys.list() })`
     - `onError`: extract error from `ApiError` and show toast
     - Return `{ mutate, isPending, error }`
   
   - **useUpdateBudget.ts**: Mutation hook for PUT/PATCH
     - Uses `useMutation({ mutationFn: ({ id, payload }) => updateBudget(id, payload) })`
     - `onSuccess`: invalidate both list and detail queries for that budget
     - `onError`: show toast with error message
     - Return `{ mutate, isPending, error }`
   
   - **useDeleteBudget.ts**: Mutation hook for DELETE
     - Uses `useMutation({ mutationFn: deleteBudget })`
     - `onSuccess`: invalidate list query
     - `onError`: show toast
     - Return `{ mutate, isPending, error }`

5. **Create Budget Types & Validation** in [src/types/budget.ts](src/types/budget.ts) (extend from step 1)
   - Add Zod schemas under `/schemas` namespaced export:
     - `budgetFormSchema`: validation for title (required, 1-255 chars), description (optional), date (required, valid date), initial_amount (required, > 0, decimal format)
     - Match backend serializer validation exactly
     - Use with React Hook Form via `zodResolver()`

6. **Create BudgetForm Component** in [src/components/BudgetForm/](src/components/BudgetForm/)
   - **BudgetForm.tsx**: Main form component
     - Accept props: `isOpen: boolean`, `onClose: () => void`, `budgetId?: number` (for edit mode)
     - Use `useForm()` with `zodResolver(budgetFormSchema)`
     - Use conditional hook: `useBudget(budgetId)` to fetch for edit, populate form
     - Use `useCreateBudget()` or `useUpdateBudget()` for submission
     - Form fields: title (text input), description (textarea), date (date picker), initial_amount (number input)
     - Handle loading states from mutation (`isPending`)
     - On success: show toast "Budget created/updated successfully", close modal
     - On error: display validation errors under fields or show toast
     - Render in Modal subcomponent (use existing Modal pattern or create simple overlay div)
   
   - **BudgetForm.test.tsx**: Component tests
     - Renders when `isOpen={true}`, hidden when `false`
     - Form validation works (empty fields show errors)
     - Submit calls correct mutation (create vs update based on budgetId)
     - Close button dismisses modal
   
   - **BudgetForm.stories.tsx**: Storybook stories
     - Story 1: Create mode (no budgetId)
     - Story 2: Edit mode (with budgetId and initial data)

7. **Create BudgetCard Component** in [src/components/BudgetCard.tsx](src/components/BudgetCard.tsx)
   - Pure presentational component showing single budget
   - Props: `budget: Budget`, `onEdit: (id) => void`, `onDelete: (id) => void`
   - Display: title, description (truncated), date, initial_amount
   - Action buttons: Edit (calls `onEdit(budget.id)`), Delete (calls `onDelete(budget.id)`)
   - Add Storybook story with sample data
   - Add Vitest test for rendering

8. **Create BudgetList Component** in [src/components/BudgetList.tsx](src/components/BudgetList.tsx)
   - Use `useBudgets()` hook for data, `isLoading`, `error`
   - Display list of budgets using BudgetCard subcomponent
   - Show loading spinner while fetching
   - Show error message if query fails with retry button
   - Show "No budgets yet" message if empty
   - Support pagination if paginated response from API
   - Add delete confirmation dialog before calling `useDeleteBudget().mutate(id)`
   - Add button to create new budget (opens modal)
   - Add Storybook story: loaded, loading, error, empty states
   - Add Vitest test case for each state

9. **Create BudgetDashboard Component** in [src/pages/BudgetDashboard.tsx](src/pages/BudgetDashboard.tsx)
   - Main page component for budget management
   - Include: BudgetList (displays all user budgets)
   - Include: BudgetForm modal for create/edit
   - State: `isFormOpen: boolean`, `selectedBudgetId: null | number`
   - Handlers:
     - `handleOpenForm(id?)`: set `isFormOpen=true`, `selectedBudgetId=id` (for edit mode)
     - `handleCloseForm`: set `isFormOpen=false`, reset `selectedBudgetId`
     - `handleCreateClick`: call `handleOpenForm()`
     - Form component calls `handleCloseForm` on success
   - Add to [src/App.tsx](src/App.tsx) routing: `<Route path="/budgets" element={<ProtectedRoute><BudgetDashboard /></ProtectedRoute>} />`
   - Add navigation link in main app nav bar

10. **Add Authentication Integration**
    - Import `useAuth()` hook in BudgetDashboard
    - Use `isAuthenticated` to conditionally render page (or rely on ProtectedRoute)
    - Pass `user` context to service layer via `requester` (already authenticated)
    - Verify user isolation: queried budgets only belong to logged-in user (backend enforces)

11. **Add Error Handling & Toast Notifications**
    - Import `useToast()` hook in BudgetForm, mutation hooks
    - On mutation error: `showToast('Failed to [action] budget', 'error')`
    - On mutation success: `showToast('Budget [action]ed successfully', 'success')`
    - Extract API error messages: `error?.response?.data?.detail || 'Unknown error'`
    - Handle validation errors: display per-field errors in form under input

12. **Write Comprehensive Tests**
    - **budgetService.test.ts**: Mock `requester`, test each service function returns correct types
    - **useBudgets.test.ts**: Mock service, test query behavior, enabled condition, caching
    - **useCreateBudget.test.ts**: Test mutation, invalidation, error handling
    - **BudgetCard.test.ts**: Test rendering, button clicks, props
    - **BudgetList.test.ts**: Test loading/error/empty states, pagination, delete flow
    - **BudgetForm.test.ts**: Test form validation, submission, edit vs create mode
    - **BudgetDashboard.test.tsx**: Integration test: open form, submit, verify mutation called
    - Use Vitest, React Testing Library, mock React Query with `@testing-library/react`

13. **Create Storybook Stories**
    - BudgetForm.stories.tsx: Create mode, Edit mode
    - BudgetCard.stories.tsx: Sample budget
    - BudgetList.stories.tsx: Loaded, Loading, Error, Empty states
    - BudgetDashboard.stories.tsx: Full page story

14. **Update App Navigation**
    - Add "Budgets" link to main navigation (nav bar or sidebar)
    - Link to `/budgets` route
    - Visible only to authenticated users (wrap in conditional or rely on ProtectedRoute)

15. **Update Documentation** in [client/README.md](client/README.md)
    - Add section: "Budget Module"
    - Describe feature: "Users can create and manage multiple budgets"
    - List pages/components: BudgetDashboard, BudgetForm, BudgetList, BudgetCard
    - List hooks: use Budgets, useBudget, useCreateBudget, useUpdateBudget, useDeleteBudget
    - Document API service methods and query keys
    - Include example: creating, updating, deleting a budget

---

**Verification**

- **Service layer**: Call `getBudgets()`, returns array of budgets with correct types
- **React Query hooks**: 
  - `useBudgets()` fetches on mount when authenticated
  - Create mutation invalidates list query on success
  - Update mutation invalidates both list and detail queries
  - Delete mutation invalidates list query
- **BudgetForm**: 
  - Validation works (empty title shows error)
  - Create mode submits POST, edit mode submits PUT
  - Modal opens/closes correctly
  - Form resets after successful submit
- **BudgetList**: 
  - Displays all user's budgets (not other users')
  - Delete button opens confirmation, calls mutation
  - Edit button opens form with pre-filled data
  - "No budgets" message shown when empty
- **BudgetDashboard**: 
  - Accessible at `/budgets` route
  - Only visible to authenticated users
  - Create button opens form
  - Budgets listed with edit/delete actions
- **Tests**: All Vitest tests pass (`npm run test`)
- **Storybook**: All stories render without errors (`npm run storybook`)
- **Integration**: 
  - Log in → navigate to /budgets → see user's budgets
  - Create budget → appears in list immediately
  - Edit budget → form pre-fills, submit updates
  - Delete budget → removed from list after confirmation
  - User A cannot see/edit User B's budgets (backend enforces)
  - Logout → auth is cleared, next login shows only that user's budgets

---

**Decisions**

- **Multiple budgets**: Follow backend implementation (users can create many budgets)
- **Modal form**: Create/Edit forms use modal overlay (non-navigational)
- **Query keys**: Centralized in `budgetKeys.ts` for consistent cache invalidation
- **Service layer**: Async functions returning typed responses, errors propagate from `requester`
- **Validation**: Zod schemas match backend serializer exactly (frontend mirror)
- **Auth integration**: Use existing `useAuth()` hook and `requester` with auto-added JWT headers
- **Error handling**: Toast notifications for all operations, per-field form errors
- **Testing**: Vitest + React Testing Library (existing setup)
- **Storybook**: Stories for all major components (isolated development)
- **Performance**: Cache with React Query, conditional queries with `enabled` flag
- **User isolation**: Backend returns only user's budgets via `get_queryset()` filter


---

# Result

- Implemented budget types, Zod schema, and service layer for CRUD operations.
- Added React Query hooks for list/detail queries and create/update/delete mutations with cache invalidation and toast feedback.
- Built Budget UI: BudgetCard, BudgetList, BudgetListContainer, BudgetForm modal, and BudgetDashboard page with responsive SCSS.
- Integrated routing and navigation for /budgets and protected access via existing auth flow.
- Added tests (Vitest + RTL) and Storybook stories for new components and hooks; updated README for the budget module.
- QA status: lint and tests pass; coverage >90% statements; build and storybook build succeed with Sass @import deprecation warnings.

Implemented files:
- [Exam-Budget-Tracker-App/client/src/types/budget.ts](Exam-Budget-Tracker-App/client/src/types/budget.ts)
- [Exam-Budget-Tracker-App/client/src/services/budget.service.ts](Exam-Budget-Tracker-App/client/src/services/budget.service.ts)
- [Exam-Budget-Tracker-App/client/src/hooks/budgetKeys.ts](Exam-Budget-Tracker-App/client/src/hooks/budgetKeys.ts)
- [Exam-Budget-Tracker-App/client/src/hooks/useBudgets.ts](Exam-Budget-Tracker-App/client/src/hooks/useBudgets.ts)
- [Exam-Budget-Tracker-App/client/src/hooks/useBudget.ts](Exam-Budget-Tracker-App/client/src/hooks/useBudget.ts)
- [Exam-Budget-Tracker-App/client/src/hooks/useCreateBudget.ts](Exam-Budget-Tracker-App/client/src/hooks/useCreateBudget.ts)
- [Exam-Budget-Tracker-App/client/src/hooks/useUpdateBudget.ts](Exam-Budget-Tracker-App/client/src/hooks/useUpdateBudget.ts)
- [Exam-Budget-Tracker-App/client/src/hooks/useDeleteBudget.ts](Exam-Budget-Tracker-App/client/src/hooks/useDeleteBudget.ts)
- [Exam-Budget-Tracker-App/client/src/hooks/useBudgetCard.ts](Exam-Budget-Tracker-App/client/src/hooks/useBudgetCard.ts)
- [Exam-Budget-Tracker-App/client/src/hooks/useBudgetForm.ts](Exam-Budget-Tracker-App/client/src/hooks/useBudgetForm.ts)
- [Exam-Budget-Tracker-App/client/src/hooks/useBudgetList.ts](Exam-Budget-Tracker-App/client/src/hooks/useBudgetList.ts)
- [Exam-Budget-Tracker-App/client/src/hooks/useBudgetDashboard.ts](Exam-Budget-Tracker-App/client/src/hooks/useBudgetDashboard.ts)
- [Exam-Budget-Tracker-App/client/src/components/BudgetCard.tsx](Exam-Budget-Tracker-App/client/src/components/BudgetCard.tsx)
- [Exam-Budget-Tracker-App/client/src/components/BudgetList.tsx](Exam-Budget-Tracker-App/client/src/components/BudgetList.tsx)
- [Exam-Budget-Tracker-App/client/src/components/BudgetListContainer.tsx](Exam-Budget-Tracker-App/client/src/components/BudgetListContainer.tsx)
- [Exam-Budget-Tracker-App/client/src/components/BudgetForm/BudgetForm.tsx](Exam-Budget-Tracker-App/client/src/components/BudgetForm/BudgetForm.tsx)
- [Exam-Budget-Tracker-App/client/src/pages/BudgetDashboard.tsx](Exam-Budget-Tracker-App/client/src/pages/BudgetDashboard.tsx)