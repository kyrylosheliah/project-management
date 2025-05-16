# Project Management Web App

Backend tech stack: PostgreSQL, NestJS, TypeORM, class-validator
Frontend tech stack: Vite React, TanStack Query, React Hook Form, Zod, JavaScript Fetch API

## Run

```
npm run start
```

## Drawing board / TODOs

Must:
- CRUD users
- CRUD projects
- 'One user owns one project' relation
- CRUD tasks
- 'One task belongs to one project' relation
- 'One task is assigned to one user' relation
- TanStack Query http wrapper
- DTO request validation
- SOLID, KISS, folder structure
- Project list to details traversal
- Project details with subtask listing
- Forms with validation: 'add task', 'assign task'
- Update task status feature

Could:
- Set DB connection string and ports with environment variables
- @nestjs/swagger docs
- @nestjs/jwt auth
- TanStack Query params for pagination and filtering
- Decorators for role-based access control
- docker-compose deployment
- CI pipeline