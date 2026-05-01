# Submission Form (copy/paste)

Project Name: Team Task Manager

Short description:
Full-stack task and project management app with JWT auth, role-based access (ADMIN/MEMBER), project and task CRUD, and a dashboard for stats and overdue tasks.

Live frontend URL:
<PASTE_VERCEL_URL_HERE>

Backend API URL:
<PASTE_RAILWAY_URL_HERE>

GitHub repository:
<PASTE_GITHUB_REPO_URL_HERE>

Tech stack:
- Backend: Node.js, Express, TypeScript, Prisma (Postgres)
- Frontend: React, TypeScript, Vite, Tailwind CSS

Run locally (commands):
Backend:
```
cd backend
npm install
cp .env.example .env
# set DATABASE_URL and JWT_SECRET
npx prisma generate
npm run dev
```
Frontend:
```
cd frontend
npm install
cp .env.example .env
# set VITE_API_URL
npm run dev
```

Demo credentials:
- Admin (example): admin@example.com / password

Notes:
- Set `VITE_API_URL` in Vercel to the Railway backend URL.
- Backend start command for production: `npm run start:prod` (runs Prisma migrations and starts server).
