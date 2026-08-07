import type { Migration } from './migration'

/**
 * v1 — create the `parties` table. Columns mirror the `Party` entity; nullable
 * columns match its optional fields. `id` is a locally generated UUID (TEXT),
 * timestamps are ISO-8601 strings. `IF NOT EXISTS` keeps the migration safe to
 * re-run on a partially-initialised store.
 */
export const createPartiesTable: Migration = {
  version: 1,
  name: 'create-parties-table',
  async up(database) {
    await database.execute(`
      CREATE TABLE IF NOT EXISTS parties (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        date TEXT,
        location TEXT,
        description TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `)
  },
}
