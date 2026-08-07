import { describe, expect, it } from 'vitest'
import { buildDemoInvitation, buildDemoParty } from '~/features/parties/services/demo-party'

const t = (key: string): string => key

describe('buildDemoParty', () => {
  it('dates the party three weeks out so it stays upcoming', () => {
    const party = buildDemoParty(t, new Date('2026-08-01T00:00:00.000Z'))
    expect(party.date).toBe('2026-08-22')
  })

  it('fills every field with a badge, guests and a shopping list', () => {
    const party = buildDemoParty(t, new Date('2026-08-01T00:00:00.000Z'))

    expect(party).toMatchObject({
      name: 'demo.name',
      location: 'demo.location',
      startTime: '16:00',
      endTime: '22:00',
      icon: 'balloon',
      color: 'amber',
    })
    expect(party.link).toContain('open.spotify.com')
    expect(party.guests).toHaveLength(5)
    expect(party.shopping?.length).toBeGreaterThan(0)
  })

  it('has a mix of RSVP states and shopping progress', () => {
    const party = buildDemoParty(t, new Date('2026-08-01T00:00:00.000Z'))
    const rsvps = new Set(party.guests?.map(guest => guest.rsvp))
    expect(rsvps).toEqual(new Set(['yes', 'pending', 'no']))
    expect(party.shopping?.some(item => item.done)).toBe(true)
    expect(party.shopping?.some(item => !item.done)).toBe(true)
  })

  it('only assigns shopping items to guests that exist', () => {
    const party = buildDemoParty(t, new Date('2026-08-01T00:00:00.000Z'))
    const guestIds = new Set(party.guests?.map(guest => guest.id))

    for (const item of party.shopping ?? []) {
      if (item.guestId !== null) expect(guestIds.has(item.guestId)).toBe(true)
    }
    // At least one item is assigned and at least one is open.
    expect(party.shopping?.some(item => item.guestId !== null)).toBe(true)
    expect(party.shopping?.some(item => item.guestId === null)).toBe(true)
  })
})

describe('buildDemoInvitation', () => {
  it('is a received invitation with a set reply and no guest list', () => {
    const invitation = buildDemoInvitation(t, new Date('2026-08-01T00:00:00.000Z'))

    expect(invitation.received).toBe(true)
    expect(invitation.attendance).toBe('yes')
    expect(invitation.guests ?? []).toHaveLength(0)
  })

  it('dates the invitation sooner than the own party but still upcoming', () => {
    const invitation = buildDemoInvitation(t, new Date('2026-08-01T00:00:00.000Z'))
    expect(invitation.date).toBe('2026-08-11')
  })

  it('has a short "bring" list with mixed done state', () => {
    const invitation = buildDemoInvitation(t, new Date('2026-08-01T00:00:00.000Z'))
    expect(invitation.shopping?.length).toBeGreaterThan(0)
    expect(invitation.shopping?.some(item => item.done)).toBe(true)
    expect(invitation.shopping?.some(item => !item.done)).toBe(true)
  })
})
