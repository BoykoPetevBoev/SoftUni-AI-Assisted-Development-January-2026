# Prompt: Sync Project README from Official Requirements

## Context
This repository has **two README files**:

1. **Main README** (root level): `README.md`  
   - Contains the **official project requirements** for the AI for Developers course
   - Describes the Budget Tracker application assignment
   - Includes project topic, technology stack, modules, and deliverables
   - **MUST NEVER BE CHANGED** - this is the official assignment document

2. **Project README**: `Exam-Budget-Tracker-App/README.md`  
   - Developer-facing documentation for the Budget Tracker application
   - Explains how to set up, run, and develop the system
   - Should align with the official requirements but focus on practical usage

## Task
Read the official requirements from the **main README**, then update the **project README** 
to accurately reflect the current implementation while staying aligned with course requirements.

## Step-by-Step Instructions

### Phase 1: Read Official Requirements (DO NOT MODIFY)

1. Read `README.md` at the root level (full file)
2. Extract key information:
   - **Project Topic**: What the Budget Tracker application does
   - **Technology Stack**: Frontend and backend technologies
   - **System Architecture**: Modules (Authentication, Budget, Transactions, Categories, Testing)
   - **Development Process**: Approach, workflow, testing strategy
   - **Deliverables**: What needs to be documented

**CRITICAL**: Do NOT make any changes to the main README.md. This is the official assignment document.

### Phase 2: Analyze Current Implementation

1. Check `Exam-Budget-Tracker-App/` folder structure:
   - `client/` - React frontend with Vite, TypeScript, SCSS
   - `server/` - Django backend with DRF, JWT auth
2. Identify implemented features:
   - Which modules are complete (Auth, Budgets, Transactions, Categories)
   - What endpoints exist in the Django API
   - What components exist in the React frontend
   - What tests are written (Pytest, Vitest)
3. Note any deviations from official requirements

### Phase 3: Update Project README

Write a comprehensive `Exam-Budget-Tracker-App/README.md` that includes:

#### Section 1: Project Overview
- Brief description of the Budget Tracker application (from official requirements)
- Link to main README for full assignment details
- Current implementation status

#### Section 2: Technology Stack
List the technologies used (match official requirements):
- **Frontend**: React 18, TypeScript, Vite, React Query, React Hook Form, Zod, SCSS, Vitest, Storybook
- **Backend**: Django 4.2, Django REST Framework, JWT auth, Pytest
- **Database**: PostgreSQL (via Docker)
- **Containerization**: Docker + docker-compose

#### Section 3: Project Structure
```
Exam-Budget-Tracker-App/
├── client/           # React frontend application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page-level components
│   │   ├── services/    # API integration layer
│   │   ├── hooks/       # Custom React hooks
│   │   ├── types/       # TypeScript type definitions
│   │   └── utils/       # Utility functions
│   └── ...
├── server/           # Django backend API
│   ├── api/          # Main Django project settings
│   ├── users/        # Authentication module
│   ├── budgets/      # Budget management (if exists)
│   ├── transactions/ # Transaction CRUD (if exists)
│   ├── categories/   # Category management (if exists)
│   └── ...
```

#### Section 4: Setup and Installation

**Prerequisites**:
- Node.js 18+ and npm
- Python 3.11+
- Docker and Docker Compose (optional, recommended)

**Backend Setup**:
```bash
cd Exam-Budget-Tracker-App/server
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

**Frontend Setup**:
```bash
cd Exam-Budget-Tracker-App/client
npm install
npm run dev
```

**Docker Setup** (if docker-compose.yml exists):
```bash
cd Exam-Budget-Tracker-App
docker-compose up --build
```

#### Section 5: Module Implementation Status

Document each module from the official requirements:

| Module | Status | Description |
|--------|--------|-------------|
| Authentication | ✅ Complete | JWT-based auth with register, login, logout, refresh |
| User Budget | 🚧 In Progress | Budget model and API endpoints |
| Transactions | 🚧 In Progress | Income/expense tracking with categories |
| Categories | 🚧 In Progress | User-defined transaction categories |
| Testing | ✅ Complete | Pytest (backend), Vitest (frontend), Storybook |

#### Section 6: API Documentation

Link to detailed API documentation:
- **Server README**: See `server/README.md` for full API endpoint documentation
- **Base URL**: `http://localhost:8000/api/`
- **Authentication**: JWT Bearer tokens required for protected endpoints

#### Section 7: Development Workflow

Explain the development process:
1. **Plan**: Review official requirements and break down tasks
2. **Implement**: Use Frontend/Backend agents with skill patterns
3. **Validate**: Run QA agent for testing and quality checks
4. **Document**: Update README and API docs as features are added

#### Section 8: Testing

**Backend Tests** (Pytest):
```bash
cd server
pytest
```

**Frontend Tests** (Vitest):
```bash
cd client
npm run test
```

**Component Development** (Storybook):
```bash
cd client
npm run storybook
```

#### Section 9: Environment Variables

List required environment variables:
- **Backend**: `SECRET_KEY`, `DEBUG`, `DATABASE_URL`, `ALLOWED_HOSTS`
- **Frontend**: `VITE_API_BASE_URL`

#### Section 10: Contributing

- Follow patterns defined in `.github/skills/`
- Run QA validation before committing (`@qa` or use `qa-validation.prompt.md`)
- Keep API documentation up to date in `server/README.md`

#### Section 11: License and Academic Integrity

- This is a course assignment for AI for Developers – January 2026
- See main `README.md` for full assignment requirements

### Phase 4: Quality Checks

- [ ] All sections from official requirements reflected in project README
- [ ] Technology stack matches exactly
- [ ] Module status accurately documented
- [ ] Setup instructions are clear and tested
- [ ] Project structure diagram matches actual folders
- [ ] No contradictions with official requirements
- [ ] Links to main README and server README included

## Formatting Rules
- Use Markdown with clear section headers
- Use tables for module status
- Use code blocks for commands
- Use badges/emojis for status (✅ Complete, 🚧 In Progress, ❌ Not Started)
- Keep it developer-friendly and actionable

## What to Preserve
- ✅ All information from official requirements (main README)
- ✅ Technology stack alignment
- ✅ Module structure from assignment
- ✅ Academic integrity notes

## What to Add
- ✅ Practical setup instructions
- ✅ Current implementation status
- ✅ Project folder structure
- ✅ Development workflow
- ✅ Testing commands
- ✅ Environment variable requirements

## Output
Return the **complete content** for `Exam-Budget-Tracker-App/README.md`.

**CRITICAL REMINDER**: 
- Do NOT modify the main `README.md` at root level
- Only update `Exam-Budget-Tracker-App/README.md`
- Ensure alignment with official requirements but focus on practical developer usage
