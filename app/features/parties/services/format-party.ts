/**
 * Format an ISO date (`yyyy-mm-dd`, as produced by `<input type="date">`) as a
 * localised human date. Returns the raw input unchanged if it cannot be parsed,
 * so a malformed stored value never renders as "Invalid Date".
 */
export function formatEventDate(iso: string, locale: string): string {
  // Parse `yyyy-mm-dd` as a LOCAL date. `new Date('2026-08-20')` parses as UTC
  // midnight, which formats as the previous day in negative-offset timezones.
  const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!parts) return iso
  const year = Number(parts[1])
  const month = Number(parts[2])
  const day = Number(parts[3])
  const date = new Date(year, month - 1, day)
  // Reject impossible dates (e.g. month 13, day 40) that would silently roll over.
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return iso
  }
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}
