import type { Database } from '../database/database'
import { MigrationError } from '../database/database-error'
import type { Migration } from './migration'

export interface MigrationResult {
  /** Migrations applied during this run, in the order they were applied. */
  readonly applied: readonly Migration[]
  /** The schema version after the run. */
  readonly version: number
}

/**
 * Apply all migrations whose version is greater than the database's current
 * schema version, in ascending order. Idempotent: already-applied migrations
 * are skipped. Throws before doing anything if versions are not unique.
 */
export async function runMigrations(
  database: Database,
  migrations: readonly Migration[],
): Promise<MigrationResult> {
  const ordered = [...migrations].sort((a, b) => a.version - b.version)
  assertUniqueVersions(ordered)

  const currentVersion = await database.getSchemaVersion()
  const pending = ordered.filter(migration => migration.version > currentVersion)

  for (const migration of pending) {
    await applyAtomically(database, migration)
  }

  return {
    applied: pending,
    version: pending.at(-1)?.version ?? currentVersion,
  }
}

/**
 * Apply one migration and bump the schema version inside a single transaction,
 * so a failure rolls back its schema changes rather than leaving a half-applied
 * schema. SQLite DDL and `PRAGMA user_version` are both transactional.
 */
async function applyAtomically(database: Database, migration: Migration): Promise<void> {
  await database.execute('BEGIN;')
  try {
    await migration.up(database)
    await database.setSchemaVersion(migration.version)
    await database.execute('COMMIT;')
  }
  catch (error) {
    await rollbackQuietly(database)
    throw new MigrationError(`Migration ${migration.version} (${migration.name}) failed`, { cause: error })
  }
}

async function rollbackQuietly(database: Database): Promise<void> {
  try {
    await database.execute('ROLLBACK;')
  }
  catch {
    // Nothing to roll back (or already rolled back) — keep the original error.
  }
}

function assertUniqueVersions(migrations: readonly Migration[]): void {
  const seen = new Set<number>()
  for (const migration of migrations) {
    if (seen.has(migration.version)) {
      throw new MigrationError(`Duplicate migration version: ${migration.version}`)
    }
    seen.add(migration.version)
  }
}
