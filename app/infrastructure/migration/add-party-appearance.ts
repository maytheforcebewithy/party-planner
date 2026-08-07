import type { Migration } from './migration'

/**
 * v3 — add the party's badge appearance. `icon` and `color` store keys from the
 * appearance catalogue (see `features/parties/config/party-appearance`); both
 * stay nullable so existing parties fall back to the defaults.
 */
export const addPartyAppearance: Migration = {
  version: 3,
  name: 'add-party-appearance',
  async up(database) {
    await database.execute('ALTER TABLE parties ADD COLUMN icon TEXT;')
    await database.execute('ALTER TABLE parties ADD COLUMN color TEXT;')
  },
}
