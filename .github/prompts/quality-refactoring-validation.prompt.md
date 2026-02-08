# Quality, Refactoring, and Validation Prompt

## Objective
Refactor the project and apply best practices while ensuring the application remains fully functional.

---

## Step 1 – Execute Validation Commands

Run all relevant commands to understand the current state of the project:

- Lint frontend and backend
- Run all frontend tests
- Run all backend tests
- Build frontend
- Build backend
- Build and run Storybook
- Run the application (frontend + backend)

Capture failures and warnings.

---

## Step 2 – Refactor and Auto-Fix

Refactor the codebase to apply best practices and established standards:

- Fix linting and formatting issues
- Improve naming (files, variables, functions)
- Simplify logic where possible
- Remove duplication and dead code
- Improve folder structure and separation of concerns
- Apply framework-specific best practices
- Improve readability and maintainability

Refactoring is expected and allowed.

---

## Step 3 – Standards Enforcement

Ensure the project follows:
- Consistent folder structure
- Clear separation of concerns
- Consistent naming conventions
- Idiomatic usage of frameworks and libraries
- Clean, readable, maintainable code

---

## Step 4 – Final Verification

After refactoring, re-run:

- Linting (must pass)
- All tests (must pass)
- All builds (must succeed)
- Storybook build and run
- Application startup

---

## Reporting
- List executed commands
- List modified files
- Summarize refactoring and improvements
- Confirm the project builds, tests pass, and runs successfully
