import type { PartyRepository } from '~/features/parties/repositories/party-repository'
import { PartyNotFoundError } from '~/features/parties/repositories/party-repository'
import type { CreateParty, Party, UpdateParty } from '~/features/parties/types/party'
import type { Database } from '~/infrastructure/database/database'
import { createId } from '~/shared/utils/id'

/** Column list shared by SELECT/INSERT; order matches {@link PartyRow}. */
const COLUMNS = 'id, name, date, location, description, created_at, updated_at'

/** Raw row shape as stored in SQLite (snake_case columns). */
interface PartyRow {
  readonly id: string
  readonly name: string
  readonly date: string | null
  readonly location: string | null
  readonly description: string | null
  readonly created_at: string
  readonly updated_at: string
}

function toParty(row: PartyRow): Party {
  return {
    id: row.id,
    name: row.name,
    date: row.date,
    location: row.location,
    description: row.description,
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
      createdAt: now,
      updatedAt: now,
    }
    await this.#database.execute(
      `INSERT INTO parties (${COLUMNS}) VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [party.id, party.name, party.date, party.location, party.description, party.createdAt, party.updatedAt],
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
      updatedAt: new Date().toISOString(),
    }
    await this.#database.execute(
      'UPDATE parties SET name = ?, date = ?, location = ?, description = ?, updated_at = ? WHERE id = ?;',
      [updated.name, updated.date, updated.location, updated.description, updated.updatedAt, updated.id],
    )
    return updated
  }

  async delete(id: string): Promise<void> {
    await this.#database.execute('DELETE FROM parties WHERE id = ?;', [id])
  }
}
