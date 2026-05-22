# K-CUBE — India’s Korean Digital Ecosystem

This workspace contains the full-stack architecture for the K-CUBE platform.

## Structure
- `frontend/` - Next.js 16 app with TypeScript, TailwindCSS, Framer Motion, Three.js, Zustand, and React Query
- `backend/` - Node.js Express API with TypeScript, MySQL, JWT auth, and security middleware
- `database/` - MySQL schema for users, chapters, rewards, learning, search, and analytics

## Getting Started
1. Install dependencies in each folder:
   - `cd frontend && npm install`
   - `cd backend && npm install`
2. Create a MySQL database and run `database/schema.sql`
3. Copy `backend/.env.example` to `backend/.env` and update credentials
4. Copy `frontend/.env.example` to `frontend/.env` if needed
5. Start backend: `cd backend && npm run dev`
6. Start frontend: `cd frontend && npm run dev`

## Docker Deployment
- `docker compose up --build`

## Notes
- Frontend uses premium cinematic UI with mega-navigation and search suggestions.
- Backend uses JWT auth, role/category access, rate limiting, and MySQL schema for gamification.
