# Backend API Summary

Auth
- POST /api/auth/signup — name, email, password
- POST /api/auth/login — returns JWT

Projects
- POST /api/projects — Admin only
- GET /api/projects — Projects user belongs to
- POST /api/projects/:id/members — Admin adds user to project by email
- DELETE /api/projects/:id/members/:userId — Admin removes member

Tasks
- POST /api/projects/:projectId/tasks — Admin only
- GET /api/projects/:projectId/tasks — Project members
- PATCH /api/tasks/:id — Admin: any field; Member: only status
- DELETE /api/tasks/:id — Admin only

Dashboard
- GET /api/dashboard — totals, byStatus, overdue, assignedToMe

Notes
- All protected routes require `Authorization: Bearer <token>` header.
