import { describe, expect, it } from 'vitest'
import { createPartiesTable } from '~/infrastructure/migration/create-parties-table'
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

describe('createPartiesTable migration', () => {
  it('is registered as version 1', () => {
    expect(createPartiesTable.version).toBe(1)
    expect(migrations).toContain(createPartiesTable)
  })

  it('creates the parties table when applied', async () => {
    const database = new RecordingDatabase()
    await database.open()

    await createPartiesTable.up(database)

    const sql = database.statements.join('\n')
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS parties')
    expect(sql).toContain('id TEXT PRIMARY KEY NOT NULL')
  })

  it('is applied by the migration runner and bumps the schema version', async () => {
    const database: Database = new InMemoryDatabase()
    await database.open()

    const result = await runMigrations(database, migrations)

    expect(result.version).toBe(1)
    expect(result.applied).toContain(createPartiesTable)
    expect(await database.getSchemaVersion()).toBe(1)
  })
})
