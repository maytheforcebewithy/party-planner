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

const { saveOrShareFile } = await import('~/shared/files/save-file')

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
})
