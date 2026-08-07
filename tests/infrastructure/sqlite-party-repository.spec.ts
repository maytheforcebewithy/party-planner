import { beforeEach, describe, expect, it } from 'vitest'
import { SqlitePartyRepository } from '~/infrastructure/repositories/sqlite-party-repository'
import { PartyNotFoundError } from '~/features/parties/repositories/party-repository'
import type { Database, SqlValue } from '~/infrastructure/database/database'

interface ExecuteCall {
  readonly sql: string
  readonly params: readonly SqlValue[]
}

/**
 * Minimal fake `Database` that records `execute` calls and returns queued query
 * results, so the repository's SQL and row mapping can be asserted without a
 * native SQLite engine.
 */
class FakeDatabase implements Database {
  readonly executed: ExecuteCall[] = []
  #queryResults: unknown[][] = []

  queueQueryResult(rows: unknown[]): void {
    this.#queryResults.push(rows)
  }

  open(): Promise<void> {
    return Promise.resolve()
  }

  close(): Promise<void> {
    return Promise.resolve()
  }

  isOpen(): boolean {
    return true
  }

  execute(sql: string, params: readonly SqlValue[] = []): Promise<void> {
    this.executed.push({ sql, params })
    return Promise.resolve()
  }

  query<TRow>(_sql: string, _params?: readonly SqlValue[]): Promise<readonly TRow[]> {
    return Promise.resolve((this.#queryResults.shift() ?? []) as readonly TRow[])
  }

  getSchemaVersion(): Promise<number> {
    return Promise.resolve(1)
  }

  setSchemaVersion(): Promise<void> {
    return Promise.resolve()
  }
}

const sampleRow = {
  id: 'party-1',
  name: 'Birthday',
  date: '2026-08-15',
  location: 'Park',
  description: 'Bring salad',
  start_time: '18:00',
  end_time: '23:30',
  hinweise: 'No glass bottles',
  icon: 'star',
  color: 'sky',
  guests: '[{"id":"g1","name":"Anna","rsvp":"yes"}]',
  shopping: '[{"id":"s1","name":"Brot","done":false,"guestId":"g1"}]',
  created_at: '2026-08-01T10:00:00.000Z',
  updated_at: '2026-08-01T10:00:00.000Z',
}

describe('SqlitePartyRepository', () => {
  let database: FakeDatabase
  let repository: SqlitePartyRepository

  beforeEach(() => {
    database = new FakeDatabase()
    repository = new SqlitePartyRepository(database)
  })

  it('maps a snake_case row to the Party entity on findById', async () => {
    database.queueQueryResult([sampleRow])

    const party = await repository.findById('party-1')

    expect(party).toEqual({
      id: 'party-1',
      name: 'Birthday',
      date: '2026-08-15',
      location: 'Park',
      description: 'Bring salad',
      startTime: '18:00',
      endTime: '23:30',
      hinweise: 'No glass bottles',
      icon: 'star',
      color: 'sky',
      guests: [{ id: 'g1', name: 'Anna', rsvp: 'yes' }],
      shopping: [{ id: 's1', name: 'Brot', done: false, guestId: 'g1' }],
      createdAt: '2026-08-01T10:00:00.000Z',
      updatedAt: '2026-08-01T10:00:00.000Z',
    })
  })

  it('returns null when findById matches no row', async () => {
    database.queueQueryResult([])

    expect(await repository.findById('missing')).toBeNull()
  })

  it('maps every row on findAll', async () => {
    database.queueQueryResult([sampleRow, { ...sampleRow, id: 'party-2' }])

    const parties = await repository.findAll()

    expect(parties).toHaveLength(2)
    expect(parties.map(party => party.id)).toEqual(['party-1', 'party-2'])
  })

  it('inserts a generated id and optional fields on create', async () => {
    const party = await repository.create({
      name: 'Picnic',
      startTime: '18:00',
      endTime: '23:30',
      hinweise: 'No glass bottles',
    })

    const insert = database.executed.at(-1)
    expect(insert?.sql).toContain('INSERT INTO parties')
    expect(insert?.params).toEqual([
      party.id,
      'Picnic',
      null,
      null,
      null,
      '18:00',
      '23:30',
      'No glass bottles',
      null,
      null,
      '[]',
      '[]',
      party.createdAt,
      party.updatedAt,
    ])
    expect(party.id).toBeTruthy()
  })

  it('serialises the guest and shopping lists to JSON on create', async () => {
    const party = await repository.create({
      name: 'Picnic',
      guests: [{ id: 'g1', name: 'Anna', rsvp: 'yes' }],
      shopping: [{ id: 's1', name: 'Brot', done: false, guestId: 'g1' }],
    })

    const insert = database.executed.at(-1)
    expect(insert?.params).toContain('[{"id":"g1","name":"Anna","rsvp":"yes"}]')
    expect(insert?.params).toContain('[{"id":"s1","name":"Brot","done":false,"guestId":"g1"}]')
    expect(party.guests).toHaveLength(1)
  })

  it('tolerates malformed list JSON when mapping a row', async () => {
    database.queueQueryResult([{ ...sampleRow, guests: 'not json', shopping: null }])

    const party = await repository.findById('party-1')

    expect(party?.guests).toEqual([])
    expect(party?.shopping).toEqual([])
  })

  it('updates only provided fields and issues an UPDATE with the id last', async () => {
    database.queueQueryResult([sampleRow])

    const updated = await repository.update('party-1', { name: 'Renamed', location: null })

    expect(updated.name).toBe('Renamed')
    expect(updated.location).toBeNull()
    expect(updated.date).toBe('2026-08-15')
    expect(updated.startTime).toBe('18:00')
    expect(updated.endTime).toBe('23:30')
    expect(updated.hinweise).toBe('No glass bottles')
    const update = database.executed.at(-1)
    expect(update?.sql).toContain('UPDATE parties')
    expect(update?.params.at(-1)).toBe('party-1')
  })

  it('throws when updating an unknown party without issuing an UPDATE', async () => {
    database.queueQueryResult([])

    await expect(repository.update('missing', { name: 'X' })).rejects.toBeInstanceOf(PartyNotFoundError)
    expect(database.executed).toHaveLength(0)
  })

  it('deletes by id', async () => {
    await repository.delete('party-1')

    const del = database.executed.at(-1)
    expect(del?.sql).toContain('DELETE FROM parties')
    expect(del?.params).toEqual(['party-1'])
  })
})
