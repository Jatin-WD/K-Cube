# K-CUBE Frontend

Next.js frontend for the K-CUBE platform.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- React Query
- Zustand
- Framer Motion
- Three.js

## Run Locally

```bash
npm install
npm run dev
```

Default URL:

```text
http://localhost:3000
```

## Environment

Use `frontend/.env.example` as the local template.

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

For single-domain production:

```env
NEXT_PUBLIC_API_URL=/api/v1
```

## Routing

This project uses the Next.js App Router under:

```text
frontend/src/app/
```

Do not add a separate React Router layer unless the architecture is intentionally changed.
