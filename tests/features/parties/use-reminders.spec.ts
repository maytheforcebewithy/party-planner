import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { Party } from '~/features/parties/types/party'

vi.mock('@capacitor/core', () => ({ Capacitor: { isNativePlatform: () => false } }))
vi.mock('@capacitor/local-notifications', () => ({
  LocalNotifications: { requestPermissions: vi.fn(), schedule: vi.fn(), cancel: vi.fn() },
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
  hinweise: null,
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

describe('useReminders', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('toggles a reminder for a future party and persists it', async () => {
    const reminders = await make()
    const party = mkParty({ id: 'p1', date: '2999-01-01', startTime: '18:00' })

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
})
