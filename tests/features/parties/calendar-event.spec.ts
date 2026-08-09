import { describe, expect, it } from 'vitest'
import { buildCalendarEvent } from '~/features/parties/services/calendar-event'
import type { Party } from '~/features/parties/types/party'

const base: Party = {
  id: 'p1',
  name: 'Gartenparty',
  date: null,
  location: null,
  description: null,
  startTime: null,
  endTime: null,
  notes: null,
  icon: null,
  color: null,
  image: null,
  link: null,
  received: false,
  guests: [],
  shopping: [],
  createdAt: '',
  updatedAt: '',
}

// Fixed timestamp so DTSTAMP is deterministic.
const now = new Date(Date.UTC(2026, 7, 1, 10, 30, 15))

/** Build an event, failing the test if none is produced (narrows to string). */
function build(party: Partial<Party>): string {
  const ics = buildCalendarEvent({ ...base, ...party }, now)
  if (ics === null) throw new Error('expected a calendar event')
  return ics
}

/** Pull a single iCalendar property line (matches both `NAME:` and `NAME;`). */
function prop(ics: string, name: string): string | undefined {
  return ics.split('\r\n').find(line => line.startsWith(`${name}:`) || line.startsWith(`${name};`))
}

describe('buildCalendarEvent', () => {
  it('returns null when the party has no date', () => {
    expect(buildCalendarEvent(base, now)).toBeNull()
  })

  it('returns null when the date is not a valid ISO date', () => {
    expect(buildCalendarEvent({ ...base, date: '20-08-2026' }, now)).toBeNull()
  })

  it('wraps a valid VCALENDAR/VEVENT with a stable UID and DTSTAMP', () => {
    const ics = build({ date: '2026-08-20' })
    expect(ics.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true)
    expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true)
    expect(ics).toContain('BEGIN:VEVENT')
    expect(prop(ics, 'UID')).toBe('UID:p1@party-planner')
    expect(prop(ics, 'DTSTAMP')).toBe('DTSTAMP:20260801T103015Z')
    expect(prop(ics, 'SUMMARY')).toBe('SUMMARY:Gartenparty')
  })

  it('emits an all-day event (exclusive next-day DTEND) when no time is set', () => {
    const ics = build({ date: '2026-08-20' })
    expect(prop(ics, 'DTSTART')).toBe('DTSTART;VALUE=DATE:20260820')
    expect(prop(ics, 'DTEND')).toBe('DTEND;VALUE=DATE:20260821')
  })

  it('rolls the all-day DTEND over a month boundary', () => {
    const ics = build({ date: '2026-08-31' })
    expect(prop(ics, 'DTEND')).toBe('DTEND;VALUE=DATE:20260901')
  })

  it('emits a floating timed event with start and end', () => {
    const ics = build({ date: '2026-08-20', startTime: '18:00', endTime: '23:30' })
    expect(prop(ics, 'DTSTART')).toBe('DTSTART:20260820T180000')
    expect(prop(ics, 'DTEND')).toBe('DTEND:20260820T233000')
  })

  it('defaults to a two-hour duration when only a start time is set', () => {
    const ics = build({ date: '2026-08-20', startTime: '18:00' })
    expect(prop(ics, 'DTEND')).toBe('DTEND:20260820T200000')
  })

  it('pushes DTEND to the next day when the end is at or before the start (past midnight)', () => {
    const ics = build({ date: '2026-08-20', startTime: '23:00', endTime: '01:00' })
    expect(prop(ics, 'DTSTART')).toBe('DTSTART:20260820T230000')
    expect(prop(ics, 'DTEND')).toBe('DTEND:20260821T010000')
  })

  it('treats an unparseable start time as an all-day event', () => {
    const ics = build({ date: '2026-08-20', startTime: '6pm' })
    expect(prop(ics, 'DTSTART')).toBe('DTSTART;VALUE=DATE:20260820')
  })

  it('includes location and combines description, notes and link into DESCRIPTION', () => {
    const ics = build({
      date: '2026-08-20',
      location: 'Stadtpark',
      description: 'Grillen',
      notes: 'Decke mitbringen',
      link: 'https://open.spotify.com/x',
    })
    expect(prop(ics, 'LOCATION')).toBe('LOCATION:Stadtpark')
    expect(prop(ics, 'DESCRIPTION')).toBe('DESCRIPTION:Grillen\\n\\nDecke mitbringen\\n\\nhttps://open.spotify.com/x')
  })

  it('escapes special characters per RFC 5545', () => {
    const ics = build({ date: '2026-08-20', name: 'Anna; Ben, & Co\\Crew', description: 'Zeile 1\nZeile 2' })
    expect(prop(ics, 'SUMMARY')).toBe('SUMMARY:Anna\\; Ben\\, & Co\\\\Crew')
    expect(prop(ics, 'DESCRIPTION')).toBe('DESCRIPTION:Zeile 1\\nZeile 2')
  })

  it('folds long lines at 75 octets, never splitting a multibyte character', () => {
    const encoder = new TextEncoder()
    const ics = build({ date: '2026-08-20', name: '🎉'.repeat(60), description: 'x'.repeat(200) })
    const lines = ics.split('\r\n')

    // Every physical line is within the 75-octet limit (measured in UTF-8 bytes).
    for (const line of lines) expect(encoder.encode(line).byteLength).toBeLessThanOrEqual(75)

    const descIndex = lines.findIndex(line => line.startsWith('DESCRIPTION:'))
    expect(lines[descIndex + 1]?.startsWith(' ')).toBe(true)

    // Unfolding (drop CRLF + the continuation space) rebuilds the emoji summary
    // intact — proving no surrogate pair was cut mid-character.
    expect(ics.replace(/\r\n /g, '')).toContain(`SUMMARY:${'🎉'.repeat(60)}`)
  })
})
