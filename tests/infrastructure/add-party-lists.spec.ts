import { describe, expect, it } from 'vitest'
import { addPartyLists } from '~/infrastructure/migration/add-party-lists'
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

describe('addPartyLists migration', () => {
  it('is registered as version 4', () => {
    expect(addPartyLists.version).toBe(4)
    expect(migrations).toContain(addPartyLists)
  })

  it('adds JSON list columns with an empty-array default', async () => {
    const database = new RecordingDatabase()
    await database.open()

    await addPartyLists.up(database)

    const sql = database.statements.join('\n')
    expect(sql).toContain('ALTER TABLE parties ADD COLUMN guests TEXT')
    expect(sql).toContain('ALTER TABLE parties ADD COLUMN shopping TEXT')
    expect(sql).toContain(`DEFAULT '[]'`)
  })

  it('is applied by the migration runner and bumps the schema version', async () => {
    const database: Database = new InMemoryDatabase()
    await database.open()

    const result = await runMigrations(database, migrations)

    expect(result.applied).toContain(addPartyLists)
    expect(result.version).toBeGreaterThanOrEqual(4)
    expect(await database.getSchemaVersion()).toBe(result.version)
  })
})
