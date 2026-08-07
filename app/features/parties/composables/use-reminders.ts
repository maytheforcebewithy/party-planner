import { Capacitor } from '@capacitor/core'
import { LocalNotifications } from '@capacitor/local-notifications'
import { reminderAt, reminderId } from '../services/reminder'
import type { Party } from '../types/party'

const STORAGE_KEY = 'party-planner.reminders'

function readIds(): string[] {
  if (!import.meta.client) return []
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : []
  }
  catch {
    return []
  }
}

/**
 * Per-party reminder toggle. On a device it schedules/cancels a local
 * notification (Capacitor) one day before the party; in the browser it just
 * remembers the preference (no scheduling). Which parties have a reminder is
 * persisted in localStorage so the toggle survives a restart.
 */
export function useReminders() {
  const { t } = useI18n()
  const ids = useState<string[]>('party-reminders', () => readIds())

  function has(partyId: string): boolean {
    return ids.value.includes(partyId)
  }

  function persist(next: string[]): void {
    ids.value = next
    if (import.meta.client) localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  /** Enable a reminder; false if the party has no future date or permission was denied. */
  async function enable(party: Party): Promise<boolean> {
    const at = reminderAt(party, new Date())
    if (!at) return false

    if (Capacitor.isNativePlatform()) {
      const permission = await LocalNotifications.requestPermissions()
      if (permission.display !== 'granted') return false
      await LocalNotifications.schedule({
        notifications: [{
          id: reminderId(party.id),
          title: t('reminder.title'),
          body: t('reminder.body', { name: party.name }),
          schedule: { at },
        }],
      })
    }

    if (!has(party.id)) persist([...ids.value, party.id])
    return true
  }

  async function disable(party: Party): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      await LocalNotifications.cancel({ notifications: [{ id: reminderId(party.id) }] })
    }
    persist(ids.value.filter(id => id !== party.id))
  }

  /** Flip the reminder; resolves with the new state (`true` = a reminder is set). */
  async function toggle(party: Party): Promise<boolean> {
    if (has(party.id)) {
      await disable(party)
      return false
    }
    return enable(party)
  }

  return { has, enable, disable, toggle }
}
