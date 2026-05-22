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

For this full-stack app, the cleanest Hostinger path is a VPS or Hostinger Node.js Web App Hosting plan that supports Node.js apps from GitHub.

### Option 1: Hostinger VPS With Docker

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

### Option 2: Hostinger Node.js Web App Hosting

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
