import { describe, expect, it } from 'vitest'
import { addPartyAttendance } from '~/infrastructure/migration/add-party-attendance'
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

describe('addPartyAttendance migration', () => {
  it('is registered as version 7', () => {
    expect(addPartyAttendance.version).toBe(7)
    expect(migrations).toContain(addPartyAttendance)
  })

  it('adds a nullable attendance text column', async () => {
    const database = new RecordingDatabase()
    await database.open()

    await addPartyAttendance.up(database)

    const sql = database.statements.join('\n')
    expect(sql).toContain('ALTER TABLE parties ADD COLUMN attendance TEXT')
    expect(sql).toContain('DEFAULT NULL')
  })

  it('is applied by the migration runner and bumps the schema version', async () => {
    const database: Database = new InMemoryDatabase()
    await database.open()

    const result = await runMigrations(database, migrations)

    expect(result.version).toBeGreaterThanOrEqual(7)
    expect(result.applied).toContain(addPartyAttendance)
    expect(await database.getSchemaVersion()).toBe(result.version)
  })
})
