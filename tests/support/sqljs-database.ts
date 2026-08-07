import initSqlJs from 'sql.js'
import type { Database as SqlJsDatabase } from 'sql.js'
import type { Database, SqlValue } from '~/infrastructure/database/database'

/**
 * A real SQLite engine (sql.js, pure wasm) implementing the app's {@link Database}
 * contract, for integration tests only. It lets the actual migrations and the
 * SqlitePartyRepository SQL run against genuine SQLite in Node — proving the
 * native storage path without a device.
 */
export async function createSqlJsDatabase(): Promise<Database> {
  const SQL = await initSqlJs({ locateFile: file => `node_modules/sql.js/dist/${file}` })
  let db: SqlJsDatabase | null = null

  const requireDb = (): SqlJsDatabase => {
    if (!db) throw new Error('Database is not open')
    return db
  }

  // sql.js binds numbers/strings/null; map booleans the way the repository stores them.
  const bind = (params?: readonly SqlValue[]): (string | number | null)[] =>
    (params ?? []).map(value => (typeof value === 'boolean' ? (value ? 1 : 0) : value))

  return {
    open() {
      db = new SQL.Database()
      return Promise.resolve()
    },
    close() {
      db?.close()
      db = null
      return Promise.resolve()
    },
    isOpen() {
      return db !== null
    },
    execute(sql, params) {
      requireDb().run(sql, bind(params))
      return Promise.resolve()
    },
    query<TRow>(sql: string, params?: readonly SqlValue[]): Promise<readonly TRow[]> {
      const statement = requireDb().prepare(sql)
      try {
        if (params?.length) statement.bind(bind(params))
        const rows: TRow[] = []
        while (statement.step()) rows.push(statement.getAsObject() as TRow)
        return Promise.resolve(rows)
      }
      finally {
        statement.free()
      }
    },
    async getSchemaVersion() {
      const rows = await this.query<{ user_version: number }>('PRAGMA user_version;')
      return rows[0]?.user_version ?? 0
    },
    setSchemaVersion(version) {
      // PRAGMA cannot be parameterised; the version is an integer we own.
      requireDb().run(`PRAGMA user_version = ${Math.trunc(version)};`)
      return Promise.resolve()
    },
  }
}
