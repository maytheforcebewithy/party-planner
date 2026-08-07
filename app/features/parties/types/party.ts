import type { Guest, ShoppingItem } from './party-lists'

/** Your own reply to a received invitation; `null` until you answer. */
export type Attendance = 'yes' | 'maybe' | 'no'

/** Display order of the reply options in the UI. */
export const ATTENDANCE_OPTIONS: readonly Attendance[] = ['yes', 'maybe', 'no']

/**
 * A locally-stored party/event. Every field lives on-device; the `id` is a
 * locally generated UUID so an imported copy can be safely re-keyed (see the
 * product vision on import creating an independent local copy).
 *
 * Dates are ISO-8601 strings: `date` is the event date (nullable — a party may
 * be planned before a date is fixed); `createdAt`/`updatedAt` are set by the
 * repository and are never provided by callers.
 */
export interface Party {
  readonly id: string
  readonly name: string
  readonly date: string | null
  readonly location: string | null
  readonly description: string | null
  readonly startTime: string | null
  readonly endTime: string | null
  readonly hinweise: string | null
  /** Chosen icon/colour keys for the party's badge; `null` uses the defaults. */
  readonly icon: string | null
  readonly color: string | null
  /** A custom badge image as a data URL; when set it replaces the icon tile. */
  readonly image: string | null
  /** An optional related link (e.g. a Spotify playlist), normalised to a URL. */
  readonly link: string | null
  /** `true` for an invitation received from someone else; `false` for own parties. */
  readonly received: boolean
  /** Your own reply to a received invitation; `null` until answered. */
  readonly attendance: Attendance | null
  /** Embedded sub-collections; empty arrays when unused. */
  readonly guests: readonly Guest[]
  readonly shopping: readonly ShoppingItem[]
  readonly createdAt: string
  readonly updatedAt: string
}

/**
 * Fields a caller provides when creating a party. `id` and the timestamps are
 * assigned by the repository. Optional fields default to `null`.
 */
export interface CreateParty {
  readonly name: string
  readonly date?: string | null
  readonly location?: string | null
  readonly description?: string | null
  readonly startTime?: string | null
  readonly endTime?: string | null
  readonly hinweise?: string | null
  readonly icon?: string | null
  readonly color?: string | null
  readonly image?: string | null
  readonly link?: string | null
  readonly received?: boolean
  readonly attendance?: Attendance | null
  readonly guests?: readonly Guest[]
  readonly shopping?: readonly ShoppingItem[]
}

/** Mutable fields on an existing party. Omitted fields are left unchanged. */
export type UpdateParty = Partial<CreateParty>
