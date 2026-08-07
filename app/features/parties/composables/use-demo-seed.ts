import { usePartiesStore } from '../stores/parties-store'
import { buildDemoParty } from '../services/demo-party'
import type { Party } from '../types/party'

/** Seeds one fully-populated demo party into the store for exploration. */
export function useDemoSeed() {
  const store = usePartiesStore()
  const { t } = useI18n()

  function seedDemo(): Promise<Party> {
    return store.create(buildDemoParty(t, new Date()))
  }

  return { seedDemo }
}
