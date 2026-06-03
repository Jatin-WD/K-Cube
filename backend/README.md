# K-CUBE Backend

Express + TypeScript API for K-CUBE.

## Stack

- Node.js
- Express
- TypeScript
- MySQL via `mysql2/promise`
- JWT authentication
- Role/category access middleware
- Rate limiting and security middleware

## Run Locally

```bash
npm install
npm run dev
```

Default API URL:

```text
http://localhost:4000/api/v1
```

## Environment

Copy the example file and update values locally:

```bash
cp .env.example .env
```

Important variables:

```env
PORT=4000
API_PREFIX=/api/v1
JWT_SECRET=
JWT_REFRESH_SECRET=
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_DATABASE=kcube
MYSQL_USER=kcube_user
MYSQL_PASSWORD=
```

Inside Docker Compose, `MYSQL_HOST` is overridden to:

```env
MYSQL_HOST=mysql
```

## Build

```bash
npm run build
npm start
```

Compiled output is generated in `backend/dist/` and is ignored by git.
