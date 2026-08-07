import { Capacitor } from '@capacitor/core'
import { Clipboard } from '@capacitor/clipboard'

/**
 * Read the clipboard's text, or `''` when it's empty or access is denied.
 * Uses the Capacitor Clipboard plugin on a device and the Web Clipboard API in
 * the browser. Never throws — a blocked read just yields an empty string.
 */
export async function readClipboard(): Promise<string> {
  try {
    if (Capacitor.isNativePlatform()) {
      const { value } = await Clipboard.read()
      return typeof value === 'string' ? value : ''
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard?.readText) {
      return await navigator.clipboard.readText()
    }
    return ''
  }
  catch {
    return ''
  }
}
