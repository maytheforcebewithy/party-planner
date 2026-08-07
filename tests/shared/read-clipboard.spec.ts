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

  it('never touches the web clipboard in the browser (no paste chip)', async () => {
    isNativePlatform.mockReturnValue(false)
    const readText = vi.fn()
    vi.stubGlobal('navigator', { clipboard: { readText } })
    expect(await readClipboard()).toBe('')
    expect(readText).not.toHaveBeenCalled()
  })
})
