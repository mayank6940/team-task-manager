# Deploying Team Task Manager

This guide explains how to deploy the backend to Railway and the frontend to Vercel.

Prereqs
- A GitHub repo for this project
- Railway account (https://railway.app)
- Vercel account (https://vercel.com)

Backend (Railway)
1. Push your repository to GitHub and connect the repo to Railway.
2. In Railway, create a new Project and connect your GitHub repo. Select the backend folder as the service root if prompted.
3. Set environment variables in Railway (Variables tab):
   - `DATABASE_URL` — your Postgres connection string
   - `JWT_SECRET` — a secure random string
   - Optionally `PORT` (Railway sets one automatically).
4. Set the Start Command to: `npm run start:prod`
   - This runs `prisma migrate deploy` and then `node dist/server.js`.
5. Railway will run `npm install` and `npm run build` automatically (the backend `package.json` includes a `build` script that runs `tsc`). If not, ensure the Build Command is `npm run build`.
6. Deploy. Check the logs — Prisma migrations will be applied on first start.

Notes:
- If you prefer containers, add a Dockerfile and use Railway's Docker deployment.
- Ensure `DATABASE_URL` points to a Railway Postgres plugin or external DB.

Frontend (Vercel)
1. Push your frontend code (same repo) to GitHub.
2. In Vercel, create a new project and import the repo. Set the root to the `frontend` folder when asked.
3. In Vercel Project Settings → Environment Variables, add:
   - `VITE_API_URL` — the Railway backend URL (e.g. `https://your-railway-service.up.railway.app`)
4. Vercel will detect the static build. We include `vercel.json` to ensure the `dist` output is used.
   - Build Command: `npm run build`
   - Output Directory: `dist` (handled by `vercel.json`)
5. Deploy and verify the site.

Local verification
- Backend: `cd backend && npm run dev` (runs ts-node-dev)
- Frontend: `cd frontend && npm run dev`

Troubleshooting
- If the frontend cannot reach the backend, confirm `VITE_API_URL` points to the correct HTTPS endpoint and CORS is enabled on the backend.
- Check Railway logs for migration errors and missing environment variables.
