import { describe, expect, it } from 'vitest'
import { addPartyReceived } from '~/infrastructure/migration/add-party-received'
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

describe('addPartyReceived migration', () => {
  it('is registered as version 6', () => {
    expect(addPartyReceived.version).toBe(6)
    expect(migrations).toContain(addPartyReceived)
  })

  it('adds a received flag column defaulting to 0', async () => {
    const database = new RecordingDatabase()
    await database.open()

    await addPartyReceived.up(database)

    const sql = database.statements.join('\n')
    expect(sql).toContain('ALTER TABLE parties ADD COLUMN received INTEGER')
    expect(sql).toContain('DEFAULT 0')
  })

  it('is applied by the migration runner and bumps the schema version', async () => {
    const database: Database = new InMemoryDatabase()
    await database.open()

    const result = await runMigrations(database, migrations)

    expect(result.version).toBe(6)
    expect(result.applied).toContain(addPartyReceived)
    expect(await database.getSchemaVersion()).toBe(6)
  })
})
