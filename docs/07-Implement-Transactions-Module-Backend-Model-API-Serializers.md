# Prompt
```
/plan
Develop the Transactions Module for the backend. This module should enable users to manage all income and expense records associated with their budget. Each transaction must reference the user's budget and all business logic and data validation should be included so that budget updates remain accurate and consistent.

Requirements:

Django transaction model with fields for amount, date, and budget reference
Serializer(s) for input validation and output
API endpoints for CRUD operations (List, Create, Retrieve, Update, Delete)
Database integrity (foreign keys, constraints) to guarantee data consistency
Validation of business rules (e.g., only valid categories, proper amount types, date validation, one-to-many relationship from budget to transactions)
All changes must accurately update the user's budget balance
All integration tests should pass
```

# Plan

## Plan: Transactions Backend Module

Implement a new `transactions` app that mirrors the budgets patterns (DRF `ModelViewSet`, serializer validation, pytest integration), add a `Transaction` model tied to `Budget`, and expose CRUD endpoints via router wiring. Budget balance will be computed dynamically in `BudgetSerializer` using related transactions (per your decision), so any transaction create/update/delete is reflected on budget reads without storing a balance column. Categories will be a simple required string field on `Transaction` for now (full categories module is deferred to the next task). The plan includes validation to enforce proper amounts, dates, and budget ownership, plus tests that match the existing budgets test style and ensure balance accuracy.

**Steps**
1. Create a new `transactions` Django app under Exam-Budget-Tracker-App/server/transactions and add a `Transaction` model in [Exam-Budget-Tracker-App/server/transactions/models.py](Exam-Budget-Tracker-App/server/transactions/models.py) with `budget` FK (`related_name='transactions'`), `amount`, `date`, `category`, and timestamps; include DB indexes and ordering aligned with [Exam-Budget-Tracker-App/server/budgets/models.py](Exam-Budget-Tracker-App/server/budgets/models.py).
2. Add `TransactionSerializer` in [Exam-Budget-Tracker-App/server/transactions/serializers.py](Exam-Budget-Tracker-App/server/transactions/serializers.py) with explicit validation: non-empty `category`, `amount` is a valid decimal (positive or negative), and `budget` must belong to the authenticated user (use `self.context['request'].user`); mirror error message patterns from [Exam-Budget-Tracker-App/server/budgets/serializers.py](Exam-Budget-Tracker-App/server/budgets/serializers.py).
3. Implement `TransactionViewSet` in [Exam-Budget-Tracker-App/server/transactions/views.py](Exam-Budget-Tracker-App/server/transactions/views.py) using `ModelViewSet`, `IsAuthenticated`, and `get_queryset()` filtered by `budget__user` to enforce ownership; optionally support a `budget` query param for list filtering.
4. Wire routing in [Exam-Budget-Tracker-App/server/transactions/urls.py](Exam-Budget-Tracker-App/server/transactions/urls.py), include it in [Exam-Budget-Tracker-App/server/api/urls.py](Exam-Budget-Tracker-App/server/api/urls.py), and register the app in [Exam-Budget-Tracker-App/server/api/settings.py](Exam-Budget-Tracker-App/server/api/settings.py).
5. Update [Exam-Budget-Tracker-App/server/budgets/serializers.py](Exam-Budget-Tracker-App/server/budgets/serializers.py) to add a read-only `balance` field computed from `initial_amount` + sum of related `Transaction.amount`; optionally annotate totals in [Exam-Budget-Tracker-App/server/budgets/views.py](Exam-Budget-Tracker-App/server/budgets/views.py) to avoid N+1 queries in list views.
6. Create tests in [Exam-Budget-Tracker-App/server/transactions/tests.py](Exam-Budget-Tracker-App/server/transactions/tests.py) mirroring budgets' style in [Exam-Budget-Tracker-App/server/budgets/tests.py](Exam-Budget-Tracker-App/server/budgets/tests.py): auth required, CRUD, validation, budget ownership isolation, and budget balance correctness after create/update/delete.
7. Add migrations for the new app and ensure consistency with Postgres settings in [Exam-Budget-Tracker-App/server/api/settings.py](Exam-Budget-Tracker-App/server/api/settings.py).

**Verification**
- Run `pytest` in Exam-Budget-Tracker-App/server and ensure all budgets + transactions tests pass.
- Manually verify budget list and retrieve responses include `balance` that changes with transaction CRUD.

**Decisions**
- Categories are deferred to a later task; for now use a required `category` string on `Transaction`.
- Budget balance is computed dynamically in `BudgetSerializer`, not stored on the model.
- Amounts accept both positive and negative decimals to represent income/expense.
# Result

## Summary

Implemented the backend Transactions module with full CRUD APIs, user scoping, validation, and dynamic budget balance calculation. Added tests and verified the full backend test suite.

## Implemented Components

- New `transactions` app with model, serializer, viewset, URLs, migrations, and tests.
- New ownership permission `IsOwner` to enforce object-level access control for budgets and transactions.
- Budget `balance` computed dynamically from initial amount plus related transactions.
- API wiring updated to include transactions routes and app registration.

## Data Model and Integrity

- `Transaction` model fields: budget (FK), amount, category, date, created_at, updated_at.
- One-to-many relationship from Budget to Transactions via `related_name='transactions'`.
- Database indexes on budget and (budget, date) for query performance.
- Database constraint prevents blank category values.

## Validation and Business Rules

- Category is required and trimmed; blank or whitespace-only values are rejected.
- Amount accepts positive and negative decimals for income and expense.
- Amount range validation prevents extremely large values.
- Date is required and must be a valid date.
- Budget ownership is enforced so users cannot reference other users' budgets.
- Budget balance is always consistent with transactions because it is computed at read time.

## API Behavior

- CRUD endpoints for transactions using DRF ModelViewSet.
- List and detail views are scoped to the authenticated user via budget ownership.
- Optional list filtering by `budget` query parameter.

## Tests Added

- Authentication requirements for all transaction endpoints.
- CRUD workflows for transactions.
- Validation errors for missing/invalid fields.
- Ownership isolation across users.
- Budget balance correctness for create, update, and delete flows.

## QA Validation Results

- Command executed: `docker-compose exec backend pytest`.
- Result: 100 tests passed.
- Warnings: 4 `UnorderedObjectListWarning` related to budget list pagination ordering.

## Fixes Applied During QA

- Adjusted budget balance serialization to return a string with two decimal places to match API expectations.

