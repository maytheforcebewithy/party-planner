import { describe, expect, it } from 'vitest'
import { parseInvitationText } from '~/features/parties/services/parse-invitation'

const NOW = new Date('2026-08-01T00:00:00')

describe('parseInvitationText', () => {
  it('extracts name, date, time and location from a typical message', () => {
    const text = [
      'Sommerfest bei Anna 🎉',
      'Wann: 20.08.2026 um 18:00 Uhr',
      'Wo: Stadtpark, große Wiese',
      'Bringt gute Laune mit!',
    ].join('\n')

    const draft = parseInvitationText(text, NOW)

    expect(draft.name).toBe('Sommerfest bei Anna 🎉')
    expect(draft.date).toBe('2026-08-20')
    expect(draft.startTime).toBe('18:00')
    expect(draft.location).toBe('Stadtpark, große Wiese')
    expect(draft.description).toContain('Bringt gute Laune mit!')
  })

  it('handles a German month name and o-clock time, inferring the year', () => {
    const draft = parseInvitationText('Bens Geburtstag\nam 15. September, 19 Uhr\nOrt: bei mir zuhause', NOW)

    expect(draft.date).toBe('2026-09-15')
    expect(draft.startTime).toBe('19:00')
    expect(draft.location).toBe('bei mir zuhause')
  })

  it('rolls a year-less past date to next year', () => {
    const draft = parseInvitationText('Grillen\n5.7. um 17:00', NOW)
    expect(draft.date).toBe('2027-07-05')
  })

  it('parses an ISO date and an @ location', () => {
    const draft = parseInvitationText('Konzert\n2026-09-05 20:30 @Waldbühne', NOW)

    expect(draft.date).toBe('2026-09-05')
    expect(draft.startTime).toBe('20:30')
    expect(draft.location).toBe('Waldbühne')
  })

  it('returns the first line as name and nulls when nothing structured is found', () => {
    const draft = parseInvitationText('Just some text without details', NOW)

    expect(draft.name).toBe('Just some text without details')
    expect(draft.date).toBeNull()
    expect(draft.startTime).toBeNull()
    expect(draft.location).toBeNull()
  })
})
