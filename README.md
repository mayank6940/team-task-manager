# Team Task Manager

Full-stack Team Task Manager (Express + Prisma + React + Vite) with a premium, fully responsive UI design.

Folders:
- `backend/` — Express API, Prisma schema, middleware, and API routes.
- `frontend/` — React + Vite TypeScript SPA.

## Key Features

- **Premium Responsive Design**: A high-fidelity, monochromatic UI optimized for all devices—from desktop monitors to mobile screens.
- **Role-Based Access**: Specialized views for Admins (full project control) and Members (private task workspace).
- **Real-Time Experience**: Fast, reactive interface for tracking task progress and team activity.
- **Production Ready**: Optimized for deployment on platforms like Railway and Vercel.


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

## Demo Credentials

**Admin User:**
- Email: `admin@example.com`
- Password: `AdminPass123`

**Member User:**
- Email: `member@example.com`
- Password: `MemberPass123`

