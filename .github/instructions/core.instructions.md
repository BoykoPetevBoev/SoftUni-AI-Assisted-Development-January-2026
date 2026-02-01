---
applyTo: "Exam-Budget-Tracker-App/**"
---

# Core Project Instructions – Budget Tracker

These instructions apply to generated code in Exam-Budget-Tracker-App project.

---

## 1. Project Overview
The Budget Tracker is a web application that allows authenticated users to manage a single personal budget.
Users can create income and expense transactions and organize them using custom categories.

---

## 2. Technology Stack

### Frontend
- React
- TypeScript
- Vite
- React Query
- React Hook Form
- Zod
- SCSS
- Vitest
- Storybook

### Backend
- Python
- Django
- Django REST Framework
- JWT-based authentication
- Built-in Django database
- Pytest
- Docker

---

## 3. Core Business Logic

- Each user has exactly one main budget
- Transactions belong to a budget
- Transactions have:
  - amount
    - positive number = income
    - negative number = expense
  - category
  - date
- Categories are user-defined and owned by the user
- Each transaction must belong to one category
- Users can create, read, update, and delete their transactions and categories
- Budget balance is calculated from all related transactions
- Users can only access their own data
- All protected routes require valid JWT authentication

---

## 4. General Rules

- Prefer clarity and correctness over cleverness
- Follow existing project structure and naming conventions
- Use validation on both frontend and backend
- Handle errors explicitly
- Do not generate code that violates business rules
- Write clean and maintainable code
- Avoid inline comments unless the logic is non-obvious
- Ensure proper separation of concerns (e.g., UI logic vs business logic)
