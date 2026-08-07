import { usePartiesStore } from '../stores/parties-store'
import { buildDemoInvitation, buildDemoParty } from '../services/demo-party'
import type { Party } from '../types/party'

/**
 * Seeds the demo data for first-time exploration: a fully-populated own party
 * and a received invitation. Resolves with the own party (the one the empty
 * state opens).
 */
export function useDemoSeed() {
  const store = usePartiesStore()
  const { t } = useI18n()

  async function seedDemo(): Promise<Party> {
    const now = new Date()
    const party = await store.create(buildDemoParty(t, now))
    await store.create(buildDemoInvitation(t, now))
    return party
  }

  return { seedDemo }
}
