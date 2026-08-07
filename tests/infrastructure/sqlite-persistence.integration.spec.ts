import { beforeEach, describe, expect, it } from 'vitest'
import { createSqlJsDatabase } from '../support/sqljs-database'
import { migrations } from '~/infrastructure/migration/migrations'
import { runMigrations } from '~/infrastructure/migration/migration-runner'
import { SqlitePartyRepository } from '~/infrastructure/repositories/sqlite-party-repository'
import { MigrationError } from '~/infrastructure/database/database-error'
import type { Database } from '~/infrastructure/database/database'
import type { Migration } from '~/infrastructure/migration/migration'
import type { CreateParty } from '~/features/parties/types/party'

const fullParty: CreateParty = {
  name: 'Sommerfest',
  date: '2026-08-20',
  location: 'Stadtpark',
  description: 'Grillen und Musik',
  startTime: '18:00',
  endTime: '23:30',
  hinweise: 'Decke mitbringen',
  icon: 'balloon',
  color: 'amber',
  image: null,
  link: 'https://open.spotify.com/x',
  received: true,
  attendance: 'yes',
  guests: [{ id: 'g1', name: 'Anna', rsvp: 'yes' }],
  shopping: [{ id: 's1', name: 'Brot', done: false, guestId: 'g1' }],
}

describe('SQLite persistence (real engine, migrations + repository)', () => {
  let database: Database

  beforeEach(async () => {
    database = await createSqlJsDatabase()
    await database.open()
    await runMigrations(database, migrations)
  })

  it('applies every migration and reaches the latest schema version', async () => {
    expect(await database.getSchemaVersion()).toBe(migrations.length)

    const columns = await database.query<{ name: string }>('PRAGMA table_info(parties);')
    const names = columns.map(column => column.name)
    expect(names).toEqual(expect.arrayContaining([
      'id', 'name', 'date', 'location', 'description', 'start_time', 'end_time',
      'hinweise', 'icon', 'color', 'image', 'link', 'received', 'attendance',
      'guests', 'shopping', 'created_at', 'updated_at',
    ]))
  })

  it('round-trips a fully-populated party through real SQL', async () => {
    const repository = new SqlitePartyRepository(database)

    const created = await repository.create(fullParty)
    const found = await repository.findById(created.id)

    expect(found).not.toBeNull()
    expect(found).toMatchObject({
      name: 'Sommerfest',
      date: '2026-08-20',
      location: 'Stadtpark',
      startTime: '18:00',
      endTime: '23:30',
      hinweise: 'Decke mitbringen',
      link: 'https://open.spotify.com/x',
      received: true,
      attendance: 'yes',
      guests: [{ id: 'g1', name: 'Anna', rsvp: 'yes' }],
      shopping: [{ id: 's1', name: 'Brot', done: false, guestId: 'g1' }],
    })
  })

  it('persists an attendance update and a delete', async () => {
    const repository = new SqlitePartyRepository(database)
    const created = await repository.create(fullParty)

    await repository.update(created.id, { attendance: 'no' })
    expect((await repository.findById(created.id))?.attendance).toBe('no')

    await repository.delete(created.id)
    expect(await repository.findById(created.id)).toBeNull()
  })

  it('lists all stored parties', async () => {
    const repository = new SqlitePartyRepository(database)
    await repository.create({ name: 'A' })
    await repository.create({ name: 'B' })

    const all = await repository.findAll()
    expect(all.map(party => party.name).sort()).toEqual(['A', 'B'])
  })

  it('rolls back a failing migration atomically, leaving the schema untouched', async () => {
    const fresh = await createSqlJsDatabase()
    await fresh.open()
    await fresh.execute('CREATE TABLE t (id INTEGER);')

    const badMigration: Migration = {
      version: 1,
      name: 'bad',
      async up(db) {
        await db.execute('ALTER TABLE t ADD COLUMN a TEXT;')
        await db.execute('THIS IS NOT VALID SQL;')
      },
    }

    await expect(runMigrations(fresh, [badMigration])).rejects.toBeInstanceOf(MigrationError)

    const columns = await fresh.query<{ name: string }>('PRAGMA table_info(t);')
    expect(columns.map(column => column.name)).toEqual(['id'])
    expect(await fresh.getSchemaVersion()).toBe(0)
  })
})
