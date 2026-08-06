import type { CrudRepository } from '~/infrastructure/repositories/crud-repository'
import type { CreateParty, Party, UpdateParty } from '../types/party'

/**
 * Data access contract for parties. Interface only — concrete drivers live in
 * `infrastructure/` and are selected per platform. Stores/composables depend on
 * this, never on a concrete implementation or on the database.
 */
export type PartyRepository = CrudRepository<Party, string, CreateParty, UpdateParty>

/** Raised when an update/lookup targets a party id that does not exist. */
export class PartyNotFoundError extends Error {
  constructor(id: string) {
    super(`Party not found: ${id}`)
    this.name = 'PartyNotFoundError'
  }
}
