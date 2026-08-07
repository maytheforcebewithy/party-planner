import { describe, expect, it } from 'vitest'
import { addPartyDetails } from '~/infrastructure/migration/add-party-details'
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

describe('addPartyDetails migration', () => {
  it('is registered as version 2', () => {
    expect(addPartyDetails.version).toBe(2)
    expect(migrations).toContain(addPartyDetails)
  })

  it('adds nullable detail columns when applied', async () => {
    const database = new RecordingDatabase()
    await database.open()

    await addPartyDetails.up(database)

    const sql = database.statements.join('\n')
    expect(sql).toContain('ALTER TABLE parties ADD COLUMN start_time TEXT')
    expect(sql).toContain('ALTER TABLE parties ADD COLUMN end_time TEXT')
    expect(sql).toContain('ALTER TABLE parties ADD COLUMN hinweise TEXT')
  })

  it('is applied by the migration runner and bumps the schema version', async () => {
    const database: Database = new InMemoryDatabase()
    await database.open()

    const result = await runMigrations(database, migrations)

    expect(result.applied).toContain(addPartyDetails)
    expect(result.version).toBeGreaterThanOrEqual(2)
    expect(await database.getSchemaVersion()).toBe(result.version)
  })
})
