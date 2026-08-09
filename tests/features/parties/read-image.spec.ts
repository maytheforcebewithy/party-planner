import { afterEach, describe, expect, it, vi } from 'vitest'
import { readImageAsDataUrl, scaledDimensions } from '~/features/parties/services/read-image'

describe('scaledDimensions', () => {
  it('does not upscale an image already within the max', () => {
    expect(scaledDimensions(200, 100, 512)).toEqual({ width: 200, height: 100 })
  })

  it('scales a landscape image down to the max long edge', () => {
    expect(scaledDimensions(1024, 512, 512)).toEqual({ width: 512, height: 256 })
  })

  it('scales a portrait image down to the max long edge', () => {
    expect(scaledDimensions(512, 1024, 512)).toEqual({ width: 256, height: 512 })
  })

  it('never rounds an edge down to zero', () => {
    expect(scaledDimensions(1000, 1, 10)).toEqual({ width: 10, height: 1 })
  })
})

// Minimal fakes for the browser APIs read-image relies on; happy-dom has no
// canvas 2D context, so the async paths are exercised through stubs.
function stubFileReader(result: string, options: { fail?: boolean } = {}): void {
  class FakeFileReader {
    result: string | null = null
    error: unknown = null
    onload: (() => void) | null = null
    onerror: (() => void) | null = null
    readAsDataURL(): void {
      queueMicrotask(() => {
        if (options.fail) {
          this.error = new Error('read failed')
          this.onerror?.()
        }
        else {
          this.result = result
          this.onload?.()
        }
      })
    }
  }
  vi.stubGlobal('FileReader', FakeFileReader)
}

function stubImage(width: number, height: number, options: { fail?: boolean } = {}): void {
  class FakeImage {
    width = width
    height = height
    onload: (() => void) | null = null
    onerror: (() => void) | null = null
    set src(_value: string) {
      queueMicrotask(() => (options.fail ? this.onerror?.() : this.onload?.()))
    }
  }
  vi.stubGlobal('Image', FakeImage)
}

function stubCanvas(context: unknown, dataUrl = 'data:image/jpeg;base64,SCALED'): void {
  const original = document.createElement.bind(document)
  const canvas = { width: 0, height: 0, getContext: () => context, toDataURL: () => dataUrl }
  vi.spyOn(document, 'createElement').mockImplementation((tag: string) =>
    (tag === 'canvas' ? (canvas as unknown as HTMLCanvasElement) : original(tag)),
  )
}

describe('readImageAsDataUrl', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('returns a downscaled JPEG data URL from the canvas', async () => {
    stubFileReader('data:image/png;base64,ORIGINAL')
    stubImage(1024, 512)
    const drawImage = vi.fn()
    stubCanvas({ drawImage })

    const url = await readImageAsDataUrl(new File([], 'badge.png'), 512)

    expect(url).toBe('data:image/jpeg;base64,SCALED')
    expect(drawImage).toHaveBeenCalledOnce()
  })

  it('falls back to the original when no 2D context is available', async () => {
    stubFileReader('data:image/png;base64,ORIGINAL')
    stubImage(100, 100)
    stubCanvas(null)

    expect(await readImageAsDataUrl(new File([], 'badge.png'))).toBe('data:image/png;base64,ORIGINAL')
  })

  it('rejects when the file cannot be read', async () => {
    stubFileReader('', { fail: true })

    await expect(readImageAsDataUrl(new File([], 'badge.png'))).rejects.toThrow('read failed')
  })

  it('rejects when the image cannot be decoded', async () => {
    stubFileReader('data:image/png;base64,ORIGINAL')
    stubImage(0, 0, { fail: true })

    await expect(readImageAsDataUrl(new File([], 'badge.png'))).rejects.toThrow('decode')
  })
})
