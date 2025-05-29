# Project Management Web App

Backend tech stack: PostgreSQL, NestJS, TypeORM, class-validator
Frontend tech stack: Vite React, TanStack Query, React Hook Form, Zod, JavaScript Fetch API

## Run

### Backend

`backend/.env` file:
```
NESTJS_PORT=3000
FRONTEND_URL=http://localhost:5000
PG_HOST=localhost
PG_PORT=5433
PG_USERNAME=postgres
PG_PASSWORD=password
PG_NAME=ProjectManagement
```

```
cd backend
npm i
npm run typeorm migration:run
npm run start:dev
```

### Frontend

`frontend/.env` file:
```
VITE_PORT=5000
VITE_BACKEND_URL=http://localhost:3000
```

```
cd frontend
npm i
npm run dev
```

## Drawing board / TODOs

Must:
- Entity picking with modal form
- Column width for long text entity field displaying
- Enum dropdown input handling
- CRUD entities
[- TanStack Query http wrapper
- DTO request validation
- SOLID, KISS, folder structure
- Forms with validation: 'add task', 'assign task'
- Update task status feature

Could:
- EntityFieldDisplay full entity info and link popup on hover
- Set DB connection string and ports with environment variables
- @nestjs/jwt auth
- TanStack Query params for pagination and filtering
- Decorators for role-based access control
- docker-compose deployment
- CI pipeline

Exploration:
- Project-wide schema defined via OpenAPI Specification