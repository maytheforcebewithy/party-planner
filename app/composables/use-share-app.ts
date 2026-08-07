import { APP_STORE_LINKS } from '~/config/app-store'
import { shareOrCopy } from '~/shared/sharing/share-text'
import type { ShareResult } from '~/shared/sharing/share-text'

/** Shares the app itself (with its store links) through the OS share sheet. */
export function useShareApp() {
  const { t } = useI18n()

  function shareApp(): Promise<ShareResult> {
    return shareOrCopy({
      title: t('app.title'),
      text: t('settings.about.shareText', {
        android: APP_STORE_LINKS.android,
        ios: APP_STORE_LINKS.ios,
      }),
    })
  }

  return { shareApp }
}
