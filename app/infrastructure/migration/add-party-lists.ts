import type { Migration } from './migration'

/**
 * v4 — add the embedded guest and shopping lists. Both are stored as JSON text
 * (arrays) and default to an empty list so existing parties stay valid.
 */
export const addPartyLists: Migration = {
  version: 4,
  name: 'add-party-lists',
  async up(database) {
    await database.execute(`ALTER TABLE parties ADD COLUMN guests TEXT DEFAULT '[]';`)
    await database.execute(`ALTER TABLE parties ADD COLUMN shopping TEXT DEFAULT '[]';`)
  },
}
