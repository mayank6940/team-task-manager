# Backend — Team Task Manager

Setup
```bash
cd backend
npm install
cp .env.example .env
# set DATABASE_URL and JWT_SECRET in .env
npx prisma generate
```

Development
```bash
npm run dev
```

Build & Production
```bash
npm run build
npm run start:prod
```

Prisma
- Run migrations locally: `npm run prisma:migrate`
- Seed data: `npm run seed`

Environment variables
- `DATABASE_URL` — Postgres connection
- `JWT_SECRET` — JWT signing secret
- `PORT` — optional server port

Railway deploy notes
- Connect repo to Railway and set environment variables in the project settings.
- Build Command: `npm run build`
- Start Command: `npm run start:prod`
# Team Task Manager — Backend

Minimal Express backend scaffold with Prisma. Implements auth routes and Prisma schema.

Setup

1. Copy `.env.example` to `.env` and set `DATABASE_URL` and `JWT_SECRET`.
2. Install deps: `npm install` inside `backend`.
3. Generate Prisma client: `npm run prisma:generate`.
4. Run migrations locally: `npm run prisma:migrate`.
5. Start dev server: `npm run dev`.

Testing

- Run unit tests (middleware-only, no DB required): `npm test`

Deployment (Railway)

- Create a Railway project and add the PostgreSQL plugin.
- Set environment variables: `DATABASE_URL`, `JWT_SECRET`, `PORT`.
- Deploy from the repo root so Railway uses the root workspace scripts.
- Use `npm run build` for the build step and `npm start` for the release step.
- The backend scripts already run Prisma generate during build and migrations during startup.

Seeding local database

1. Ensure `DATABASE_URL` is set in `.env` and the database is reachable.
2. Generate Prisma client: `npm run prisma:generate`.
3. Run migrations: `npm run prisma:migrate` (or `npx prisma migrate deploy` in production).
4. Run seed script: `npm run seed`. This creates an admin and a member user and an example project.

Default seeded credentials (change in production):
- Admin: `admin@example.com` / `AdminPass123`
- Member: `member@example.com` / `MemberPass123`

API examples

- Signup:

```bash
curl -X POST http://localhost:4000/api/auth/signup \
	-H "Content-Type: application/json" \
	-d '{"name":"Test","email":"test@example.com","password":"secret"}'
```

- Login:

```bash
curl -X POST http://localhost:4000/api/auth/login \
	-H "Content-Type: application/json" \
	-d '{"email":"admin@example.com","password":"AdminPass123"}'
```

- Get projects (requires JWT):

```bash
curl http://localhost:4000/api/projects -H "Authorization: Bearer <token>"
```

Notes
- All protected routes expect `Authorization: Bearer <token>` header.

