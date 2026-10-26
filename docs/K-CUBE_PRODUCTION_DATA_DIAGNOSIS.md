# Production data-load investigation

## Evidence

- Public production /api/v1/health returned HTTP 200.
- Public unauthenticated /api/v1/admin/community-map returned HTTP 401, as expected; Nginx routes it to the protected backend.
- The user's authenticated map failure status was not visible in the screenshot. Zero counters accompanied a generic request failure, not proof of an empty database.
- A read-only SELECT check using this local checkout's configured MySQL connection failed with ER_ACCESS_DENIED_ERROR. This can mean credentials or host grants; it does not prove the VPS has the same failure or environment.
- Production Compose used separate frontend/backend containers, but lacked KCUBE_API_ORIGIN=http://backend:4000 for frontend server-side API calls. That mismatch affects server-fetched catalogs; it alone does not explain an authenticated map query failing through Nginx.
- Backend runner did not copy catalog seed data or persist uploaded/catalog files. This is separate from MySQL community records.

## Local fixes prepared (not deployed)

- Frontend Docker build/runtime and Compose now explicitly use the backend service origin.
- Backend image copies its existing catalog seed; Compose adds persistent shop_data at /app/data for product JSON/uploads.
- Map failures classify safe database/authentication/permission/schema errors without exposing SQL or credentials.
- Frontend displays session/scope/database failure messages and shows unavailable metrics as a dash instead of zero. The empty-dataset message is suppressed when the request fails.
- Read-only backend/scripts/diagnose-production.js checks connection, map table/column read access and user count. It performs no migrations/seeding/writes and prints no password, raw hostname or raw SQL errors.

## Verification

Backend/frontend TypeScript and targeted frontend lint pass. Seven safe database-error classification tests pass. docker compose config --quiet passes. Frontend production build passes. Authenticated production data loading remains unverified: no VPS shell/database-grant access and no authenticated browser request were available. No live credentials were changed; no database was created, reset or imported.

## Next diagnostic on the VPS (works with the already deployed image)

From /opt/K-Cube/K-Cube:

    docker compose -f docker-compose.prod.yml exec -T backend node -e 'const p=require("./dist/db/pool").default;p.query("SELECT COUNT(*) AS total FROM users").then(([r])=>console.log({database:"connected",users:r[0].total})).catch(e=>{console.log({code:e.code});process.exitCode=1}).finally(()=>p.end())'

Share only the resulting status/error code, not .env contents, tokens or passwords. ER_ACCESS_DENIED_ERROR needs correction of the actual server database user/password or host grants. ECONNREFUSED/ENOTFOUND/ETIMEDOUT needs the actual reachable MySQL host/port/network, not an assumed replacement hostname. Connected users with a map failure requires the authenticated map status or read-only schema diagnostic next. A 401/403 map failure is an authentication/scope issue, not a database connection conclusion.

If MySQL runs on the VPS host rather than a database service/external host, localhost inside the Node container points at Node's container, not the VPS. Select a real reachable hostname and appropriate restricted grants; do not expose the database broadly or guess credentials.

## Before applying the new persistent shop volume

Preserve any existing runtime /app/data from the old backend container BEFORE recreating it. The new volume is initialized with image seed data on first use and must receive existing catalog/uploads if administrators already added them. For example, docker cp kcube-backend:/app/data ./kcube-shop-backup saves a copy without deleting source data; restore the saved contents into the new /app/data after first startup. If the old directory is absent, there is no catalog at that path to copy. This file storage is independent of MySQL; do not reset the MySQL database to fix a product-file mount.

Only deploy after checking actual production error and preserving existing runtime product data. No production deployment or Git push was performed in this investigation.
# Confirmed HTTP 429 issue

The browser Network screenshot confirms that admin reads are being rate limited; it does not establish a database credential failure. The global API limiter previously shared its 100 requests/minute IP quota with the dashboard's 25 initial reads.

Verified admin workspace GET/HEAD requests now have a separate, bounded per-account quota (default 600 per existing rate-limit window, configurable with `ADMIN_READ_RATE_LIMIT_MAX`). Public requests, authentication and mutations retain the original IP quota. Invalid, expired or forged credentials do not receive the admin quota. Route authentication and scope checks still apply.

The dashboard stops subsequent batches when a 429 occurs and displays the Retry-After wait instead of replacing loaded data with empty fallbacks. No automatic retry loop is introduced.

Verification: backend TypeScript build, frontend TypeScript check and eight rate-limit/diagnostic tests passed locally. This fix has not been deployed, and authenticated production data retrieval must be rechecked after deployment.

