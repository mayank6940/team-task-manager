# Deployment Checklist

Backend (Railway)

- Create a Railway project and add the PostgreSQL plugin.
- Set environment variables in Railway: `DATABASE_URL`, `JWT_SECRET`, `PORT`.
- Deploy from the repo root. The root `package.json` now exposes the backend workspace to Railway.
- Railway should use the root scripts: `npm run build` and `npm start`.
- The backend build step runs `prisma generate` before TypeScript compilation, and startup runs `prisma migrate deploy` before launching the server.
- After deployment, run any required seed scripts and verify the `/health` endpoint.

Frontend (Vercel / Railway static)

- Build the frontend with `npm run build` in `frontend/`.
- Deploy the `dist` (Vite) output to Vercel or Railway static hosting.
- Set environment variable `VITE_API_URL` to the backend URL.

Notes

- If you need to run migrations manually on Railway, use `npx prisma migrate deploy` from the Railway console.
- Keep `JWT_SECRET` strong in production.
