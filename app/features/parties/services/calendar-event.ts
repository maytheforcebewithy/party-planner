import type { Party } from '../types/party'

/** Mime type for an iCalendar document (RFC 5545). */
export const CALENDAR_MIME_TYPE = 'text/calendar'

const PRODUCT_ID = '-//Party Planner//Party Planner//EN'
/** When only a start time is known, give the event a sensible default length. */
const DEFAULT_DURATION_MINUTES = 120
const MS_PER_MINUTE = 60_000
const MS_PER_DAY = 24 * 60 * MS_PER_MINUTE
/** RFC 5545 lines SHOULD be folded at 75 octets; continuation lines start with a space. */
const MAX_LINE_LENGTH = 75

interface DateParts { year: number, month: number, day: number }
interface TimeParts { hour: number, minute: number }

function parseIsoDate(iso: string): DateParts | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!match) return null
  return { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) }
}

function parseTime(time: string | null): TimeParts | null {
  if (!time) return null
  const match = /^(\d{2}):(\d{2})$/.exec(time)
  if (!match) return null
  const hour = Number(match[1])
  const minute = Number(match[2])
  if (hour > 23 || minute > 59) return null
  return { hour, minute }
}

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

/** `YYYYMMDD` for an all-day (date-only) value. */
function formatDate({ year, month, day }: DateParts): string {
  return `${year}${pad(month)}${pad(day)}`
}

/** Floating local `YYYYMMDDTHHMMSS` (no zone: the party is at that wall-clock time). */
function formatFloating(date: Date): string {
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}`
    + `T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}00`
}

/** UTC `YYYYMMDDTHHMMSSZ` for DTSTAMP. */
function formatUtcStamp(date: Date): string {
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}`
    + `T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`
}

/** Escape a text value per RFC 5545 (backslash, semicolon, comma, newline). */
function escapeText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n')
}

function foldLine(line: string): string {
  if (line.length <= MAX_LINE_LENGTH) return line
  const parts = [line.slice(0, MAX_LINE_LENGTH)]
  let rest = line.slice(MAX_LINE_LENGTH)
  while (rest.length > MAX_LINE_LENGTH - 1) {
    parts.push(` ${rest.slice(0, MAX_LINE_LENGTH - 1)}`)
    rest = rest.slice(MAX_LINE_LENGTH - 1)
  }
  if (rest.length) parts.push(` ${rest}`)
  return parts.join('\r\n')
}

/** The DTSTART/DTEND property lines for a party, timed or all-day. */
function eventDates(date: DateParts, party: Party): string[] {
  const start = parseTime(party.startTime)
  if (!start) {
    // Date only → an all-day event; DTEND is the exclusive next day (RFC 5545).
    const startUtc = Date.UTC(date.year, date.month - 1, date.day)
    const end = new Date(startUtc + MS_PER_DAY)
    return [
      `DTSTART;VALUE=DATE:${formatDate(date)}`,
      `DTEND;VALUE=DATE:${formatDate({ year: end.getUTCFullYear(), month: end.getUTCMonth() + 1, day: end.getUTCDate() })}`,
    ]
  }

  const startDate = new Date(Date.UTC(date.year, date.month - 1, date.day, start.hour, start.minute))
  const end = parseTime(party.endTime)
  let endDate = end
    ? new Date(Date.UTC(date.year, date.month - 1, date.day, end.hour, end.minute))
    : new Date(startDate.getTime() + DEFAULT_DURATION_MINUTES * MS_PER_MINUTE)
  // An end at or before the start means the party runs past midnight.
  if (endDate.getTime() <= startDate.getTime()) endDate = new Date(endDate.getTime() + MS_PER_DAY)

  return [`DTSTART:${formatFloating(startDate)}`, `DTEND:${formatFloating(endDate)}`]
}

/** The DESCRIPTION value: description, notes and link, whichever are set. */
function eventDescription(party: Party): string | null {
  const parts = [party.description, party.hinweise, party.link].filter((part): part is string => Boolean(part))
  return parts.length ? parts.join('\n\n') : null
}

/**
 * Build an iCalendar (.ics) document for a party so it can be added to the phone
 * calendar. Returns `null` when the party has no (parseable) date — an event
 * needs a date. Times are floating local wall-clock times; a party with only a
 * start time gets a {@link DEFAULT_DURATION_MINUTES}-minute default duration.
 */
export function buildCalendarEvent(party: Party, now: Date = new Date()): string | null {
  if (!party.date) return null
  const date = parseIsoDate(party.date)
  if (!date) return null

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:${PRODUCT_ID}`,
    'BEGIN:VEVENT',
    `UID:${party.id}@party-planner`,
    `DTSTAMP:${formatUtcStamp(now)}`,
    ...eventDates(date, party),
    `SUMMARY:${escapeText(party.name)}`,
  ]

  if (party.location) lines.push(`LOCATION:${escapeText(party.location)}`)
  const description = eventDescription(party)
  if (description) lines.push(`DESCRIPTION:${escapeText(description)}`)

  lines.push('END:VEVENT', 'END:VCALENDAR')

  return `${lines.map(foldLine).join('\r\n')}\r\n`
}
