import { createPartyRepository } from '~/infrastructure/repositories/create-party-repository'
import type { PartyRepository } from '../repositories/party-repository'

let instance: PartyRepository | undefined

/**
 * Returns the process-wide party repository, built once from the app database
 * (`$database`, provided by the database plugin). Memoised so the in-memory dev
 * store keeps its data across calls within a session.
 */
export function usePartyRepository(): PartyRepository {
  if (!instance) {
    const { $database } = useNuxtApp()
    instance = createPartyRepository($database)
  }
  return instance
}

/** Test-only seam: drop the memoised instance so each test starts clean. */
export function resetPartyRepository(): void {
  instance = undefined
}
