import { createId } from '~/shared/utils/id'
import type { Guest, GuestRsvp, ShoppingItem } from '../types/party-lists'
import { RSVP_CYCLE } from '../types/party-lists'

/**
 * Pure transformations for a party's guest and shopping lists. Each returns a
 * new array (never mutates), so callers can hand the result straight to the
 * repository. Blank names are ignored so the UI can bind an input directly.
 */

export function addGuest(guests: readonly Guest[], name: string): readonly Guest[] {
  const trimmed = name.trim()
  if (!trimmed) return guests
  return [...guests, { id: createId(), name: trimmed, rsvp: 'pending' }]
}

/** Advance a guest's RSVP to the next state in {@link RSVP_CYCLE}. */
export function cycleGuestRsvp(guests: readonly Guest[], id: string): readonly Guest[] {
  return guests.map((guest) => {
    if (guest.id !== id) return guest
    const next = RSVP_CYCLE[(RSVP_CYCLE.indexOf(guest.rsvp) + 1) % RSVP_CYCLE.length]
    return { ...guest, rsvp: next ?? guest.rsvp }
  })
}

export function removeGuest(guests: readonly Guest[], id: string): readonly Guest[] {
  return guests.filter(guest => guest.id !== id)
}

export function addShoppingItem(shopping: readonly ShoppingItem[], name: string): readonly ShoppingItem[] {
  const trimmed = name.trim()
  if (!trimmed) return shopping
  return [...shopping, { id: createId(), name: trimmed, done: false, guestId: null }]
}

export function toggleShoppingItem(shopping: readonly ShoppingItem[], id: string): readonly ShoppingItem[] {
  return shopping.map(item => (item.id === id ? { ...item, done: !item.done } : item))
}

/** Assign (or, with `null`, clear) the guest who brings a shopping item. */
export function assignShoppingItem(
  shopping: readonly ShoppingItem[],
  id: string,
  guestId: string | null,
): readonly ShoppingItem[] {
  return shopping.map(item => (item.id === id ? { ...item, guestId } : item))
}

export function removeShoppingItem(shopping: readonly ShoppingItem[], id: string): readonly ShoppingItem[] {
  return shopping.filter(item => item.id !== id)
}

/** Drop a removed guest's assignments so no item points at a missing guest. */
export function unassignGuest(shopping: readonly ShoppingItem[], guestId: string): readonly ShoppingItem[] {
  return shopping.map(item => (item.guestId === guestId ? { ...item, guestId: null } : item))
}

export function guestStats(guests: readonly Guest[]): { yes: number, total: number } {
  return { yes: guests.filter(guest => guest.rsvp === 'yes').length, total: guests.length }
}

export function shoppingStats(shopping: readonly ShoppingItem[]): { done: number, total: number } {
  return { done: shopping.filter(item => item.done).length, total: shopping.length }
}

/** Guest lookup by id, for showing who brings a shopping item. */
export function guestName(guests: readonly Guest[], guestId: string | null): string | null {
  if (!guestId) return null
  return guests.find(guest => guest.id === guestId)?.name ?? null
}

export type { GuestRsvp }
