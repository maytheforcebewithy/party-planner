export type LanguageCode = 'de' | 'en'

const STORAGE_KEY = 'party-planner.language'

/** Locales that ship with a complete translation file (kept at i18n key parity). */
const SUPPORTED_LANGUAGES: readonly LanguageCode[] = ['de', 'en']

/**
 * Language the app renders on a fresh install, before the user has answered the
 * first-run picker. English is the neutral default for the store listings; the
 * picker then lets the user switch immediately and the choice is persisted.
 */
export const FIRST_RUN_LANGUAGE: LanguageCode = 'en'

function isLanguageCode(value: unknown): value is LanguageCode {
  return SUPPORTED_LANGUAGES.includes(value as LanguageCode)
}

/** The persisted language choice, or `null` when the user hasn't chosen yet. */
export function readStoredLanguage(): LanguageCode | null {
  if (!import.meta.client) return null
  const value = localStorage.getItem(STORAGE_KEY)
  return isLanguageCode(value) ? value : null
}

export interface LanguageOption {
  readonly value: LanguageCode
  /** The language's own endonym (e.g. "Deutsch"), so users recognise it. */
  readonly label: string
}

/**
 * Language state for the app: the active locale (i18n is the source of truth),
 * the on-device choice persisted to localStorage so it survives a restart, and
 * whether the first-run picker still needs to be shown.
 */
export function useLanguage() {
  const { locale, locales, setLocale } = useI18n()
  const chosen = useState('language-chosen', () => readStoredLanguage() !== null)

  const options = computed<LanguageOption[]>(() =>
    SUPPORTED_LANGUAGES.map(code => ({
      value: code,
      label: locales.value.find(entry => entry.code === code)?.name ?? code,
    })),
  )

  async function setLanguage(next: LanguageCode): Promise<void> {
    await setLocale(next)
    if (import.meta.client) localStorage.setItem(STORAGE_KEY, next)
    chosen.value = true
  }

  const language = computed<LanguageCode>({
    get: () => (isLanguageCode(locale.value) ? locale.value : FIRST_RUN_LANGUAGE),
    set: value => void setLanguage(value),
  })

  const hasChosenLanguage = computed(() => chosen.value)

  return { language, options, setLanguage, hasChosenLanguage }
}
