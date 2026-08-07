import { describe, expect, it } from 'vitest'
import {
  addGuest,
  addShoppingItem,
  assignShoppingItem,
  cycleGuestRsvp,
  guestName,
  guestStats,
  removeGuest,
  removeShoppingItem,
  shoppingStats,
  toggleShoppingItem,
  unassignGuest,
} from '~/features/parties/services/party-lists'
import type { Guest, ShoppingItem } from '~/features/parties/types/party-lists'

const guest = (id: string, rsvp: Guest['rsvp'] = 'pending'): Guest => ({ id, name: id, rsvp })
const item = (id: string, over: Partial<ShoppingItem> = {}): ShoppingItem =>
  ({ id, name: id, done: false, guestId: null, ...over })

describe('guest list operations', () => {
  it('adds a trimmed guest as pending and ignores blank names', () => {
    const once = addGuest([], '  Anna  ')
    expect(once).toEqual([{ id: expect.any(String), name: 'Anna', rsvp: 'pending' }])
    expect(addGuest(once, '   ')).toBe(once)
  })

  it('cycles a guest RSVP pending → yes → no → pending', () => {
    const yes = cycleGuestRsvp([guest('a')], 'a')
    const no = cycleGuestRsvp(yes, 'a')
    const pending = cycleGuestRsvp(no, 'a')
    expect([yes[0]?.rsvp, no[0]?.rsvp, pending[0]?.rsvp]).toEqual(['yes', 'no', 'pending'])
  })

  it('leaves other guests untouched when cycling an unknown id', () => {
    const guests = [guest('a', 'yes')]
    expect(cycleGuestRsvp(guests, 'missing')).toEqual(guests)
  })

  it('removes a guest by id', () => {
    expect(removeGuest([guest('a'), guest('b')], 'a')).toEqual([guest('b')])
  })

  it('counts confirmed guests', () => {
    expect(guestStats([guest('a', 'yes'), guest('b', 'no'), guest('c', 'yes')])).toEqual({ yes: 2, total: 3 })
    expect(guestStats([])).toEqual({ yes: 0, total: 0 })
  })
})

describe('shopping list operations', () => {
  it('adds a trimmed item as not-done and unassigned, ignoring blanks', () => {
    const once = addShoppingItem([], '  Brot ')
    expect(once).toEqual([{ id: expect.any(String), name: 'Brot', done: false, guestId: null }])
    expect(addShoppingItem(once, '  ')).toBe(once)
  })

  it('toggles the done flag', () => {
    const toggled = toggleShoppingItem([item('a')], 'a')
    expect(toggled[0]?.done).toBe(true)
    expect(toggleShoppingItem(toggled, 'a')[0]?.done).toBe(false)
  })

  it('assigns and clears the guest who brings an item', () => {
    const assigned = assignShoppingItem([item('a')], 'a', 'g1')
    expect(assigned[0]?.guestId).toBe('g1')
    expect(assignShoppingItem(assigned, 'a', null)[0]?.guestId).toBeNull()
  })

  it('removes an item by id', () => {
    expect(removeShoppingItem([item('a'), item('b')], 'a')).toEqual([item('b')])
  })

  it('unassigns only the removed guest, counting done items', () => {
    const shopping = [item('a', { guestId: 'g1', done: true }), item('b', { guestId: 'g2' })]
    const cleared = unassignGuest(shopping, 'g1')
    expect(cleared[0]?.guestId).toBeNull()
    expect(cleared[1]?.guestId).toBe('g2')
    expect(shoppingStats(cleared)).toEqual({ done: 1, total: 2 })
  })

  it('resolves a guest name, or null when unassigned or unknown', () => {
    const guests = [guest('g1')]
    expect(guestName(guests, 'g1')).toBe('g1')
    expect(guestName(guests, null)).toBeNull()
    expect(guestName(guests, 'missing')).toBeNull()
  })
})
