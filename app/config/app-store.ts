/**
 * Public store links for the app. Placeholders until the app is published —
 * update these once the real listings exist. The Android id mirrors the
 * Capacitor app id (`de.kikimika.partyplanner`).
 */
export const APP_STORE_LINKS = {
  android: 'https://play.google.com/store/apps/details?id=de.kikimika.partyplanner',
  ios: 'https://apps.apple.com/app/party-planner/id000000000',
} as const

/**
 * Ko-fi "buy us a coffee" donation link, shown in Settings. Donations are exempt
 * from the Google Play in-app-billing requirement (verify current Play policy).
 * TODO: replace the handle with the real Ko-fi account before release.
 */
export const SUPPORT_URL = 'https://ko-fi.com/kikimika'
