import { createId } from '~/shared/utils/id'
import type { CreateParty } from '../types/party'

/** Days from today used for the demo party's date, so it stays upcoming. */
const DEMO_LEAD_DAYS = 21
/** Days out for the demo received invitation (sooner than the own party). */
const DEMO_INVITATION_LEAD_DAYS = 10

/** ISO `yyyy-mm-dd` for a date `days` from `now`, in local time (not UTC). */
function isoDaysFromNow(now: Date, days: number): string {
  const date = new Date(now)
  date.setDate(date.getDate() + days)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

/**
 * A fully populated, realistic example party for first-time exploration. Every
 * field is set (badge, times, guests with mixed RSVPs, a shopping list with
 * assignments). Text is localised via `t`; guest names are language-neutral.
 * All food is vegetarian, per the project's demo-data rule.
 */
export function buildDemoParty(t: (key: string) => string, now: Date): CreateParty {
  const anna = { id: createId(), name: 'Anna', rsvp: 'yes' as const }
  const ben = { id: createId(), name: 'Ben', rsvp: 'yes' as const }
  const clara = { id: createId(), name: 'Clara', rsvp: 'pending' as const }
  const david = { id: createId(), name: 'David', rsvp: 'no' as const }
  const emma = { id: createId(), name: 'Emma', rsvp: 'yes' as const }

  return {
    name: t('demo.name'),
    date: isoDaysFromNow(now, DEMO_LEAD_DAYS),
    startTime: '16:00',
    endTime: '22:00',
    location: t('demo.location'),
    description: t('demo.description'),
    notes: t('demo.notes'),
    icon: 'balloon',
    color: 'amber',
    link: 'https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd',
    guests: [anna, ben, clara, david, emma],
    shopping: [
      { id: createId(), name: t('demo.shopping.skewers'), done: false, guestId: anna.id },
      { id: createId(), name: t('demo.shopping.halloumi'), done: false, guestId: ben.id },
      { id: createId(), name: t('demo.shopping.salads'), done: false, guestId: emma.id },
      { id: createId(), name: t('demo.shopping.bread'), done: true, guestId: null },
      { id: createId(), name: t('demo.shopping.drinks'), done: true, guestId: null },
      { id: createId(), name: t('demo.shopping.tableware'), done: false, guestId: null },
    ],
  }
}

/**
 * A realistic example of a received invitation, so a full seed also populates
 * the invitations tab: a reply is set ('yes'), and the list is a couple of
 * things to bring (vegetarian). It has no guest list — you're a guest here.
 */
export function buildDemoInvitation(t: (key: string) => string, now: Date): CreateParty {
  return {
    name: t('demo.invitation.name'),
    date: isoDaysFromNow(now, DEMO_INVITATION_LEAD_DAYS),
    startTime: '19:00',
    location: t('demo.invitation.location'),
    description: t('demo.invitation.description'),
    icon: 'gift',
    color: 'pink',
    received: true,
    attendance: 'yes',
    shopping: [
      { id: createId(), name: t('demo.invitation.bring.dessert'), done: false, guestId: null },
      { id: createId(), name: t('demo.invitation.bring.drinks'), done: true, guestId: null },
    ],
  }
}
