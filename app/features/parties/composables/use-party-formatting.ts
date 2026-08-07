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

  /**
   * The event's time window as a display string, or `null` when no time is set.
   * Times are `HH:MM` strings from `<input type="time">`; both, either, or
   * neither may be present.
   */
  function displayTime(start: string | null, end: string | null): string | null {
    if (start && end) return t('detail.time.range', { start, end })
    if (start) return t('detail.time.from', { start })
    if (end) return t('detail.time.until', { end })
    return null
  }

  return { displayDate, displayTime }
}
