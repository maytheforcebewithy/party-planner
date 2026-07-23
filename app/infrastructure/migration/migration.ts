import type { Database } from '../database/database'

/**
 * A single, ordered schema change. Migrations are applied in ascending
 * `version` order and each bumps the database's schema version once it succeeds.
 */
export interface Migration {
  /** Strictly increasing, unique version this migration upgrades the schema to. */
  readonly version: number
  /** Human-readable name for logging/debugging. */
  readonly name: string
  /** Apply the schema change. */
  up: (database: Database) => Promise<void>
}
