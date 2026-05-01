# Frontend — Team Task Manager

Setup
```bash
cd frontend
npm install
cp .env.example .env
# set VITE_API_URL to your backend URL
```

Development
```bash
npm run dev
```

Build
```bash
npm run build
```

Deploy to Vercel
- Import repository into Vercel and set the project root to `frontend`.
- Add environment variable `VITE_API_URL` to point to your backend.
- Build command: `npm run build` (Vercel detects this automatically)
- Output directory: `dist` (configured in vercel.json)
# Frontend — Team Task Manager

This folder contains a Vite + React + TypeScript single-page app.

Setup

1. Copy `.env.example` to `.env` and set `VITE_API_URL`.
2. Install dependencies: `npm install`.
3. Start dev server: `npm run dev`.

Notes

- The frontend expects `VITE_API_URL` to point to the backend (e.g., `http://localhost:4000`).
- JWT token is stored in `localStorage` under `token` and attached to requests automatically.

Deployment

- Build with `npm run build` and deploy the output to Vercel or Railway static hosting. Set `VITE_API_URL` in the deployment environment.

