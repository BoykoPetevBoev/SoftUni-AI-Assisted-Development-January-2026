# AI for Developers – January 2026
# Individual Project Assignment

## Overview
You will create a Google Drive Document describing a small software project that you built using GitHub Copilot, Claude Code, Augment Code, Cursor, or a combination of these tools.

## Choose Your Own Project Topic
Select any small software system (script, automation, API, mini-app, CLI tool, etc.).
Describe the idea and the system requirements in up to 1 page.

### Project Topic:

The Budget Tracker Application is a small web-based software system designed to help users manage and understand their personal finances. The application allows authenticated users to track income and expense transactions within a single main budget, organized by customizable categories such as Food, Transportation, Housing, or any user-defined category.

The core idea of the system is to provide a clear and structured way to record financial activity, calculate the current budget balance, and present transaction history in an understandable format. Rather than focusing on advanced financial analytics, the project emphasizes correct business logic, modular system design, and reliable data handling, making it suitable for exploring AI-assisted software development practices.

The application is implemented as a React frontend combined with a Django backend, using Django’s built-in database for persistence. The system includes authentication so that each user can securely manage their own budget and transactions.

In addition to its functional goals, this project serves as an experimental platform to evaluate how modern AI development tools (such as GitHub Copilot and others) can assist in designing system architecture, implementing modules, writing tests, and improving developer productivity while maintaining code quality.

### Technology Stack

The application is implemented as a full-stack web system using a modern frontend and backend technology stack.

**Frontend**
- React with TypeScript for building the user interface
- Vite as the build and development tool
- React Query for server-state management and data fetching
- React Hook Form for form handling
- Zod for schema-based validation
- Vitest for frontend unit and component testing
- Storybook for isolated UI component development
- SCSS for styling

**Backend**
- Python as the backend programming language
- Django as the core web framework
- Django REST Framework for building RESTful APIs
- JWT-based authentication for secure user access
- Pytest for automated backend testing
- Docker for containerization and environment consistency

## System Architecture – Modules
Use AI to break the system down into several technological modules (e.g., authentication, data processing, UI, database layer, automation step, testing layer, etc.).
For each module, you will describe your approach and how AI assisted you. 

### Authentication Module
The Authentication Module ensures that only registered users can access the Budget Tracker application. It handles user registration, login, logout, and session management using JWT tokens. Security and proper separation of concerns are emphasized, with backend logic isolated from the frontend UI.
- Backend: User model, JWT auth API endpoints
- Frontend: Login/register pages, forms, validation
- Database: Users table
- Tests: Backend auth tests (Pytest), frontend auth flow tests (Vitest)

### User Budget Module
The User Budget Module is responsible for maintaining each user’s main budget and calculating current balances. It encapsulates all budget-related business logic, ensuring that transactions update the budget correctly, and presents a clear interface on the frontend.
- Backend: Budget model, CRUD API endpoints
- Frontend: Dashboard / budget display components
- Database: Budget table, foreign key to user
- Tests: Backend calculation tests, frontend display tests

### Transactions Module
The Transactions Module manages all income and expense records for a user’s budget. It validates transaction data, enforces business rules, and links each transaction to the corresponding budget and category. The module ensures data integrity and accurate budget updates.
- Backend: Transaction model, serializers, API endpoints
- Frontend: Transaction form, list, and detail components
- Database: Transaction table linked to budget and categories
- Tests: Backend CRUD tests, frontend component tests

### Category Module
The Category Module allows users to create, manage, and organize transaction categories. Categories help classify transactions for better budgeting insights and are customizable per user.
- Backend: Category model, API endpoints, validation
- Frontend: Category management UI, forms
- Database: Category table linked to user and transactions
- Tests: Backend CRUD tests, frontend form tests

### Testing / Storybook / CI-CD Module
The Testing / Storybook / CI-CD Module ensures system reliability, correctness, and maintainability. It provides automated unit and integration testing for both backend and frontend, and supports continuous integration pipelines for consistent deployment.
- Frontend: Vitest for unit/component tests, Storybook for isolated UI
- Backend: Pytest for API and business logic
- CI/CD: Docker + automated pipelines
- AI Assistance: Generated initial test cases, suggested coverage improvements, created basic CI/CD configs

## Development Process per Module
For every module, include:
- Approach & reasoning – how you planned the solution
- Step-by-step workflow – what you asked the tool to generate or modify
- Testing strategy – how you validated correctness
- AI tool choice – which tool you used (Copilot, Claude Code, Augment, Cursor, etc.) and why
- Key prompts or interactions (2–3 examples are enough)

Keep the description for each module up to half a page.

### User Budget Module
Approach & reasoning
The User Budget Module was built as the core financial container for every user, so I focused on clean multi-budget support, strict user scoping, and a clear contract between backend and frontend. I aligned the backend model and validation rules with the frontend Zod schemas to keep data integrity consistent across the stack.

Step-by-step workflow
Plan created to introduce a dedicated `budgets` app (model, serializer, viewset, URLs) with CRUD endpoints and user ownership enforcement. Backend work followed the plan in [docs/05-Create-User-Budget-Model-View-Serializer-Endpoints.md](docs/05-Create-User-Budget-Model-View-Serializer-Endpoints.md). Frontend work followed the plan in [docs/06-Implement-User-Budget-Frontend-Service-Query-Mutation-Hooks-Components.md](docs/06-Implement-User-Budget-Frontend-Service-Query-Mutation-Hooks-Components.md): service layer, React Query hooks, modal-based form, budget list/dashboard, and route wiring. After implementation, I ran QA checks and adjusted error handling and cache invalidation where needed.

Testing strategy
Backend: Pytest coverage for CRUD, validation, and user isolation (multi-budget per user). Frontend: Vitest component and hook tests for list/detail/forms, plus Storybook stories for visual validation. Manual checks included multi-budget creation, edit, delete, and access control verification.

AI tool choice
Primary tool: GitHub Copilot in VS Code for scaffolding and refactoring; plan agent for architecture and endpoint flow. Copilot was chosen for tight IDE integration and fast iteration on boilerplate-heavy work.

Key prompts or interactions
- Backend plan and results: [docs/05-Create-User-Budget-Model-View-Serializer-Endpoints.md](docs/05-Create-User-Budget-Model-View-Serializer-Endpoints.md)
- Frontend plan and results: [docs/06-Implement-User-Budget-Frontend-Service-Query-Mutation-Hooks-Components.md](docs/06-Implement-User-Budget-Frontend-Service-Query-Mutation-Hooks-Components.md)

### Transactions Module
Approach & reasoning
The Transactions Module needed accurate budget impact, so I designed the backend to compute budget balance dynamically from related transactions. I also deferred full category management to keep scope small, using a required category string on each transaction while ensuring validation and ownership checks remained strict.

Step-by-step workflow
Backend plan in [docs/07-Implement-Transactions-Module-Backend-Model-API-Serializers.md](docs/07-Implement-Transactions-Module-Backend-Model-API-Serializers.md): new `transactions` app, serializer validation, viewset with user scoping, and budget balance computation in the budget serializer. Frontend plan in [docs/08-Implement-Transactions-Module-Frontend-Components-Forms-Integration.md](docs/08-Implement-Transactions-Module-Frontend-Components-Forms-Integration.md): types, service layer, React Query hooks, modal form, list/detail UI, and budget details page with real-time balance updates.

Testing strategy
Backend: Pytest CRUD tests, validation failures, ownership isolation, and balance correctness. Frontend: Vitest tests for form, list/detail components, hooks, and BudgetDetails integration; Storybook stories for the UI. Manual testing confirmed add/edit/delete flows and live balance updates.

AI tool choice
Primary tool: GitHub Copilot for rapid scaffolding and consistent patterns across service/hooks/components; plan agent to organize backend vs frontend responsibilities and prevent scope drift.

Key prompts or interactions
- Backend plan and results: [docs/07-Implement-Transactions-Module-Backend-Model-API-Serializers.md](docs/07-Implement-Transactions-Module-Backend-Model-API-Serializers.md)
- Frontend plan and results: [docs/08-Implement-Transactions-Module-Frontend-Components-Forms-Integration.md](docs/08-Implement-Transactions-Module-Frontend-Components-Forms-Integration.md)

### Category Module
Approach & reasoning
Category management was intentionally deferred to keep early iterations focused on budgets and transactions. I used a temporary category string on transactions to unblock end-to-end flows while planning a dedicated category model with user ownership, CRUD APIs, and UI management screens.

Step-by-step workflow
Backlog item created for a future iteration to implement a `categories` app on the backend, a category service and hooks on the frontend, and UI for create/edit/delete. The module is scoped to include user-owned categories, unique naming per user, and safe deletion handling for transactions that reference categories.

Testing strategy
Planned tests include backend CRUD/permission coverage, validation for unique names, and frontend form/component tests for category management flows. Manual testing will focus on category creation, assignment to transactions, and deletion constraints.

AI tool choice
Planned tool: GitHub Copilot for scaffolding the model, serializer, viewset, and React components once implementation starts, due to its strong IDE integration and consistent code generation.

Key prompts or interactions
- Draft prompt (planned): "Design Category CRUD (model, serializer, viewset) with user ownership and unique names per user."
- Draft prompt (planned): "Build Category management UI with React Hook Form + Zod and integrate with transactions form." 

## Challenges & Tool Comparison
A section where you explain:
- The biggest challenges you encountered
- Which tool helped you the most and why
- What you would improve if you continued working on the project

## Working System Evidence
Include at least two screenshots of the functioning system.
This can be the terminal, UI, logs, Postman result, or anything that proves the implementation works.

## Repository
Provide a link to your GitHub repository containing the source code.

## Submission Format
Link to Google Drive Document (make sure it is shared – anyone with the link can view)
Total size: typically 3-6 pages

