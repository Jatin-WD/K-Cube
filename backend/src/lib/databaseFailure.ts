/** Safe diagnostics: never send SQL, credentials, hostnames or raw driver messages. */
export function databaseFailure(error: unknown) {
  const driverCode = String((error as { code?: unknown })?.code || 'UNKNOWN');
  if (['ER_ACCESS_DENIED_ERROR', 'ER_DBACCESS_DENIED_ERROR'].includes(driverCode)) return { status: 503, code: 'DATABASE_AUTH_FAILED', message: 'Database access was denied. Check the server database credentials and user grants.' };
  if (driverCode === 'ER_BAD_DB_ERROR') return { status: 503, code: 'DATABASE_NOT_FOUND', message: 'The configured database could not be found. Check MYSQL_DATABASE on the server.' };
  if (['ER_NO_SUCH_TABLE', 'ER_BAD_FIELD_ERROR'].includes(driverCode)) return { status: 500, code: 'DATABASE_SCHEMA_MISMATCH', message: 'The server database schema is missing a required table or column. Check backend migration logs.' };
  if (driverCode === 'ER_TABLEACCESS_DENIED_ERROR') return { status: 503, code: 'DATABASE_PERMISSION_DENIED', message: 'The database user cannot read a required table. Check its database grants.' };
  if (['ECONNREFUSED', 'ETIMEDOUT', 'EHOSTUNREACH', 'ENOTFOUND', 'PROTOCOL_CONNECTION_LOST'].includes(driverCode)) return { status: 503, code: 'DATABASE_UNAVAILABLE', message: 'The backend cannot reach MySQL. Check database host, port and connectivity from inside the backend container.' };
  return { status: 500, code: 'COMMUNITY_MAP_ERROR', message: 'Community map data could not be loaded. Check backend logs for the database error code.' };
}
