import { Share } from '@capacitor/share'
import { buildInvitationText } from '../services/build-invitation'
import type { Party } from '../types/party'

export type ShareResult = 'shared' | 'cancelled' | 'copied' | 'unavailable'

/**
 * Shares a party's invitation through the OS share sheet (Capacitor Share, which
 * uses the Web Share API in the browser). Falls back to copying the text to the
 * clipboard where sharing is unavailable, so the action is never a dead end.
 */
export function useShareInvitation() {
  const { locale, t } = useI18n()

  async function shareInvitation(party: Party): Promise<ShareResult> {
    const text = buildInvitationText(party, { locale: locale.value, t })
    const title = t('share.invitation.title', { name: party.name })

    try {
      const { value: canShare } = await Share.canShare()
      if (canShare) {
        await Share.share({ title, text, dialogTitle: title })
        return 'shared'
      }
    }
    catch (error) {
      // The user dismissing the share sheet is not a failure.
      if (error instanceof Error && error.name === 'AbortError') return 'cancelled'
    }

    try {
      await navigator.clipboard.writeText(text)
      return 'copied'
    }
    catch {
      return 'unavailable'
    }
  }

  return { shareInvitation }
}
