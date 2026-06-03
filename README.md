# K-CUBE

K-CUBE is a full-stack Korean culture, learning, events, rewards, and K-Food engagement platform for India.

## Project Structure

```text
k-cube/
  backend/        Express + TypeScript API
  frontend/       Next.js app
  database/       MySQL schema
  docs/           Technical documentation and dated deliverables
  server.js       Single-domain production entrypoint
  docker-compose.yml
```

## Core Stack

- Frontend: Next.js, TypeScript, Tailwind CSS, React Query, Zustand
- Backend: Node.js, Express, TypeScript, JWT auth, MySQL
- Database: MySQL 8
- Deployment options: Docker, single-domain Node app, separate frontend/backend apps

## Local Development

Install dependencies:

```bash
npm install --prefix backend
npm install --prefix frontend
```

Run backend and frontend separately:

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

Default local URLs:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:4000/api/v1`

## Docker

Run the complete local stack:

```bash
docker compose up -d --build
```

Docker services:

- `kcube-frontend` on port `3000`
- `kcube-backend` on port `4000`
- `kcube-mysql` on port `3306`

## Database

The canonical schema is:

```text
database/schema.sql
```

The backend connects to MySQL through environment variables in `backend/.env.example`.

## Documentation

Current technical deliverables are stored by date:

```text
docs/2026-05-30/
```

That folder contains the current database ERD/schema, API specification, Google Workspace integration plan, technical foundation review, and matching PDFs.

## Production Notes

- Keep real `.env` files out of git.
- Set strong `JWT_SECRET` and `JWT_REFRESH_SECRET`.
- Use `NEXT_PUBLIC_API_URL=/api/v1` for single-domain deployment.
- Use `MYSQL_HOST=mysql` only inside Docker Compose.
- Use a real MySQL host such as `127.0.0.1` or the hosting provider hostname outside Docker.
