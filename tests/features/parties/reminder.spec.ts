import { describe, expect, it } from 'vitest'
import { reminderAt, reminderId } from '~/features/parties/services/reminder'

const NOW = new Date('2026-08-01T00:00:00')

describe('reminderAt', () => {
  it('returns one day before the start for a future dated party', () => {
    const at = reminderAt({ date: '2026-08-20', startTime: '18:00' }, NOW)
    expect(at?.getFullYear()).toBe(2026)
    expect(at?.getMonth()).toBe(7)
    expect(at?.getDate()).toBe(19)
    expect(at?.getHours()).toBe(18)
  })

  it('defaults to 10:00 when the party has no start time', () => {
    const at = reminderAt({ date: '2026-08-20', startTime: null }, NOW)
    expect(at?.getDate()).toBe(19)
    expect(at?.getHours()).toBe(10)
  })

  it('is null without a date and when the reminder time has passed', () => {
    expect(reminderAt({ date: null, startTime: '18:00' }, NOW)).toBeNull()
    expect(reminderAt({ date: '2026-08-01', startTime: '18:00' }, NOW)).toBeNull()
  })
})

describe('reminderId', () => {
  it('is a stable, positive id per party id', () => {
    expect(reminderId('abc')).toBe(reminderId('abc'))
    expect(reminderId('abc')).toBeGreaterThanOrEqual(0)
    expect(reminderId('abc')).not.toBe(reminderId('abd'))
  })
})
