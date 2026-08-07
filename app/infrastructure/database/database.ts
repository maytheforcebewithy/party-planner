/**
 * Storage-agnostic database abstraction.
 *
 * Everything above this interface (repositories, stores, composables, UI) talks
 * only to `Database` and never to SQLite or Capacitor directly. Concrete drivers
 * live next to this file and are selected by `createDatabase()`.
 */

/** Value types that may be bound to a parameterised statement. */
export type SqlValue = string | number | boolean | null

export interface Database {
  /** Open the underlying store. Safe to call once during app start-up. */
  open: () => Promise<void>
  /** Close the underlying store and release resources. */
  close: () => Promise<void>
  /** Whether the store is currently open. */
  isOpen: () => boolean
  /** Run a statement that does not return rows (DDL / INSERT / UPDATE / …). */
  execute: (sql: string, params?: readonly SqlValue[]) => Promise<void>
  /** Run a query and return the resulting rows. */
  query: <TRow>(sql: string, params?: readonly SqlValue[]) => Promise<readonly TRow[]>
  /** Current schema version, used by the migration runner. */
  getSchemaVersion: () => Promise<number>
  /** Persist the schema version after a migration has been applied. */
  setSchemaVersion: (version: number) => Promise<void>
}
