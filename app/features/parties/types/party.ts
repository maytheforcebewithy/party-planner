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
}

/** Mutable fields on an existing party. Omitted fields are left unchanged. */
export type UpdateParty = Partial<CreateParty>
