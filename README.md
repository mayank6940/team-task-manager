# Team Task Manager

Full-stack Team Task Manager (Express + Prisma + React + Vite).

Folders:
- `backend/` — Express API, Prisma schema, middleware, and API routes.
- `frontend/` — React + Vite TypeScript SPA.

Quick start

Backend:

```bash
cd backend
npm install
cp .env.example .env
# set DATABASE_URL and JWT_SECRET in .env
npx prisma generate
npm run dev
```

Frontend:

```bash
cd frontend
npm install
cp .env.example .env
# set VITE_API_URL
npm run dev
```

See `backend/README.md` and `frontend/README.md` for details and deployment notes.
