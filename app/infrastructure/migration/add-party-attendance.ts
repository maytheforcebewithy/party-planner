import type { Migration } from './migration'

/**
 * v7 — store your own reply to a received invitation ('yes' | 'maybe' | 'no').
 * Nullable and defaults to NULL: existing parties have no reply yet.
 */
export const addPartyAttendance: Migration = {
  version: 7,
  name: 'add-party-attendance',
  async up(database) {
    await database.execute('ALTER TABLE parties ADD COLUMN attendance TEXT DEFAULT NULL;')
  },
}
