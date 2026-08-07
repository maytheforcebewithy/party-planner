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

  it('returns the raw input when it cannot be parsed', () => {
    expect(formatEventDate('not-a-date', 'de-DE')).toBe('not-a-date')
  })
})
