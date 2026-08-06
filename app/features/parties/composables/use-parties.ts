import { usePartiesStore } from '../stores/parties-store'

/**
 * Page-facing view-model for the party list. Wraps the store and guarantees the
 * data is loaded once the consuming component mounts, so pages stay free of
 * loading orchestration.
 */
export function useParties() {
  const store = usePartiesStore()
  onMounted(() => {
    void store.ensureLoaded()
  })
  return store
}
