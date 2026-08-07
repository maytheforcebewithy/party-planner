import { describe, expect, it } from 'vitest'
import { InMemoryDatabase } from '~/infrastructure/database/in-memory-database'
import { DatabaseError } from '~/infrastructure/database/database-error'

describe('InMemoryDatabase', () => {
  it('opens and reports its open state', async () => {
    const db = new InMemoryDatabase()
    expect(db.isOpen()).toBe(false)

    await db.open()

    expect(db.isOpen()).toBe(true)
    expect(await db.getSchemaVersion()).toBe(0)
  })

  it('stores and returns the schema version', async () => {
    const db = new InMemoryDatabase()
    await db.open()

    await db.setSchemaVersion(3)

    expect(await db.getSchemaVersion()).toBe(3)
  })

  it('rejects access when not open', async () => {
    const db = new InMemoryDatabase()

    await expect(db.getSchemaVersion()).rejects.toBeInstanceOf(DatabaseError)
    await expect(db.execute('SELECT 1')).rejects.toBeInstanceOf(DatabaseError)
  })

  it('closes', async () => {
    const db = new InMemoryDatabase()
    await db.open()

    await db.close()

    expect(db.isOpen()).toBe(false)
  })
})
