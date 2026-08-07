import { Capacitor } from '@capacitor/core'
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem'
import { Share } from '@capacitor/share'

/** Default download mime type — the app's exports are JSON unless stated otherwise. */
const DEFAULT_MIME_TYPE = 'application/json'

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
    await Filesystem.writeFile({
      path: filename,
      data: content,
      directory: Directory.Cache,
      encoding: Encoding.UTF8,
    })
    const { uri } = await Filesystem.getUri({ path: filename, directory: Directory.Cache })
    await Share.share({ title: filename, files: [uri] })
    return
  }

  downloadInBrowser(content, filename, mimeType)
}

function downloadInBrowser(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}
