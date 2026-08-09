import { beforeEach, describe, expect, it, vi } from 'vitest'

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

const { ensureNotificationPermission, scheduleNotification, cancelNotification }
  = await import('~/shared/notifications/local-notifications')

const notification = { id: 42, title: 'T', body: 'B', at: new Date(2999, 0, 1) }

describe('local-notifications helper', () => {
  beforeEach(() => {
    isNativePlatform.mockReturnValue(false)
    requestPermissions.mockReset()
    schedule.mockReset()
    cancel.mockReset()
  })

  it('is a no-op off-device: permission granted, nothing scheduled/cancelled', async () => {
    expect(await ensureNotificationPermission()).toBe(true)
    await scheduleNotification(notification)
    await cancelNotification(42)

    expect(requestPermissions).not.toHaveBeenCalled()
    expect(schedule).not.toHaveBeenCalled()
    expect(cancel).not.toHaveBeenCalled()
  })

  it('requests permission on a device and maps the grant', async () => {
    isNativePlatform.mockReturnValue(true)
    requestPermissions.mockResolvedValue({ display: 'granted' })
    expect(await ensureNotificationPermission()).toBe(true)

    requestPermissions.mockResolvedValue({ display: 'denied' })
    expect(await ensureNotificationPermission()).toBe(false)
  })

  it('schedules and cancels by id on a device', async () => {
    isNativePlatform.mockReturnValue(true)

    await scheduleNotification(notification)
    expect(schedule).toHaveBeenCalledWith({
      notifications: [{ id: 42, title: 'T', body: 'B', schedule: { at: notification.at } }],
    })

    await cancelNotification(42)
    expect(cancel).toHaveBeenCalledWith({ notifications: [{ id: 42 }] })
  })
})
