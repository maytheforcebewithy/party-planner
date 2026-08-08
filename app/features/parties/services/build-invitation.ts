import { formatEventDate } from './format-party'
import type { Party } from '../types/party'

/** Minimal translator shape so this stays a pure, testable function. */
export interface InvitationContext {
  readonly locale: string
  readonly t: (key: string, named?: Record<string, unknown>) => string
}

/** The localised time window ("18:00 – 23:30 Uhr"), or null when unset. */
function invitationTime(party: Party, t: InvitationContext['t']): string | null {
  const { startTime: start, endTime: end } = party
  if (start && end) return t('detail.time.range', { start, end })
  if (start) return t('detail.time.from', { start })
  if (end) return t('detail.time.until', { end })
  return null
}

/**
 * Compose a shareable, plain-text invitation for a party. Only the fields that
 * are set appear; free-form notes are appended after a blank line. The label
 * lines (and any emoji) come from the locale files so both languages stay in
 * control of the wording.
 */
export function buildInvitationText(party: Party, ctx: InvitationContext): string {
  const { t, locale } = ctx
  const lines: string[] = [t('share.invitation.heading', { name: party.name })]

  if (party.date) lines.push(t('share.invitation.date', { value: formatEventDate(party.date, locale) }))

  const time = invitationTime(party, t)
  if (time) lines.push(t('share.invitation.time', { value: time }))

  if (party.location) lines.push(t('share.invitation.location', { value: party.location }))
  if (party.link) lines.push(t('share.invitation.link', { value: party.link }))
  if (party.notes) lines.push('', party.notes)

  return lines.join('\n')
}
