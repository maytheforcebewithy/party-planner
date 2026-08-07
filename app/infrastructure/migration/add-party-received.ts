import type { Migration } from './migration'

/**
 * v6 — mark whether a party is a received invitation (1) or an own party (0).
 * Defaults to 0 so all existing parties stay own parties.
 */
export const addPartyReceived: Migration = {
  version: 6,
  name: 'add-party-received',
  async up(database) {
    await database.execute('ALTER TABLE parties ADD COLUMN received INTEGER DEFAULT 0;')
  },
}
