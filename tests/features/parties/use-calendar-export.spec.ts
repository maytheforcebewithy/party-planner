import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Party } from '~/features/parties/types/party'

const saveOrShareFile = vi.fn(() => Promise.resolve())
vi.mock('~/shared/files/save-file', () => ({ saveOrShareFile }))

const { useCalendarExport } = await import('~/features/parties/composables/use-calendar-export')

const base: Party = {
  id: 'p1',
  name: 'Sommer Fest',
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

describe('useCalendarExport', () => {
  beforeEach(() => {
    saveOrShareFile.mockClear()
  })

  it('does nothing and reports false when the party has no date', async () => {
    const { exportToCalendar } = useCalendarExport()
    expect(await exportToCalendar(base)).toBe(false)
    expect(saveOrShareFile).not.toHaveBeenCalled()
  })

  it('saves an .ics file named after the party with the calendar mime type', async () => {
    const { exportToCalendar } = useCalendarExport()

    expect(await exportToCalendar({ ...base, date: '2026-08-20' })).toBe(true)

    const [content, filename, mimeType] = saveOrShareFile.mock.calls[0] as unknown as [string, string, string]
    expect(content).toContain('BEGIN:VCALENDAR')
    expect(filename).toBe('party-planner-sommer-fest.ics')
    expect(mimeType).toBe('text/calendar')
  })
})
