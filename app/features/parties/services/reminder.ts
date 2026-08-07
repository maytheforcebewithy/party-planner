/** Remind one day before the event. */
const REMIND_LEAD_MS = 24 * 60 * 60 * 1000
/** Assumed time when a party has a date but no start time. */
const DEFAULT_START = '10:00'

/**
 * When to fire a party's reminder (one day before the start), or `null` when the
 * party has no date or the reminder time is already in the past. Pure/testable;
 * the actual scheduling lives in `use-reminders`.
 */
export function reminderAt(
  party: { date: string | null, startTime: string | null },
  now: Date,
): Date | null {
  if (!party.date) return null
  const event = new Date(`${party.date}T${party.startTime ?? DEFAULT_START}`)
  if (Number.isNaN(event.getTime())) return null
  const remind = new Date(event.getTime() - REMIND_LEAD_MS)
  return remind > now ? remind : null
}

/** Stable positive notification id derived from a party's (string) id. */
export function reminderId(partyId: string): number {
  let hash = 0
  for (let i = 0; i < partyId.length; i++) {
    hash = (hash * 31 + partyId.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}
