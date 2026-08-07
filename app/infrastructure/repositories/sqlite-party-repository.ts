import type { PartyRepository } from '~/features/parties/repositories/party-repository'
import { PartyNotFoundError } from '~/features/parties/repositories/party-repository'
import type { CreateParty, Party, UpdateParty } from '~/features/parties/types/party'
import type { Guest, GuestRsvp, ShoppingItem } from '~/features/parties/types/party-lists'
import type { Database } from '~/infrastructure/database/database'
import { createId } from '~/shared/utils/id'

/** Column list shared by SELECT/INSERT; order matches {@link PartyRow}. */
const COLUMNS = 'id, name, date, location, description, start_time, end_time, hinweise, icon, color, guests, shopping, created_at, updated_at'

const RSVP_VALUES: readonly GuestRsvp[] = ['yes', 'pending', 'no']

/** Raw row shape as stored in SQLite (snake_case columns). */
interface PartyRow {
  readonly id: string
  readonly name: string
  readonly date: string | null
  readonly location: string | null
  readonly description: string | null
  readonly start_time: string | null
  readonly end_time: string | null
  readonly hinweise: string | null
  readonly icon: string | null
  readonly color: string | null
  /** JSON-encoded sub-collections; `null` for rows created before v4. */
  readonly guests: string | null
  readonly shopping: string | null
  readonly created_at: string
  readonly updated_at: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function parseArray(raw: string | null): unknown[] {
  if (!raw) return []
  try {
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  }
  catch {
    return []
  }
}

/** Parse stored guests, dropping malformed entries and coercing the RSVP. */
function parseGuests(raw: string | null): Guest[] {
  return parseArray(raw).flatMap((entry) => {
    if (!isRecord(entry) || typeof entry.id !== 'string' || typeof entry.name !== 'string') return []
    const rsvp = RSVP_VALUES.includes(entry.rsvp as GuestRsvp) ? (entry.rsvp as GuestRsvp) : 'pending'
    return [{ id: entry.id, name: entry.name, rsvp }]
  })
}

function parseShopping(raw: string | null): ShoppingItem[] {
  return parseArray(raw).flatMap((entry) => {
    if (!isRecord(entry) || typeof entry.id !== 'string' || typeof entry.name !== 'string') return []
    const guestId = typeof entry.guestId === 'string' ? entry.guestId : null
    return [{ id: entry.id, name: entry.name, done: entry.done === true, guestId }]
  })
}

function serialize(list: readonly unknown[]): string {
  return JSON.stringify(list)
}

function toParty(row: PartyRow): Party {
  return {
    id: row.id,
    name: row.name,
    date: row.date,
    location: row.location,
    description: row.description,
    startTime: row.start_time,
    endTime: row.end_time,
    hinweise: row.hinweise,
    icon: row.icon,
    color: row.color,
    guests: parseGuests(row.guests),
    shopping: parseShopping(row.shopping),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

/**
 * SQLite-backed party repository for the native app. Talks only to the storage
 * agnostic {@link Database}; the migration runner owns the `parties` schema.
 */
export class SqlitePartyRepository implements PartyRepository {
  readonly #database: Database

  constructor(database: Database) {
    this.#database = database
  }

  async findById(id: string): Promise<Party | null> {
    const rows = await this.#database.query<PartyRow>(
      `SELECT ${COLUMNS} FROM parties WHERE id = ? LIMIT 1;`,
      [id],
    )
    const row = rows[0]
    return row ? toParty(row) : null
  }

  async findAll(): Promise<readonly Party[]> {
    const rows = await this.#database.query<PartyRow>(
      `SELECT ${COLUMNS} FROM parties ORDER BY created_at DESC;`,
    )
    return rows.map(toParty)
  }

  async create(data: CreateParty): Promise<Party> {
    const now = new Date().toISOString()
    const party: Party = {
      id: createId(),
      name: data.name,
      date: data.date ?? null,
      location: data.location ?? null,
      description: data.description ?? null,
      startTime: data.startTime ?? null,
      endTime: data.endTime ?? null,
      hinweise: data.hinweise ?? null,
      icon: data.icon ?? null,
      color: data.color ?? null,
      guests: data.guests ?? [],
      shopping: data.shopping ?? [],
      createdAt: now,
      updatedAt: now,
    }
    await this.#database.execute(
      `INSERT INTO parties (${COLUMNS}) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        party.id,
        party.name,
        party.date,
        party.location,
        party.description,
        party.startTime,
        party.endTime,
        party.hinweise,
        party.icon,
        party.color,
        serialize(party.guests),
        serialize(party.shopping),
        party.createdAt,
        party.updatedAt,
      ],
    )
    return party
  }

  async update(id: string, changes: UpdateParty): Promise<Party> {
    const existing = await this.findById(id)
    if (!existing) throw new PartyNotFoundError(id)

    const updated: Party = {
      ...existing,
      name: changes.name ?? existing.name,
      date: changes.date === undefined ? existing.date : changes.date,
      location: changes.location === undefined ? existing.location : changes.location,
      description: changes.description === undefined ? existing.description : changes.description,
      startTime: changes.startTime === undefined ? existing.startTime : changes.startTime,
      endTime: changes.endTime === undefined ? existing.endTime : changes.endTime,
      hinweise: changes.hinweise === undefined ? existing.hinweise : changes.hinweise,
      icon: changes.icon === undefined ? existing.icon : changes.icon,
      color: changes.color === undefined ? existing.color : changes.color,
      guests: changes.guests === undefined ? existing.guests : changes.guests,
      shopping: changes.shopping === undefined ? existing.shopping : changes.shopping,
      updatedAt: new Date().toISOString(),
    }
    await this.#database.execute(
      'UPDATE parties SET name = ?, date = ?, location = ?, description = ?, start_time = ?, end_time = ?, hinweise = ?, icon = ?, color = ?, guests = ?, shopping = ?, updated_at = ? WHERE id = ?;',
      [
        updated.name,
        updated.date,
        updated.location,
        updated.description,
        updated.startTime,
        updated.endTime,
        updated.hinweise,
        updated.icon,
        updated.color,
        serialize(updated.guests),
        serialize(updated.shopping),
        updated.updatedAt,
        updated.id,
      ],
    )
    return updated
  }

  async delete(id: string): Promise<void> {
    await this.#database.execute('DELETE FROM parties WHERE id = ?;', [id])
  }
}
