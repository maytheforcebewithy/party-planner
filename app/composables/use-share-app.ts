import { PROJECT_URL } from '~/config/project'
import { shareOrCopy } from '~/shared/sharing/share-text'
import type { ShareResult } from '~/shared/sharing/share-text'

/** Shares the app itself (with its project link) through the OS share sheet. */
export function useShareApp() {
  const { t } = useI18n()

  function shareApp(): Promise<ShareResult> {
    return shareOrCopy({
      title: t('app.title'),
      text: t('settings.about.shareText', { url: PROJECT_URL }),
    })
  }

  return { shareApp }
}
