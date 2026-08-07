import type { Party } from '../types/party'

export interface PartitionedParties {
  /** Today or later, plus undated parties; soonest first, undated last. */
  readonly upcoming: readonly Party[]
  /** Strictly before today; most recent first. */
  readonly past: readonly Party[]
}

/**
 * Split parties into upcoming vs past relative to `today` (ISO `yyyy-mm-dd`).
 * ISO date strings sort lexicographically, so plain string compare orders them.
 * Undated parties are treated as upcoming (they haven't happened) and sorted last.
 */
export function partitionParties(parties: readonly Party[], today: string): PartitionedParties {
  const upcoming: Party[] = []
  const past: Party[] = []

  for (const party of parties) {
    if (party.date && party.date < today) past.push(party)
    else upcoming.push(party)
  }

  upcoming.sort(byDateAscending)
  past.sort(byDateDescending)

  return { upcoming, past }
}

function byDateAscending(a: Party, b: Party): number {
  if (a.date === b.date) return 0
  if (!a.date) return 1
  if (!b.date) return -1
  return a.date < b.date ? -1 : 1
}

function byDateDescending(a: Party, b: Party): number {
  if (a.date === b.date) return 0
  if (!a.date) return 1
  if (!b.date) return -1
  return a.date > b.date ? -1 : 1
}
