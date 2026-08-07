import type { Database, SqlValue } from './database'
import { DatabaseError } from './database-error'

/**
 * Non-persistent database used for browser/dev and tests.
 *
 * SQLite runs only inside the native app. In the browser we don't persist
 * business data — this driver just satisfies the `Database` contract so the app
 * boots and the migration runner can be exercised. It tracks a schema version
 * but does not execute SQL.
 */
export class InMemoryDatabase implements Database {
  #open = false
  #schemaVersion = 0

  open(): Promise<void> {
    this.#open = true
    return Promise.resolve()
  }

  close(): Promise<void> {
    this.#open = false
    return Promise.resolve()
  }

  isOpen(): boolean {
    return this.#open
  }

  execute(_sql: string, _params?: readonly SqlValue[]): Promise<void> {
    return this.#guard()
  }

  query<TRow>(_sql: string, _params?: readonly SqlValue[]): Promise<readonly TRow[]> {
    return this.#open
      ? Promise.resolve<readonly TRow[]>([])
      : Promise.reject(this.#notOpenError())
  }

  getSchemaVersion(): Promise<number> {
    return this.#open
      ? Promise.resolve(this.#schemaVersion)
      : Promise.reject(this.#notOpenError())
  }

  setSchemaVersion(version: number): Promise<void> {
    if (!this.#open) return Promise.reject(this.#notOpenError())
    this.#schemaVersion = version
    return Promise.resolve()
  }

  #guard(): Promise<void> {
    return this.#open ? Promise.resolve() : Promise.reject(this.#notOpenError())
  }

  #notOpenError(): DatabaseError {
    return new DatabaseError('Database is not open')
  }
}
