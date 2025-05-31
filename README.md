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
- Column width for long text entity field displaying
- DTO request validation
- SOLID, KISS, folder structure
- Handle backend database querying exceptions
- Handle database search comparison per field type
- Bind mutations to current entity info page entity id

Could:
- @nestjs/jwt auth
- TanStack Query params for pagination and filtering
- Decorators for role-based access control
- docker-compose deployment
- CI pipeline
- Filtering dictionary object (search fields with column name dropdown)
- Sorting dictionary object (every column retains sorting chevron state)
- External search parameters state merge solution

Exploration:
- Project-wide schema defined via OpenAPI Specification