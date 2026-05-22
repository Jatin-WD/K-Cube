# K-CUBE Deployment Guide

## GitHub Upload

Run these commands from the project root:

```bash
git init
git add -A
git commit -m "initial k-cube deployment build"
git branch -M main
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
git push -u origin main
```

Do not commit real `.env` files. Use Hostinger environment variables or private server files.

## Recommended Hostinger Setup

For one public website URL, deploy from the repository root and run both the Next.js frontend and Express API in one Node process.

### Option 1: Single Hostinger Node App, One Domain

Use this when you want:

- `https://yourdomain.com` for the website
- `https://yourdomain.com/api/v1` for the API on the same domain

Hostinger settings:

- Framework preset: `Express`
- Branch: `main`
- Root directory: leave blank or use repository root
- Node version: `22.x`
- Entry file: `server.js`
- Build command: `npm run build`
- Start command: `npm start`

Environment variables:

Copy `.env.hostinger-single.example` into Hostinger and replace only:

```bash
MYSQL_PASSWORD=your_real_hostinger_database_password
```

Important:

```bash
NEXT_PUBLIC_API_URL=/api/v1
```

This keeps frontend and backend on the same public domain.

### Option 2: Hostinger VPS With Docker

Use this if you want frontend, backend, and MySQL together.

```bash
git clone https://github.com/YOUR_USER/YOUR_REPO.git
cd YOUR_REPO
cp backend/.env.example backend/.env
docker compose up -d --build
```

Then configure a reverse proxy:

- `yourdomain.com` -> frontend container port `3000`
- `api.yourdomain.com` -> backend container port `4000`

Set frontend environment:

```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
```

### Option 3: Separate Hostinger Node.js Web Apps

Deploy two Node apps from the same GitHub repository.

Frontend app:

- Root directory: `frontend`
- Build command: `npm install && npm run build`
- Start command: `npm start`
- Environment: `NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1`

Backend app:

- Root directory: `backend`
- Build command: `npm install && npm run build`
- Start command: `npm start`
- Environment variables: copy values from `backend/.env.example`

Database:

- Create a Hostinger MySQL database.
- Import `database/schema.sql`.
- Put the Hostinger MySQL credentials into backend environment variables.

## Local Development

Backend:

```bash
cd backend
npm install
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Production Checklist

- Run `npm run build` in both `frontend` and `backend`.
- Import the latest `database/schema.sql`.
- Set strong `JWT_SECRET` and `JWT_REFRESH_SECRET`.
- Set `NEXT_PUBLIC_API_URL` to the live backend API URL.
- Enable HTTPS.
- Keep WordPress `k-food.in` separate until its 500 errors are fixed; K-CUBE has manual K-Food purchase claim tracking ready.
