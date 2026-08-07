export type LanguageSetting = 'de' | 'en'

const STORAGE_KEY = 'party-planner.language'

/** The persisted language override, or `null` to keep auto-detection. */
export function readStoredLanguage(): LanguageSetting | null {
  if (!import.meta.client) return null
  const value = localStorage.getItem(STORAGE_KEY)
  return value === 'de' || value === 'en' ? value : null
}

/**
 * App settings that live on-device only. Language is backed by the i18n locale
 * (the source of truth) and persisted so the choice survives a restart.
 */
export function useSettings() {
  const { locale, setLocale } = useI18n()

  async function setLanguage(next: LanguageSetting): Promise<void> {
    await setLocale(next)
    if (import.meta.client) localStorage.setItem(STORAGE_KEY, next)
  }

  const language = computed<LanguageSetting>({
    get: () => (locale.value === 'en' ? 'en' : 'de'),
    set: value => void setLanguage(value),
  })

  return { language, setLanguage }
}
