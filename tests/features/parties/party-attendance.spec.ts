import { describe, expect, it } from 'vitest'
import { coerceAttendance } from '~/features/parties/services/party-attendance'

describe('coerceAttendance', () => {
  it('keeps a known reply', () => {
    expect(coerceAttendance('yes')).toBe('yes')
    expect(coerceAttendance('maybe')).toBe('maybe')
    expect(coerceAttendance('no')).toBe('no')
  })

  it('returns null for an unknown, empty or non-string value', () => {
    expect(coerceAttendance('going')).toBeNull()
    expect(coerceAttendance('')).toBeNull()
    expect(coerceAttendance(null)).toBeNull()
    expect(coerceAttendance(undefined)).toBeNull()
    expect(coerceAttendance(1)).toBeNull()
  })
})
