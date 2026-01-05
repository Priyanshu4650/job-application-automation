# Job Application Automation - Admin Portal

A simple Admin CRUD portal for managing company career pages.

## Tech Stack

- **Backend**: NestJS + TypeORM + PostgreSQL
- **Frontend**: React + TypeScript + Vite

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL database running

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update database credentials in `.env` file

5. Start the backend:
```bash
npm run start:dev
```

Backend will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## API Endpoints

- `POST /admin/companies` - Create company
- `GET /admin/companies` - List all companies  
- `PUT /admin/companies/:id` - Update company
- `DELETE /admin/companies/:id` - Soft delete company

## Features

- Add new companies with career page URLs
- Edit existing company information
- Disable companies (soft delete)
- ATS type selection (Greenhouse, Lever, Workday, Custom, Unknown)
- Clean, responsive UI with loading states and error handling

## Request Flow

1. **Frontend** → API call via axios
2. **Controller** → Validates request with DTOs
3. **Service** → Business logic and database operations
4. **TypeORM** → Database queries to PostgreSQL
5. **Response** → JSON data back to frontend