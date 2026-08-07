import type { Migration } from './migration'

/**
 * v2 - add optional party detail fields. Times are stored as `HH:MM` strings
 * when present, and all three columns remain nullable for draft parties.
 */
export const addPartyDetails: Migration = {
  version: 2,
  name: 'add-party-details',
  async up(database) {
    await database.execute('ALTER TABLE parties ADD COLUMN start_time TEXT;')
    await database.execute('ALTER TABLE parties ADD COLUMN end_time TEXT;')
    await database.execute('ALTER TABLE parties ADD COLUMN hinweise TEXT;')
  },
}
