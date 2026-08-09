import { Capacitor } from '@capacitor/core'
import { LocalNotifications } from '@capacitor/local-notifications'

/**
 * Thin wrapper around the Capacitor local-notifications plugin, so feature code
 * never touches the native API directly (mirrors `shared/files`, `shared/sharing`).
 * Every function is a no-op off-device — in the browser we only remember the
 * preference and never schedule anything.
 */
export interface ScheduledNotification {
  readonly id: number
  readonly title: string
  readonly body: string
  readonly at: Date
}

/** Request permission to post notifications. Always granted off-device (no-op). */
export async function ensureNotificationPermission(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return true
  const permission = await LocalNotifications.requestPermissions()
  return permission.display === 'granted'
}

/** Schedule a local notification on a device; a no-op in the browser. */
export async function scheduleNotification(notification: ScheduledNotification): Promise<void> {
  if (!Capacitor.isNativePlatform()) return
  await LocalNotifications.schedule({
    notifications: [{
      id: notification.id,
      title: notification.title,
      body: notification.body,
      schedule: { at: notification.at },
    }],
  })
}

/** Cancel a scheduled local notification on a device; a no-op in the browser. */
export async function cancelNotification(id: number): Promise<void> {
  if (!Capacitor.isNativePlatform()) return
  await LocalNotifications.cancel({ notifications: [{ id }] })
}
