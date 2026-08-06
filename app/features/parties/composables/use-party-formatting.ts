import type { Party } from '../types/party'
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

  /** Compact "date · location" line for list rows; empty when neither is set. */
  function subtitle(party: Party): string {
    const parts: string[] = []
    if (party.date) parts.push(formatEventDate(party.date, locale.value))
    if (party.location) parts.push(party.location)
    return parts.join(' · ')
  }

  return { displayDate, subtitle }
}
