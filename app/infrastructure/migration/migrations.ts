import type { Migration } from './migration'

/**
 * Ordered list of schema migrations.
 *
 * Empty for now — no tables exist yet. Future phases add migrations here (e.g.
 * creating the `parties` table); the runner applies any with a version greater
 * than the stored schema version.
 */
export const migrations: readonly Migration[] = []
