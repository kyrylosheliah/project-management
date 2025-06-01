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
npm run build
npm run start
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
npm run build
npm run start
```

## Drawing board / TODOs

Must:
- Bind mutations to current entity info page entity id
- Extract component contexts to eliminate parameter passing
- Uncontrolled entity table search parameters state and initial merging

Could:
- @nestjs/jwt auth
- Decorators for role-based access control
- docker-compose deployment
- CI pipeline

Exploration:
- Project-wide schema defined via OpenAPI Specification
- Filtering dictionary object (search fields with column name dropdown)
- Sorting dictionary object (every column retains sorting chevron state)
