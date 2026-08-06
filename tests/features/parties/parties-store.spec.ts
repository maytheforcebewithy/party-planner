import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryPartyRepository } from '~/infrastructure/repositories/in-memory-party-repository'

// The store resolves its repository through the composable; swap in a fresh
// in-memory repository so store logic is tested without a Nuxt app/database.
const repository = new InMemoryPartyRepository()
vi.mock('~/features/parties/composables/use-party-repository', () => ({
  usePartyRepository: () => repository,
}))

const { usePartiesStore } = await import('~/features/parties/stores/parties-store')

describe('parties store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts empty', () => {
    const store = usePartiesStore()

    expect(store.parties).toHaveLength(0)
    expect(store.partyCount).toBe(0)
    expect(store.isLoading).toBe(false)
  })

  it('creates a party and prepends it to the list', async () => {
    const store = usePartiesStore()

    const first = await store.create({ name: 'One' })
    const second = await store.create({ name: 'Two' })

    expect(store.parties.map(party => party.id)).toEqual([second.id, first.id])
    expect(store.partyCount).toBe(2)
  })

  it('loads all parties from the repository', async () => {
    await repository.create({ name: 'Persisted' })
    const store = usePartiesStore()

    await store.loadAll()

    expect(store.parties.some(party => party.name === 'Persisted')).toBe(true)
    expect(store.isLoading).toBe(false)
  })

  it('updates a party in place', async () => {
    const store = usePartiesStore()
    const created = await store.create({ name: 'Old' })

    const updated = await store.update(created.id, { name: 'New' })

    expect(updated.name).toBe('New')
    expect(store.findById(created.id)?.name).toBe('New')
  })

  it('removes a party from the list', async () => {
    const store = usePartiesStore()
    const created = await store.create({ name: 'Doomed' })

    await store.remove(created.id)

    expect(store.findById(created.id)).toBeUndefined()
  })
})
