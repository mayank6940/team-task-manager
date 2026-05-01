# Deployment Checklist

Backend (Railway)

- Create a Railway project and add the PostgreSQL plugin.
- Set environment variables in Railway: `DATABASE_URL`, `JWT_SECRET`, `PORT`.
- The repo contains a `Procfile` which runs `npx prisma migrate deploy && node src/server.js`.
- Railway will detect the Node app; ensure the build command runs `npm install` and `npx prisma generate` if needed.
- After deployment, run any required seed scripts and verify the `/health` endpoint.

Frontend (Vercel / Railway static)

- Build the frontend with `npm run build` in `frontend/`.
- Deploy the `dist` (Vite) output to Vercel or Railway static hosting.
- Set environment variable `VITE_API_URL` to the backend URL.

Notes

- On Railway, the `Procfile` ensures migrations run on startup. If you prefer manual control, run `npx prisma migrate deploy` from the Railway console instead.
- Keep `JWT_SECRET` strong in production.
