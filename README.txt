TEAM TASK MANAGER - PROJECT OVERVIEW

This is a full-stack project management application built with a focus on premium UI and data privacy. It allows teams to manage projects, assign tasks, and track real-time activity within a unified dashboard.

Key Features:
- Admin Panel: Full control over project creation, member assignment, and task deletion.
- Member Panel: Clean, private workspace where members only see tasks assigned specifically to them.
- Real-time Feed: Activity logs that track task creation, status updates, and project milestones.
- Premium Design: Minimalist, monochromatic UI inspired by modern design standards.
- Mobile Responsive: Fully optimized for all screen sizes.
- Security: JWT-based authentication and role-based access control.

Tech Stack:
- Frontend: React.js, Tailwind CSS (Vanilla CSS for custom design system), Vite.
- Backend: Node.js, Express.
- Database: PostgreSQL with Prisma ORM.
- Authentication: JSON Web Tokens (JWT).

How to run locally:

1. Backend:
   - Navigate to /backend
   - Run 'npm install'
   - Set up your .env with DATABASE_URL and JWT_SECRET
   - Run 'npx prisma migrate dev'
   - Run 'npm run dev'

2. Frontend:
   - Navigate to /frontend
   - Run 'npm install'
   - Set up your .env with VITE_API_URL
   - Run 'npm run dev'



GitHub Repo: https://github.com/mayank6940/team-task-manager

---

### Access Credentials (Demo)

**Admin Panel:**
- Email: `admin@example.com`
- Password: `AdminPass123`

**Member Panel:**
- Email: `member@example.com`
- Password: `MemberPass123`

