import { describe, expect, it } from 'vitest'
import { buildInvitationText } from '~/features/parties/services/build-invitation'
import type { Party } from '~/features/parties/types/party'

// Fake translator mirroring the invitation label templates so the composed
// text can be asserted without loading vue-i18n.
const t = (key: string, named: Record<string, unknown> = {}): string => {
  const map: Record<string, string> = {
    'share.invitation.heading': `Einladung: ${named.name}`,
    'share.invitation.date': `Datum: ${named.value}`,
    'share.invitation.time': `Zeit: ${named.value}`,
    'share.invitation.location': `Ort: ${named.value}`,
    'detail.time.range': `${named.start} – ${named.end} Uhr`,
    'detail.time.from': `ab ${named.start} Uhr`,
    'detail.time.until': `bis ${named.end} Uhr`,
  }
  return map[key] ?? key
}

const base: Party = {
  id: 'p1',
  name: 'Gartenparty',
  date: null,
  location: null,
  description: null,
  startTime: null,
  endTime: null,
  hinweise: null,
  icon: null,
  color: null,
  guests: [],
  shopping: [],
  createdAt: '',
  updatedAt: '',
}

const ctx = { locale: 'de-DE', t }

describe('buildInvitationText', () => {
  it('includes only the heading when nothing else is set', () => {
    expect(buildInvitationText(base, ctx)).toBe('Einladung: Gartenparty')
  })

  it('assembles every field in order with hinweise after a blank line', () => {
    const party: Party = {
      ...base,
      date: '2026-08-20',
      startTime: '18:00',
      endTime: '23:30',
      location: 'Stadtpark',
      hinweise: 'Bitte eine Decke mitbringen.',
    }

    const text = buildInvitationText(party, ctx)

    expect(text).toBe(
      'Einladung: Gartenparty\n'
      + 'Datum: 20. August 2026\n'
      + 'Zeit: 18:00 – 23:30 Uhr\n'
      + 'Ort: Stadtpark\n'
      + '\n'
      + 'Bitte eine Decke mitbringen.',
    )
  })

  it('labels a start-only and end-only time window', () => {
    expect(buildInvitationText({ ...base, startTime: '18:00' }, ctx)).toContain('Zeit: ab 18:00 Uhr')
    expect(buildInvitationText({ ...base, endTime: '23:30' }, ctx)).toContain('Zeit: bis 23:30 Uhr')
  })

  it('omits lines for fields that are not set', () => {
    const text = buildInvitationText({ ...base, location: 'Park' }, ctx)
    expect(text).toBe('Einladung: Gartenparty\nOrt: Park')
  })
})
