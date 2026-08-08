import { describe, expect, it } from 'vitest'
import { formatEventDate } from '~/features/parties/services/format-party'

describe('formatEventDate', () => {
  it('formats an ISO date for the German locale', () => {
    const formatted = formatEventDate('2026-08-15', 'de-DE')

    expect(formatted).toContain('August')
    expect(formatted).toContain('2026')
  })

  it('formats an ISO date for the English locale', () => {
    const formatted = formatEventDate('2026-08-15', 'en-US')

    expect(formatted).toContain('August')
    expect(formatted).toContain('2026')
  })

  it('keeps the same calendar day in a negative-offset timezone', () => {
    const original = process.env.TZ
    process.env.TZ = 'America/New_York'
    try {
      // A UTC parse would render this as 19 August; a local parse keeps 20.
      expect(formatEventDate('2026-08-20', 'de-DE')).toBe('20. August 2026')
    }
    finally {
      process.env.TZ = original
    }
  })

  it('returns the raw input when it cannot be parsed', () => {
    expect(formatEventDate('not-a-date', 'de-DE')).toBe('not-a-date')
    expect(formatEventDate('2026-13-40', 'de-DE')).toBe('2026-13-40')
  })
})
