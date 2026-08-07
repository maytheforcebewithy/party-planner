import { describe, expect, it } from 'vitest'
import { addPartyLinkImage } from '~/infrastructure/migration/add-party-link-image'
import { migrations } from '~/infrastructure/migration/migrations'
import { runMigrations } from '~/infrastructure/migration/migration-runner'
import { InMemoryDatabase } from '~/infrastructure/database/in-memory-database'
import type { Database, SqlValue } from '~/infrastructure/database/database'

class RecordingDatabase extends InMemoryDatabase {
  readonly statements: string[] = []

  override execute(sql: string, params?: readonly SqlValue[]): Promise<void> {
    this.statements.push(sql)
    return super.execute(sql, params)
  }
}

describe('addPartyLinkImage migration', () => {
  it('is registered as version 5', () => {
    expect(addPartyLinkImage.version).toBe(5)
    expect(migrations).toContain(addPartyLinkImage)
  })

  it('adds nullable image and link columns when applied', async () => {
    const database = new RecordingDatabase()
    await database.open()

    await addPartyLinkImage.up(database)

    const sql = database.statements.join('\n')
    expect(sql).toContain('ALTER TABLE parties ADD COLUMN image TEXT')
    expect(sql).toContain('ALTER TABLE parties ADD COLUMN link TEXT')
  })

  it('is applied by the migration runner and bumps the schema version', async () => {
    const database: Database = new InMemoryDatabase()
    await database.open()

    const result = await runMigrations(database, migrations)

    expect(result.version).toBe(5)
    expect(result.applied).toContain(addPartyLinkImage)
    expect(await database.getSchemaVersion()).toBe(5)
  })
})
