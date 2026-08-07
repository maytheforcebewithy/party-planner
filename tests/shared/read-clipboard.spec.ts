import { afterEach, describe, expect, it, vi } from 'vitest'

const isNativePlatform = vi.fn()
const read = vi.fn()
vi.mock('@capacitor/core', () => ({ Capacitor: { isNativePlatform: () => isNativePlatform() } }))
vi.mock('@capacitor/clipboard', () => ({ Clipboard: { read: () => read() } }))

const { readClipboard } = await import('~/shared/clipboard/read-clipboard')

describe('readClipboard', () => {
  afterEach(() => {
    vi.clearAllMocks()
    vi.unstubAllGlobals()
  })

  it('reads the device clipboard text', async () => {
    isNativePlatform.mockReturnValue(true)
    read.mockResolvedValue({ value: 'hello' })
    expect(await readClipboard()).toBe('hello')
  })

  it('returns an empty string when the device value is not text', async () => {
    isNativePlatform.mockReturnValue(true)
    read.mockResolvedValue({ value: undefined })
    expect(await readClipboard()).toBe('')
  })

  it('returns an empty string when the device read is blocked', async () => {
    isNativePlatform.mockReturnValue(true)
    read.mockRejectedValue(new Error('denied'))
    expect(await readClipboard()).toBe('')
  })

  it('reads the web clipboard text in the browser', async () => {
    isNativePlatform.mockReturnValue(false)
    vi.stubGlobal('navigator', { clipboard: { readText: vi.fn().mockResolvedValue('web text') } })
    expect(await readClipboard()).toBe('web text')
  })

  it('returns an empty string when the web read is blocked', async () => {
    isNativePlatform.mockReturnValue(false)
    vi.stubGlobal('navigator', { clipboard: { readText: vi.fn().mockRejectedValue(new Error('denied')) } })
    expect(await readClipboard()).toBe('')
  })

  it('returns an empty string when the web clipboard API is unavailable', async () => {
    isNativePlatform.mockReturnValue(false)
    vi.stubGlobal('navigator', {})
    expect(await readClipboard()).toBe('')
  })
})
