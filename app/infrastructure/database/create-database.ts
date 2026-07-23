import { Capacitor } from '@capacitor/core'
import type { Database } from './database'
import { InMemoryDatabase } from './in-memory-database'
import { SqliteDatabase } from './sqlite-database'

/**
 * Select the database driver for the current platform.
 *
 * - Native app (Android/iOS): real SQLite via @capacitor-community/sqlite.
 * - Browser (development/tests): non-persistent in-memory driver.
 */
export function createDatabase(): Database {
  return Capacitor.isNativePlatform() ? new SqliteDatabase() : new InMemoryDatabase()
}
