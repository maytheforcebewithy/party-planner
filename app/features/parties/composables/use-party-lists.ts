import { usePartiesStore } from '../stores/parties-store'
import * as lists from '../services/party-lists'
import type { UpdateParty } from '../types/party'

/**
 * View-model for a party's guest and shopping lists. Reads them from the store
 * and turns each edit into a persisted `update`, so components stay free of
 * store/repository details. No-op edits (e.g. adding a blank name) are skipped.
 */
export function usePartyLists(partyId: MaybeRefOrGetter<string>) {
  const store = usePartiesStore()
  const id = () => toValue(partyId)

  const party = computed(() => store.findById(id()))
  const guests = computed(() => party.value?.guests ?? [])
  const shopping = computed(() => party.value?.shopping ?? [])

  function persist(changes: UpdateParty): Promise<unknown> {
    return store.update(id(), changes)
  }

  return {
    guests,
    shopping,
    guestStats: computed(() => lists.guestStats(guests.value)),
    shoppingStats: computed(() => lists.shoppingStats(shopping.value)),
    guestName: (guestId: string | null) => lists.guestName(guests.value, guestId),

    addGuest(name: string): Promise<unknown> {
      const next = lists.addGuest(guests.value, name)
      return next === guests.value ? Promise.resolve() : persist({ guests: next })
    },
    cycleGuestRsvp: (guestId: string) => persist({ guests: lists.cycleGuestRsvp(guests.value, guestId) }),
    removeGuest: (guestId: string) => persist({
      guests: lists.removeGuest(guests.value, guestId),
      shopping: lists.unassignGuest(shopping.value, guestId),
    }),

    addShoppingItem(name: string): Promise<unknown> {
      const next = lists.addShoppingItem(shopping.value, name)
      return next === shopping.value ? Promise.resolve() : persist({ shopping: next })
    },
    toggleShoppingItem: (itemId: string) => persist({ shopping: lists.toggleShoppingItem(shopping.value, itemId) }),
    assignShoppingItem: (itemId: string, guestId: string | null) =>
      persist({ shopping: lists.assignShoppingItem(shopping.value, itemId, guestId) }),
    removeShoppingItem: (itemId: string) => persist({ shopping: lists.removeShoppingItem(shopping.value, itemId) }),
  }
}
