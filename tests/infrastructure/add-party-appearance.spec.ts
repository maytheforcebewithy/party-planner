import { describe, expect, it } from 'vitest'
import { addPartyAppearance } from '~/infrastructure/migration/add-party-appearance'
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

describe('addPartyAppearance migration', () => {
  it('is registered as version 3', () => {
    expect(addPartyAppearance.version).toBe(3)
    expect(migrations).toContain(addPartyAppearance)
  })

  it('adds nullable appearance columns when applied', async () => {
    const database = new RecordingDatabase()
    await database.open()

    await addPartyAppearance.up(database)

    const sql = database.statements.join('\n')
    expect(sql).toContain('ALTER TABLE parties ADD COLUMN icon TEXT')
    expect(sql).toContain('ALTER TABLE parties ADD COLUMN color TEXT')
  })

  it('is applied by the migration runner and bumps the schema version', async () => {
    const database: Database = new InMemoryDatabase()
    await database.open()

    const result = await runMigrations(database, migrations)

    expect(result.version).toBe(3)
    expect(result.applied).toContain(addPartyAppearance)
    expect(await database.getSchemaVersion()).toBe(3)
  })
})
