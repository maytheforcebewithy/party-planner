import type { Migration } from './migration'

/**
 * v5 — add the optional custom badge image (stored as a data URL) and a related
 * link. Both are nullable so existing parties stay valid.
 */
export const addPartyLinkImage: Migration = {
  version: 5,
  name: 'add-party-link-image',
  async up(database) {
    await database.execute('ALTER TABLE parties ADD COLUMN image TEXT;')
    await database.execute('ALTER TABLE parties ADD COLUMN link TEXT;')
  },
}
