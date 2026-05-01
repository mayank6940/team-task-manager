# Team Task Manager — Submission

Project overview
- Name: Team Task Manager
- Short description: Full-stack task and project management app with role-based auth (ADMIN/MEMBER), JWT auth, projects, tasks, and a dashboard for stats and overdue items.

Key features
- JWT authentication (signup/login)
- Role-based access: `ADMIN` and `MEMBER`
- Projects: create, read, update, delete (ADMIN)
- Tasks: CRUD with status (Todo/In Progress/Done), assignees, due dates, priority
- Dashboard: quick stats, overdue tasks, project overview
- Responsive React + Tailwind UI with modal flows and confirmations

Tech stack
- Backend: Node.js, Express, TypeScript, Prisma (Postgres), JWT, bcrypt
- Frontend: React, TypeScript, Vite, Tailwind CSS, Axios

Run locally
1. Backend
```bash
cd backend
npm install
cp .env.example .env
# set DATABASE_URL and JWT_SECRET in .env
npx prisma generate
npm run dev
```
2. Frontend
```bash
cd frontend
npm install
cp .env.example .env
# set VITE_API_URL to the backend URL
npm run dev
```

Deployment
- Backend: deploy to Railway (see `backend/.env.example` and `DEPLOY.md`). Start command uses `npm run start:prod` which runs Prisma migrations then starts the compiled server.
- Frontend: deploy to Vercel. `vercel.json` is included to serve the Vite `dist` folder. Set `VITE_API_URL` in Vercel environment settings.

Env variables (important)
- `DATABASE_URL` — Postgres connection string for Prisma
- `JWT_SECRET` — secret used to sign JWT tokens
- `VITE_API_URL` — frontend environment pointing to backend base URL

Demo credentials (seeded/example)
- Admin: admin@example.com / password (if seeded) — adjust as needed in `prisma/seed.ts`.

Repo structure
- `backend/` — Express API, Prisma schema, migrations, seed
- `frontend/` — React app (Vite), components, pages, CSS tokens

Notes for reviewers
- See `DEPLOY.md` for step-by-step deployment instructions to Railway and Vercel.
- If you need test accounts or screenshots, I can provide them.
