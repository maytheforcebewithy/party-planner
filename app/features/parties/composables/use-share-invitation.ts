import { shareOrCopy } from '~/shared/sharing/share-text'
import type { ShareResult } from '~/shared/sharing/share-text'
import { buildInvitationText } from '../services/build-invitation'
import type { Party } from '../types/party'

export type { ShareResult }

/**
 * Shares a party's invitation through the OS share sheet, falling back to the
 * clipboard (see {@link shareOrCopy}).
 */
export function useShareInvitation() {
  const { locale, t } = useI18n()

  function shareInvitation(party: Party): Promise<ShareResult> {
    const text = buildInvitationText(party, { locale: locale.value, t })
    const title = t('share.invitation.title', { name: party.name })
    return shareOrCopy({ title, text })
  }

  return { shareInvitation }
}
