# Budget Tracker Application

This README documents the Budget Tracker application implementation. It is aligned with the official assignment requirements in the root README. For the full assignment brief, see [../README.md](../README.md).

## Project Overview
The Budget Tracker is a web application that allows authenticated users to manage a single personal budget. Users can create income and expense transactions and organize them using custom categories. The project focuses on correct business logic, modular design, and reliable data handling.

Current implementation status is summarized in the Module Implementation Status section.

## Technology Stack

### Frontend
- React (current version 19.x; requirement targets React 18+)
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
- Django 4.2
- Django REST Framework
- JWT authentication (SimpleJWT)
- Pytest

### Database and Infrastructure
- PostgreSQL (via Docker Compose)
- Docker and docker-compose

## Project Structure
```
Exam-Budget-Tracker-App/
├── client/              # React frontend application
│   ├── src/
│   │   ├── api/          # API requester helpers
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # React context providers
│   │   ├── hooks/        # Custom React hooks
│   │   ├── pages/        # Page-level components
│   │   ├── services/     # API integration layer
│   │   ├── styles/       # Global styles and variables
│   │   ├── types/        # TypeScript type definitions
│   │   └── utils/        # Utility functions
│   └── ...
├── server/              # Django backend API
│   ├── api/              # Django project settings and URLs
│   ├── users/            # Authentication module
│   ├── health_check/     # Health check endpoint
│   └── ...
└── ...
```

## Setup and Installation

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- Docker and Docker Compose (recommended for PostgreSQL)

### Backend Setup (Local)
```bash
cd Exam-Budget-Tracker-App/server
python -m venv venv
```

Activate the virtual environment:
```bash
# Windows PowerShell
venv\Scripts\Activate.ps1

# Windows CMD
venv\Scripts\activate.bat

# macOS/Linux
source venv/bin/activate
```

Install dependencies and configure environment variables:
```bash
pip install -r requirements.txt
copy .env.example .env  # Windows PowerShell
# cp .env.example .env  # macOS/Linux
```

Run migrations and start the server:
```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Backend Setup (Docker)
```bash
cd Exam-Budget-Tracker-App/server
copy .env.example .env  # Windows PowerShell
# cp .env.example .env  # macOS/Linux
docker-compose up --build
```

### Frontend Setup
```bash
cd Exam-Budget-Tracker-App/client
npm install
npm run dev
```

## Module Implementation Status

| Module | Status | Description |
|--------|--------|-------------|
| Authentication | Complete | JWT-based auth with user CRUD via `users` endpoints |
| User Budget | Not Started | Budget model and API endpoints not yet implemented |
| Transactions | Not Started | Transaction CRUD not yet implemented |
| Categories | Not Started | Category management not yet implemented |
| Testing | In Progress | Backend and frontend tests exist; coverage is partial |
| Health Check | Complete | `/up` endpoint for service status |

## API Documentation
- Server API docs: [server/README.md](server/README.md)
- Base API paths:
	- JWT tokens: `/api/token/`, `/api/token/refresh/`
	- Users API: `/api/users/`
	- Health check: `/up`

## Development Workflow
1. Plan features against official requirements in [../README.md](../README.md)
2. Implement frontend and backend changes
3. Validate with QA agent or prompt (see `.github/prompts/qa-validation.prompt.md`)
4. Update API documentation in [server/README.md](server/README.md)

## Testing

### Backend (Pytest)
```bash
cd Exam-Budget-Tracker-App/server
pytest
```

### Frontend (Vitest)
```bash
cd Exam-Budget-Tracker-App/client
npm run test
```

### Storybook
```bash
cd Exam-Budget-Tracker-App/client
npm run storybook
```

## Environment Variables

Backend variables (see `server/.env.example`):
- `DEBUG`
- `SECRET_KEY`
- `ALLOWED_HOSTS`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `DB_HOST`
- `DB_PORT`
- `ACCESS_TOKEN_LIFETIME`
- `REFRESH_TOKEN_LIFETIME`

Frontend variables:
- `VITE_API_BASE_URL` (example: `http://localhost:8000/api/`)

## Contributing
- Follow patterns in `.github/skills/`
- Run QA validation before committing
- Keep API docs updated in [server/README.md](server/README.md)

## License and Academic Integrity
This is a course assignment for AI for Developers - January 2026. Refer to [../README.md](../README.md) for the official requirements.
