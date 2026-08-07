import { Capacitor } from '@capacitor/core'
import { Clipboard } from '@capacitor/clipboard'

/**
 * Read the clipboard's text on a device, or `''` otherwise (empty, denied, or
 * running in the browser). Native only on purpose: the browser's Web Clipboard
 * API pops a "paste" confirmation chip on every programmatic read, so in the
 * browser we skip it and let the user paste into the textarea manually. Never
 * throws — a blocked read just yields an empty string.
 */
export async function readClipboard(): Promise<string> {
  if (!Capacitor.isNativePlatform()) return ''
  try {
    const { value } = await Clipboard.read()
    return typeof value === 'string' ? value : ''
  }
  catch {
    return ''
  }
}
