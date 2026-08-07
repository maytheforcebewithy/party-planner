/**
 * Format an ISO date (`yyyy-mm-dd`, as produced by `<input type="date">`) as a
 * localised human date. Returns the raw input unchanged if it cannot be parsed,
 * so a malformed stored value never renders as "Invalid Date".
 */
export function formatEventDate(iso: string, locale: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}
