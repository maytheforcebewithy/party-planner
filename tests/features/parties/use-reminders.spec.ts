import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { Party } from '~/features/parties/types/party'

const { isNativePlatform } = vi.hoisted(() => ({ isNativePlatform: vi.fn(() => false) }))
vi.mock('@capacitor/core', () => ({ Capacitor: { isNativePlatform } }))

const { requestPermissions, schedule, cancel } = vi.hoisted(() => ({
  requestPermissions: vi.fn(),
  schedule: vi.fn(),
  cancel: vi.fn(),
}))
vi.mock('@capacitor/local-notifications', () => ({
  LocalNotifications: { requestPermissions, schedule, cancel },
}))

const { useReminders } = await import('~/features/parties/composables/use-reminders')

const mkParty = (over: Partial<Party>): Party => ({
  id: 'p',
  name: 'Party',
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
  ...over,
})

async function make(): Promise<ReturnType<typeof useReminders>> {
  let api: ReturnType<typeof useReminders> | undefined
  await mountSuspended(defineComponent({
    setup() {
      api = useReminders()
      return () => null
    },
  }))
  if (!api) throw new Error('composable did not initialise')
  return api
}

const futureParty = (id: string): Party => mkParty({ id, date: '2999-01-01', startTime: '18:00' })

describe('useReminders', () => {
  beforeEach(() => {
    localStorage.clear()
    isNativePlatform.mockReturnValue(false)
    requestPermissions.mockReset()
    schedule.mockReset()
    cancel.mockReset()
  })

  it('toggles a reminder for a future party and persists it', async () => {
    const reminders = await make()
    const party = futureParty('p1')

    expect(await reminders.toggle(party)).toBe(true)
    expect(reminders.has('p1')).toBe(true)
    expect(JSON.parse(localStorage.getItem('party-planner.reminders') ?? '[]')).toContain('p1')

    expect(await reminders.toggle(party)).toBe(false)
    expect(reminders.has('p1')).toBe(false)
  })

  it('does not enable a reminder for a party without a date', async () => {
    const reminders = await make()

    expect(await reminders.enable(mkParty({ id: 'p2', date: null }))).toBe(false)
    expect(reminders.has('p2')).toBe(false)
  })

  it('schedules a native notification when enabling on a device', async () => {
    isNativePlatform.mockReturnValue(true)
    requestPermissions.mockResolvedValue({ display: 'granted' })
    const reminders = await make()

    expect(await reminders.enable(futureParty('p3'))).toBe(true)
    expect(schedule).toHaveBeenCalledOnce()
    expect(reminders.has('p3')).toBe(true)
  })

  it('does not enable when notification permission is denied on a device', async () => {
    isNativePlatform.mockReturnValue(true)
    requestPermissions.mockResolvedValue({ display: 'denied' })
    const reminders = await make()

    expect(await reminders.enable(futureParty('p4'))).toBe(false)
    expect(schedule).not.toHaveBeenCalled()
    expect(reminders.has('p4')).toBe(false)
  })

  it('cancels the native notification when disabling on a device', async () => {
    isNativePlatform.mockReturnValue(true)
    requestPermissions.mockResolvedValue({ display: 'granted' })
    const reminders = await make()
    const party = futureParty('p5')
    await reminders.enable(party)

    await reminders.disable(party)

    expect(cancel).toHaveBeenCalledOnce()
    expect(reminders.has('p5')).toBe(false)
  })
})
