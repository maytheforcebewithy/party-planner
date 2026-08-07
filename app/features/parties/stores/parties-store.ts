import { usePartyRepository } from '../composables/use-party-repository'
import type { CreateParty, Party, UpdateParty } from '../types/party'

/**
 * Feature store for parties. Holds the in-memory view of the party list and
 * delegates all persistence to the {@link PartyRepository}; it never touches the
 * database directly. Local list updates keep the UI in sync without a reload.
 */
export const usePartiesStore = defineStore('parties', () => {
  const repository = usePartyRepository()

  const parties = ref<Party[]>([])
  const isLoading = ref(false)
  const loaded = ref(false)

  const partyCount = computed(() => parties.value.length)

  async function loadAll(): Promise<void> {
    isLoading.value = true
    try {
      parties.value = [...await repository.findAll()]
      loaded.value = true
    }
    finally {
      isLoading.value = false
    }
  }

  /** Load once per session; subsequent calls are a no-op. */
  async function ensureLoaded(): Promise<void> {
    if (loaded.value) return
    await loadAll()
  }

  function findById(id: string): Party | undefined {
    return parties.value.find(party => party.id === id)
  }

  async function create(data: CreateParty): Promise<Party> {
    const party = await repository.create(data)
    parties.value = [party, ...parties.value]
    return party
  }

  async function update(id: string, changes: UpdateParty): Promise<Party> {
    const updated = await repository.update(id, changes)
    parties.value = parties.value.map(party => (party.id === id ? updated : party))
    return updated
  }

  async function remove(id: string): Promise<void> {
    await repository.delete(id)
    parties.value = parties.value.filter(party => party.id !== id)
  }

  /** Delete every party (used by the "delete all data" setting). */
  async function clearAll(): Promise<void> {
    for (const party of [...parties.value]) {
      await repository.delete(party.id)
    }
    parties.value = []
  }

  return { parties, isLoading, loaded, partyCount, loadAll, ensureLoaded, findById, create, update, remove, clearAll }
})
