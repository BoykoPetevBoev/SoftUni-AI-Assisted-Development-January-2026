# Exercise-TODO-App

Personal task management application built with React, TypeScript, Express, and MongoDB.

## Project Structure

```
Exercise-TODO-App/
├── client/          # Frontend (React + Vite + React Query + TypeScript)
├── server/          # Backend (Express + TypeScript + MongoDB)
└── docker-compose.yml
```

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- MongoDB Compass (optional, for database GUI)

## Setup Instructions

### 1. Start MongoDB with Docker

```bash
docker-compose up -d
```

MongoDB will be available at `mongodb://admin:admin@localhost:27017/?authSource=admin`

### 2. Install Dependencies

**Frontend:**
```bash
cd client
npm install
```

**Backend:**
```bash
cd server
npm install
```

### 3. Environment Configuration

Copy `.env.example` to `.env` in both client and server directories:

**Client (.env):**
```
VITE_API_URL=http://localhost:3000
```

**Server (.env):**
```
MONGODB_URI=mongodb://admin:admin@localhost:27017/todoapp?authSource=admin
PORT=3000
```

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Server will start at `http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
Frontend will start at `http://localhost:5173`

## MongoDB Compass Connection

Use this connection string in MongoDB Compass:
```
mongodb://admin:admin@localhost:27017/?authSource=admin
```

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- React Query (TanStack Query)
- Axios

### Backend
- Express
- TypeScript
- MongoDB with Mongoose
- CORS
- dotenv

## Folder Structure

### Frontend (client/src/)
- `api/` - API client and configuration
- `components/` - Reusable UI components
- `hooks/` - Custom React hooks
- `pages/` - Page-level components
- `types/` - TypeScript type definitions
- `styles/` - Global styles

### Backend (server/src/)
- `config/` - Database and app configuration
- `controllers/` - Route handlers
- `middleware/` - Express middleware
- `models/` - Mongoose models
- `routes/` - API routes
- `services/` - Business logic
- `types/` - TypeScript type definitions

## Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend
- `npm run dev` - Start development server with nodemon
- `npm run build` - Compile TypeScript
- `npm start` - Start production server

## License

MIT
