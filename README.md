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

