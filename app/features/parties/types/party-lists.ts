/**
 * Sub-collections embedded in a {@link Party}: the guest list and the shopping
 * list. They are stored with the party (serialised as JSON by the SQLite
 * repository) rather than as separate tables — they are only ever read and
 * edited in the context of their party.
 */

/** Whether a guest has confirmed. Cycled through in {@link RSVP_CYCLE} order. */
export type GuestRsvp = 'yes' | 'pending' | 'no'

/** Tap order when cycling a guest's status in the UI. */
export const RSVP_CYCLE: readonly GuestRsvp[] = ['pending', 'yes', 'no']

export interface Guest {
  readonly id: string
  readonly name: string
  readonly rsvp: GuestRsvp
}

export interface ShoppingItem {
  readonly id: string
  readonly name: string
  readonly done: boolean
  /** Id of the guest who brings it, or `null` when nobody is assigned yet. */
  readonly guestId: string | null
}
