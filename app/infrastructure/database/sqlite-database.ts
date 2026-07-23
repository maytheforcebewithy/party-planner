import type { SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite'
import type { Database, SqlValue } from './database'
import { DatabaseError, DatabaseOpenError } from './database-error'
import { logger } from '~/shared/logger'

const DATABASE_NAME = 'party-planner'
const NO_ENCRYPTION = 'no-encryption'

/**
 * Native SQLite driver backed by @capacitor-community/sqlite.
 *
 * The plugin is imported dynamically so it is only loaded when running inside
 * the native app (see `createDatabase`). Schema versioning is tracked via the
 * SQLite `user_version` pragma so the generic migration runner stays driver
 * agnostic.
 */
export class SqliteDatabase implements Database {
  #connection: SQLiteConnection | null = null
  #db: SQLiteDBConnection | null = null

  async open(): Promise<void> {
    try {
      const { CapacitorSQLite, SQLiteConnection } = await import('@capacitor-community/sqlite')
      const connection = new SQLiteConnection(CapacitorSQLite)

      const alreadyOpen = (await connection.isConnection(DATABASE_NAME, false)).result === true
      const db = alreadyOpen
        ? await connection.retrieveConnection(DATABASE_NAME, false)
        : await connection.createConnection(DATABASE_NAME, false, NO_ENCRYPTION, 1, false)

      await db.open()
      this.#connection = connection
      this.#db = db
      logger.debug('SQLite database opened')
    }
    catch (error) {
      throw new DatabaseOpenError('Failed to open the SQLite database', { cause: error })
    }
  }

  async close(): Promise<void> {
    if (this.#db) await this.#db.close()
    if (this.#connection) await this.#connection.closeConnection(DATABASE_NAME, false)
    this.#db = null
    this.#connection = null
  }

  isOpen(): boolean {
    return this.#db !== null
  }

  async execute(sql: string, params: readonly SqlValue[] = []): Promise<void> {
    const db = this.#requireDb()
    if (params.length > 0) await db.run(sql, [...params])
    else await db.execute(sql)
  }

  async query<TRow>(sql: string, params: readonly SqlValue[] = []): Promise<readonly TRow[]> {
    const db = this.#requireDb()
    const result = await db.query(sql, params.length > 0 ? [...params] : undefined)
    return (result.values ?? []) as readonly TRow[]
  }

  async getSchemaVersion(): Promise<number> {
    const rows = await this.query<{ user_version: number }>('PRAGMA user_version;')
    return rows[0]?.user_version ?? 0
  }

  async setSchemaVersion(version: number): Promise<void> {
    // PRAGMA statements cannot be parameterised; `version` is an integer we own.
    await this.execute(`PRAGMA user_version = ${Math.trunc(version)};`)
  }

  #requireDb(): SQLiteDBConnection {
    if (!this.#db) throw new DatabaseError('Database is not open')
    return this.#db
  }
}
