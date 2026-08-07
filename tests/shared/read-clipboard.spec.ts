import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('@capacitor/core', () => ({ Capacitor: { isNativePlatform: () => false } }))
vi.mock('@capacitor/clipboard', () => ({ Clipboard: { read: vi.fn() } }))

const { readClipboard } = await import('~/shared/clipboard/read-clipboard')

describe('readClipboard', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('reads the web clipboard text', async () => {
    vi.stubGlobal('navigator', { clipboard: { readText: vi.fn().mockResolvedValue('hello') } })
    expect(await readClipboard()).toBe('hello')
  })

  it('returns an empty string when the read is blocked', async () => {
    vi.stubGlobal('navigator', { clipboard: { readText: vi.fn().mockRejectedValue(new Error('denied')) } })
    expect(await readClipboard()).toBe('')
  })
})
