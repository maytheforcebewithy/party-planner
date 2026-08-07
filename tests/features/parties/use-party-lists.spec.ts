import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryPartyRepository } from '~/infrastructure/repositories/in-memory-party-repository'

// Drive the real store against a fresh in-memory repository, like the store spec.
const repository = new InMemoryPartyRepository()
vi.mock('~/features/parties/composables/use-party-repository', () => ({
  usePartyRepository: () => repository,
}))

const { usePartiesStore } = await import('~/features/parties/stores/parties-store')
const { usePartyLists } = await import('~/features/parties/composables/use-party-lists')

describe('usePartyLists', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('adds a guest and shopping item and persists them through the store', async () => {
    const store = usePartiesStore()
    const party = await store.create({ name: 'Fest' })
    const lists = usePartyLists(party.id)

    await lists.addGuest('Anna')
    await lists.addShoppingItem('Brot')

    expect(lists.guests.value).toHaveLength(1)
    expect(lists.guestStats.value).toEqual({ yes: 0, total: 1 })
    expect(store.findById(party.id)?.shopping[0]?.name).toBe('Brot')
  })

  it('cycles an RSVP and unassigns items when the guest is removed', async () => {
    const store = usePartiesStore()
    const party = await store.create({ name: 'Fest' })
    const lists = usePartyLists(party.id)

    await lists.addGuest('Anna')
    const guestId = lists.guests.value[0]?.id ?? ''
    await lists.addShoppingItem('Brot')
    const itemId = lists.shopping.value[0]?.id ?? ''
    await lists.assignShoppingItem(itemId, guestId)
    await lists.cycleGuestRsvp(guestId)

    expect(lists.guests.value[0]?.rsvp).toBe('yes')

    await lists.removeGuest(guestId)

    expect(lists.guests.value).toHaveLength(0)
    expect(lists.shopping.value[0]?.guestId).toBeNull()
  })

  it('skips persisting a blank guest add', async () => {
    const store = usePartiesStore()
    const party = await store.create({ name: 'Fest' })
    const lists = usePartyLists(party.id)
    const before = store.findById(party.id)?.updatedAt

    await lists.addGuest('   ')

    expect(lists.guests.value).toHaveLength(0)
    expect(store.findById(party.id)?.updatedAt).toBe(before)
  })
})
