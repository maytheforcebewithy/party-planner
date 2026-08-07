import type { PartyRepository } from '~/features/parties/repositories/party-repository'
import { PartyNotFoundError } from '~/features/parties/repositories/party-repository'
import type { CreateParty, Party, UpdateParty } from '~/features/parties/types/party'
import { createId } from '~/shared/utils/id'

/**
 * Map-backed party repository for browser/dev and tests. Not persisted across
 * reloads — the native app uses {@link SqlitePartyRepository} instead. Mirrors
 * the `InMemoryDatabase`/`SqliteDatabase` split so the domain works offline in
 * every environment.
 */
export class InMemoryPartyRepository implements PartyRepository {
  readonly #parties = new Map<string, Party>()

  findById(id: string): Promise<Party | null> {
    return Promise.resolve(this.#parties.get(id) ?? null)
  }

  findAll(): Promise<readonly Party[]> {
    return Promise.resolve([...this.#parties.values()])
  }

  create(data: CreateParty): Promise<Party> {
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
      createdAt: now,
      updatedAt: now,
    }
    this.#parties.set(party.id, party)
    return Promise.resolve(party)
  }

  update(id: string, changes: UpdateParty): Promise<Party> {
    const existing = this.#parties.get(id)
    if (!existing) return Promise.reject(new PartyNotFoundError(id))

    const updated: Party = {
      ...existing,
      name: changes.name ?? existing.name,
      date: changes.date === undefined ? existing.date : changes.date,
      location: changes.location === undefined ? existing.location : changes.location,
      description: changes.description === undefined ? existing.description : changes.description,
      startTime: changes.startTime === undefined ? existing.startTime : changes.startTime,
      endTime: changes.endTime === undefined ? existing.endTime : changes.endTime,
      hinweise: changes.hinweise === undefined ? existing.hinweise : changes.hinweise,
      updatedAt: new Date().toISOString(),
    }
    this.#parties.set(id, updated)
    return Promise.resolve(updated)
  }

  delete(id: string): Promise<void> {
    this.#parties.delete(id)
    return Promise.resolve()
  }
}
