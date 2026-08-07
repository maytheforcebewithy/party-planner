/** Today as an ISO date string (`yyyy-mm-dd`), matching how event dates are stored. */
export function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}
