const test = require('node:test');
const assert = require('node:assert/strict');
const { databaseFailure } = require('../dist/lib/databaseFailure');

for (const [driver, code, status] of [
  ['ER_ACCESS_DENIED_ERROR', 'DATABASE_AUTH_FAILED', 503],
  ['ECONNREFUSED', 'DATABASE_UNAVAILABLE', 503],
  ['ENOTFOUND', 'DATABASE_UNAVAILABLE', 503],
  ['ER_BAD_DB_ERROR', 'DATABASE_NOT_FOUND', 503],
  ['ER_NO_SUCH_TABLE', 'DATABASE_SCHEMA_MISMATCH', 500],
  ['ER_BAD_FIELD_ERROR', 'DATABASE_SCHEMA_MISMATCH', 500],
  ['ER_TABLEACCESS_DENIED_ERROR', 'DATABASE_PERMISSION_DENIED', 503],
]) {
  test(`${driver} returns an actionable safe diagnostic`, () => {
    const result = databaseFailure({ code: driver, message: 'secret-password private-host SELECT private_data' });
    assert.equal(result.code, code);
    assert.equal(result.status, status);
    assert.doesNotMatch(JSON.stringify(result), /secret-password|private-host|private_data/);
  });
}
