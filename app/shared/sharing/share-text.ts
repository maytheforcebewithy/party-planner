import { Share } from '@capacitor/share'

export type ShareResult = 'shared' | 'cancelled' | 'copied' | 'unavailable'

/** The i18n key for the user notice after a share, or `null` when none is needed. */
export function shareNoticeKey(result: ShareResult): string | null {
  if (result === 'copied') return 'share.copied'
  if (result === 'unavailable') return 'share.unavailable'
  return null
}

/**
 * Share plain text through the OS share sheet (Capacitor Share, which uses the
 * Web Share API in the browser), falling back to copying it to the clipboard so
 * the action never dead-ends. A dismissed sheet is reported as `cancelled`.
 */
export async function shareOrCopy(payload: { title: string, text: string }): Promise<ShareResult> {
  try {
    const { value: canShare } = await Share.canShare()
    if (canShare) {
      await Share.share({ title: payload.title, text: payload.text, dialogTitle: payload.title })
      return 'shared'
    }
  }
  catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return 'cancelled'
  }

  try {
    await navigator.clipboard.writeText(payload.text)
    return 'copied'
  }
  catch {
    return 'unavailable'
  }
}
