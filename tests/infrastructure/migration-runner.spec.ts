import { describe, expect, it } from 'vitest'
import { InMemoryDatabase } from '~/infrastructure/database/in-memory-database'
import type { Migration } from '~/infrastructure/migration/migration'
import { runMigrations } from '~/infrastructure/migration/migration-runner'
import { MigrationError } from '~/infrastructure/database/database-error'

function migration(version: number, applied: number[]): Migration {
  return {
    version,
    name: `migration-${version}`,
    up: () => {
      applied.push(version)
      return Promise.resolve()
    },
  }
}

async function openDatabase(): Promise<InMemoryDatabase> {
  const db = new InMemoryDatabase()
  await db.open()
  return db
}

describe('runMigrations', () => {
  it('does nothing for an empty migration list', async () => {
    const db = await openDatabase()

    const result = await runMigrations(db, [])

    expect(result.applied).toEqual([])
    expect(result.version).toBe(0)
    expect(await db.getSchemaVersion()).toBe(0)
  })

  it('applies pending migrations in ascending order and bumps the version', async () => {
    const db = await openDatabase()
    const applied: number[] = []

    const result = await runMigrations(db, [migration(2, applied), migration(1, applied)])

    expect(applied).toEqual([1, 2])
    expect(result.applied.map(m => m.version)).toEqual([1, 2])
    expect(await db.getSchemaVersion()).toBe(2)
  })

  it('skips migrations at or below the current version', async () => {
    const db = await openDatabase()
    await db.setSchemaVersion(1)
    const applied: number[] = []

    const result = await runMigrations(db, [migration(1, applied), migration(2, applied)])

    expect(applied).toEqual([2])
    expect(result.applied.map(m => m.version)).toEqual([2])
  })

  it('rejects duplicate versions before applying anything', async () => {
    const db = await openDatabase()
    const applied: number[] = []

    await expect(
      runMigrations(db, [migration(1, applied), migration(1, applied)]),
    ).rejects.toBeInstanceOf(MigrationError)
    expect(applied).toEqual([])
  })
})
