import { Capacitor } from '@capacitor/core'
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem'
import { Share } from '@capacitor/share'
import { logger } from '~/shared/logger'

/** Default download mime type — the app's exports are JSON unless stated otherwise. */
const DEFAULT_MIME_TYPE = 'application/json'

/**
 * Delay before releasing the blob URL. Revoking it synchronously after `click()`
 * can cancel the download before the browser has started reading the blob, so we
 * defer to a later task; a small window is enough and never user-perceptible.
 */
const OBJECT_URL_REVOKE_DELAY_MS = 1000

/**
 * Persist a text file and hand it to the user. On a device it is written to the
 * shareable cache directory and offered through the OS share sheet; in the
 * browser it is downloaded with the given mime type.
 */
export async function saveOrShareFile(
  content: string,
  filename: string,
  mimeType: string = DEFAULT_MIME_TYPE,
): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    await writeToCacheAndShare(filename, content, Encoding.UTF8)
    return
  }
  triggerBrowserDownload(new Blob([content], { type: mimeType }), filename)
}

/**
 * Persist a binary image from a `data:` URL (e.g. a rendered PNG invitation) and
 * hand it to the user, mirroring {@link saveOrShareFile} but writing raw bytes.
 */
export async function saveOrShareImage(dataUrl: string, filename: string): Promise<void> {
  const { base64, mimeType } = parseDataUrl(dataUrl)
  if (Capacitor.isNativePlatform()) {
    // Omitting the encoding makes Filesystem treat the data as base64 bytes.
    await writeToCacheAndShare(filename, base64)
    return
  }
  triggerBrowserDownload(base64ToBlob(base64, mimeType), filename)
}

async function writeToCacheAndShare(filename: string, data: string, encoding?: Encoding): Promise<void> {
  await Filesystem.writeFile({
    path: filename,
    data,
    directory: Directory.Cache,
    ...(encoding ? { encoding } : {}),
  })
  const { uri } = await Filesystem.getUri({ path: filename, directory: Directory.Cache })
  try {
    await Share.share({ title: filename, files: [uri] })
  }
  catch (error) {
    // Dismissing the share sheet rejects (AbortError / "canceled") — that's a
    // normal no-op, not a failure. Anything else we log, rather than let a
    // fire-and-forget caller leak it as an unhandled rejection.
    const name = error instanceof Error ? error.name : ''
    const message = error instanceof Error ? error.message : ''
    if (name !== 'AbortError' && !/cancel/i.test(message)) {
      logger.error('Sharing the file failed', error)
    }
  }
}

function parseDataUrl(dataUrl: string): { base64: string, mimeType: string } {
  const match = /^data:(?<mime>[^;]+);base64,(?<data>.*)$/s.exec(dataUrl)
  if (!match?.groups) throw new Error('Expected a base64 data URL')
  return { base64: match.groups.data ?? '', mimeType: match.groups.mime ?? DEFAULT_MIME_TYPE }
}

function base64ToBlob(base64: string, mimeType: string): Blob {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new Blob([bytes], { type: mimeType })
}

function triggerBrowserDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  // Firefox only triggers the download for an anchor that is in the document.
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  setTimeout(() => URL.revokeObjectURL(url), OBJECT_URL_REVOKE_DELAY_MS)
}
