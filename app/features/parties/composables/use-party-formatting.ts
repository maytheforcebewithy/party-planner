import { formatEventDate } from '../services/format-party'

/**
 * View-model helpers that turn a party into localised display strings. Keeps
 * date/locale logic out of templates and components.
 */
export function usePartyFormatting() {
  const { locale, t } = useI18n()

  /** The event date, localised, or a "no date" fallback label. */
  function displayDate(iso: string | null): string {
    return iso ? formatEventDate(iso, locale.value) : t('detail.noDate')
  }

  return { displayDate }
}
