import { Capacitor } from '@capacitor/core'
import type { PartyRepository } from '~/features/parties/repositories/party-repository'
import type { Database } from '~/infrastructure/database/database'
import { InMemoryPartyRepository } from './in-memory-party-repository'
import { SqlitePartyRepository } from './sqlite-party-repository'

/**
 * Select the party repository for the current platform, mirroring
 * `createDatabase()`:
 * - Native app (Android/iOS): persistent SQLite.
 * - Browser (development/tests): non-persistent in-memory store.
 */
export function createPartyRepository(database: Database): PartyRepository {
  return Capacitor.isNativePlatform()
    ? new SqlitePartyRepository(database)
    : new InMemoryPartyRepository()
}
