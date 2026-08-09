import { beforeEach, describe, expect, it, vi } from 'vitest'

const { isNativePlatform } = vi.hoisted(() => ({ isNativePlatform: vi.fn(() => false) }))
vi.mock('@capacitor/core', () => ({ Capacitor: { isNativePlatform } }))

const { writeFile, getUri } = vi.hoisted(() => ({
  writeFile: vi.fn(() => Promise.resolve()),
  getUri: vi.fn(() => Promise.resolve({ uri: 'file:///cache/export.json' })),
}))
vi.mock('@capacitor/filesystem', () => ({
  Filesystem: { writeFile, getUri },
  Directory: { Cache: 'CACHE' },
  Encoding: { UTF8: 'utf8' },
}))

const { share } = vi.hoisted(() => ({ share: vi.fn(() => Promise.resolve()) }))
vi.mock('@capacitor/share', () => ({ Share: { share } }))

const { saveOrShareFile, saveOrShareImage } = await import('~/shared/files/save-file')

// 'QUJD' is base64 for the bytes 'ABC'.
const PNG_DATA_URL = 'data:image/png;base64,QUJD'

describe('saveOrShareFile', () => {
  beforeEach(() => {
    isNativePlatform.mockReset().mockReturnValue(false)
    writeFile.mockClear()
    getUri.mockClear().mockResolvedValue({ uri: 'file:///cache/export.json' })
    share.mockClear()
  })

  it('writes to the cache directory and shares the file on a device', async () => {
    isNativePlatform.mockReturnValue(true)

    await saveOrShareFile('{"a":1}', 'export.json')

    expect(writeFile.mock.calls[0]?.[0]).toMatchObject({ path: 'export.json', directory: 'CACHE' })
    expect(share).toHaveBeenCalledWith({ title: 'export.json', files: ['file:///cache/export.json'] })
  })

  it('downloads in the browser when not on a device', async () => {
    const createObjectURL = vi.fn(() => 'blob:x')
    vi.stubGlobal('URL', { createObjectURL, revokeObjectURL: vi.fn() })

    await saveOrShareFile('{"a":1}', 'export.json')

    expect(createObjectURL).toHaveBeenCalledOnce()
    expect(share).not.toHaveBeenCalled()
    vi.unstubAllGlobals()
  })

  it('downloads with the given mime type', async () => {
    const createObjectURL = vi.fn(() => 'blob:x')
    vi.stubGlobal('URL', { createObjectURL, revokeObjectURL: vi.fn() })

    await saveOrShareFile('BEGIN:VCALENDAR', 'event.ics', 'text/calendar')

    expect((createObjectURL.mock.calls[0]?.[0] as Blob).type).toBe('text/calendar')
    vi.unstubAllGlobals()
  })

  it('defers revoking the object URL so the download can start first', async () => {
    vi.useFakeTimers()
    const revokeObjectURL = vi.fn()
    vi.stubGlobal('URL', { createObjectURL: vi.fn(() => 'blob:x'), revokeObjectURL })

    await saveOrShareFile('{"a":1}', 'export.json')

    expect(revokeObjectURL).not.toHaveBeenCalled()
    vi.runAllTimers()
    expect(revokeObjectURL).toHaveBeenCalledTimes(1)
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:x')

    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('writes the raw base64 bytes and shares the image on a device', async () => {
    isNativePlatform.mockReturnValue(true)
    getUri.mockResolvedValueOnce({ uri: 'file:///cache/invite.png' })

    await saveOrShareImage(PNG_DATA_URL, 'invite.png')

    const write = writeFile.mock.calls[0]?.[0]
    expect(write).toMatchObject({ path: 'invite.png', directory: 'CACHE', data: 'QUJD' })
    // No encoding → Filesystem writes the base64 payload as binary, not UTF-8 text.
    expect(write).not.toHaveProperty('encoding')
    expect(share).toHaveBeenCalledWith({ title: 'invite.png', files: ['file:///cache/invite.png'] })
  })

  it('downloads the decoded image with its mime type in the browser', async () => {
    const createObjectURL = vi.fn(() => 'blob:img')
    vi.stubGlobal('URL', { createObjectURL, revokeObjectURL: vi.fn() })

    await saveOrShareImage(PNG_DATA_URL, 'invite.png')

    expect(createObjectURL).toHaveBeenCalledOnce()
    expect((createObjectURL.mock.calls[0]?.[0] as Blob).type).toBe('image/png')
    expect(writeFile).not.toHaveBeenCalled()
    vi.unstubAllGlobals()
  })

  it('rejects a value that is not a base64 data URL', async () => {
    await expect(saveOrShareImage('not-a-data-url', 'invite.png')).rejects.toThrow('base64 data URL')
  })
})
